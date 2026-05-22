import React, { useState } from 'react'
import { roomsDummyData } from '../../assets/assets'
import Title from '../../components/Title'

const ListRoom = () => {

    const [rooms, setRooms] = useState(roomsDummyData)

  return (
    <div>
      <Title align='left' font='outfit' title='Room Listings'
      subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.'/>
    </div>
  )
}

export default ListRoom
