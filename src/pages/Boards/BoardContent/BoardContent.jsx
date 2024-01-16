
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
  //Neu dung PointerSensor mac dinh thi phai ket hop thuoc tinh Css touch-action: none o nhung phan tu keo tha-con bug
  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 } })
  //Yeu cau chuot di chuyen 10px thi moi goi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  //Nhan giu 250ms va dung sai cua cam ung 500px
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  //Cung 1 thoi ddiem chi co 1 phan tu dang duoc keo(column hoac card)
  const [activeDragItemId, setActiveDragItemId] = useState([])

  const [activeDragItemType, setActiveDragItemType] = useState([])

  const [activeDragItemData, setActiveDragItemData] = useState([])


  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])


  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }
  //triger trong qua trinh keo 1 phan tu
  const handleDragOver = (event) => {
    // khong lam gi them khi keo column
    if ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) return

    // Neu keo card thi xu li them de keo card qua lai giua cac column
    const { active, over } = event
    //Neu k ton tai over(keo linh tinh ra ngoai)
    if ( !active || !over ) return

    //activeDraggingCard: la card dang duoc keo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    //OvwrCard: la cai card dang tuong tac tren hoac duoi so voi card dang duoc keo
    const { id: overCardId } = over

    //Tim 2 column theo cardID
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    //Neu 2 column khac nhau thi moi xu li logic
    if (activeColumn._id !== overColumn._id ) {
      setOrderedColumns(prevColumns => {
        //Tim vi tri cua cai overCard trong column dich
        const overCardIndex = overColumn?.cards?.findIndex(card => card?._id === overCardId )


        //Logic tinh toan "cardIndex moi"
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
        //Clone mang orderedColumnState cu ra 1 cai moi de xu ly data roi return - cap nhat lai  orderedColumnState  moi
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)


        if (nextActiveColumn) {
          //xoa card khoi cai column active
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId )

          //Cap nhat lai cardOderIds
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        if (nextOverColumn) {
          //Kiem tra xem card dang keo no co ton tai o overColumn hay chua, neu co thi can phai xoa no truoc
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId )

          //Them card dang keo vao overColumn theo vi tri index moi
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        return nextColumns
      })
    }
  }

  const handleDragEnd = (event) => {

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('Hanh dong keo tha card, khong lma gi ca')
      return
    }
    const { active, over } = event


    if ( !active || !over ) return

    //Neu vi tri sau khi keo tha khac voi vi tri ban dau
    if (active.id !== over.id) {
      //Lay vi tri cu (tu active)
      const oldIndex = orderedColumns.findIndex( c => c._id === active.id)
      //Lay vi tri moi(tu over)
      const newIndex = orderedColumns.findIndex( c => c._id === over.id)

      // Dung arrayMove de sap xep lai magnColumns ban dau
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)

      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      //Cap nhat lai state columns ban dau sau khi keo tha
      setOrderedColumns(dndOrderedColumns)
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext
      sensors = {sensors}
      onDragStart={handleDragStart}
      onDragOver={(handleDragOver)}
      onDragEnd={handleDragEnd}
    >
      <Box sx= {{
        bgcolor: (theme) => ( theme.palette.mode === 'dark' ? '#34495e' : '#1976d2' ),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
