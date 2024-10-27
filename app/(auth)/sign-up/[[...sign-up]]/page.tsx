import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const SignUp = () => {
  return (
    <div className='flex flex-col items-center'>
      <div className='mb-4'>
        <h1>I am sorry! At the moment the app is not accepting new users</h1>
      </div>
      <div className=' flex gap-2 '>
        <Link href="/">
          <Button variant="secondary" className='w-25 align-middle justify-center'>Homepage</Button>
        </Link>

        <Link href="/sign-in">
          <Button variant="default" className='w-25 align-middle justify-center'>Sign in</Button>
        </Link>

      </div>
    </div>
  )
}

export default SignUp