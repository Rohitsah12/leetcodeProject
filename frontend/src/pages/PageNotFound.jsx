import React from 'react'

const PageNotFound = () => {
  return (
    <div className='h-screen bg-black '
    style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

      <h1 className='text-white text-5xl font-bold flex justify-center pt-50'>
        404 Page Not Found
      </h1>
      
    </div>
  )
}

export default PageNotFound
