import { SignUp } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <>
      <div className='flex flex-col items-center gap-4'>
        <div className='flex flex-col items-center'>
          <h1>This app is on a trial mode!</h1>
          <h2>If you require some more information, please get in touch</h2>
          <h3>appmoodmeter51@gmail.com</h3>
        </div>
        <div className=' flex'>
          <SignUp />
        </div>
      </div>
    </>
  )
}

export default page