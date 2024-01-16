
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
  defaultDropAnimationSideEffects,
  closestCorners
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
  //Cung 1 thoi diem chi co 1 phan tu dang duoc keo(column hoac card)
  const [activeDragItemId, setActiveDragItemId] = useState([])

  const [activeDragItemType, setActiveDragItemType] = useState([])

  const [activeDragItemData, setActiveDragItemData] = useState([])

  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)


  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])


  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  //Funtcion
  const moveCardBetwweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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
        //phai cap nhat lai chuan du lieu columnId trong Card sau khi keo card giua 2 column khac nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        //Them card dang keo vao overColumn theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    //Neu la keo card thi moi xu li
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
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
      moveCardBetwweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = (event) => {

    const { active, over } = event
    if ( !active || !over ) return
    //Xu li keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDraggingCard: la card dang duoc keo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      //OvwrCard: la cai card dang tuong tac tren hoac duoi so voi card dang duoc keo
      const { id: overCardId } = over

      //Tim 2 column theo cardID
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetwweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )

      } else {
        // console.log('Keo tha card trong 1 column') tuong tu xu li keo tha column trong 1 board content

        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex( c => c._id === activeDragItemId)
        //Lay vi tri moi(tu over)
        const newCardIndex = overColumn?.cards?.findIndex( c => c._id === overCardId)

        // Dung arrayMove de sap xep lai magnColumns ban dau
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns(prevColumns => {

          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)
          //Cap nhat lai 2 gia tri moi
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          return nextColumns
        })
      }
    }
    //Xu li keo tha column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //Neu vi tri sau khi keo tha khac voi vi tri ban dau
      if (active.id !== over.id) {
        //Lay vi tri cu (tu active)
        const oldColumnIndex = orderedColumns.findIndex( c => c._id === active.id)
        //Lay vi tri moi(tu over)
        const newColumnIndex = orderedColumns.findIndex( c => c._id === over.id)

        // Dung arrayMove de sap xep lai magnColumns ban dau
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        //Cap nhat lai state columns ban dau sau khi keo tha
        setOrderedColumns(dndOrderedColumns)
      }
    }

    //Nhung du lieu sau khi keo tha nay luon phai dua ve null mac dinh ban dau
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  //Animation khi tha
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
      //Thuat taon phat hien va cham
      collisionDetection={closestCorners}
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
