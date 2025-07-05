import React from 'react'
import Navbar from '../components/Landing/navbar'

const EventTracker = () => {
  return (
    <div className='h-screen'
    style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
         <Navbar />
      
    </div>
  )
}

export default EventTracker
