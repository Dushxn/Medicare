import React from 'react'
import Sidebar from '../../shared/Sidebar'

const PatientProfile = () => {
  return (
    <>
     <div className='flex'>
      <Sidebar  />
        <div className="pl-20">
        {/* Your main content goes here */}
        <h1 className='text-[40px] font-bold' >Medi<span className='text-blue-500'>Care</span></h1>
      </div>
     </div>
    </>
  )
}

export default PatientProfile
