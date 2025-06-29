import React from 'react'
import CollegeNavbar from '../components/Landing/CollegeNavbar'

const CollegeLanding = () => {
  return (
    <div className='h-screen'
    style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
    <CollegeNavbar />
    <div className=' flex justify-center'>
       Welcome Make Your Coding Culture more and more better
    </div>
    </div>
  )
}

export default CollegeLanding
