
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  //Neu dung PointerSensor mac dinh thi phai ket hop thuoc tinh Css touch-action: none o nhung phan tu keo tha-con bug
  // const pointerSensor = useSensor(PointerSensor, {activationConstraint: { distance: 10 } })
  //Yeu cau chuot di chuyen 10px thi moi goi event
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 } })
  //Nhan giu 250ms va dung sai cua cam ung 500px
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handleDragEnd = (event) => {
    console.log('handleDragEnd', event)
    const { active, over } = event

    if (!over) return

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
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors = {sensors}>
      <Box sx= {{
        bgcolor: (theme) => ( theme.palette.mode === 'dark' ? '#34495e' : '#1976d2' ),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
