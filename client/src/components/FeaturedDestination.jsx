import React from 'react'
import { roomsDummyData } from '../assets/assets'
import HotelCard from './HotelCard'

const FeaturedDestination = () => {
  return (
    <div>
      <div>
        {roomsDummyData.slice(0,4).map((room, index)=>(
            <HotelCard key={room._id} room={room} index={index}/>
        ))}
      </div>
    </div>
  )
}

export default FeaturedDestination
