import React from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  return (
    <div>
      <Title align='left' font='outfit' title='Dashboard'
      subTitle='Monitor your room listings, track bookings and analyze revenue-all in one place. Stay updated with real-time insights to ensure smooth operations.'/>
        <div className='flex gap-4 my-8'>
            {/* Total Bookings */}
            <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
                <img src={assets.totalBookingIcon} alt="" className='max-sm:hidden h-10' />

            </div>
            {/* Total Revenue */}
            <div></div>

        </div>
    </div>
  )
}

export default Dashboard
