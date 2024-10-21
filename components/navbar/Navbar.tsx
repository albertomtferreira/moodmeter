import React from 'react'
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'

const Navbar = () => {
  return (
    <div className='flex flex-row justify-between items-center'>
      <LeftMenu />
      <div className='top-4 mx-auto'>
        <img src="/assets/images/LogoHorizontal.svg" alt="Logo" className="h-20" />
      </div>

      <RightMenu />
    </div>
  )
}

export default Navbar