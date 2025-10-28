import SignupPage from '@/components/loginForm/SignUp'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar />
        <div>
            <SignupPage />
        </div>
    </div>
  )
}

export default page