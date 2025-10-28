import AssessmentInterface from '@/components/assementInterface/AssessmentInterface'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar />
        <div>
          <AssessmentInterface />
          </div>
    </div>
  )
}

export default page