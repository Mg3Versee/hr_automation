// import Navbar from '@/components/navbar/Navbar'
// import React from 'react'

// const page = () => {
//   return (
//     <div>
//        <Navbar />
//     </div>
//   )
// }

// export default page

import Navbar from "@/components/navbar/Navbar";
import SchedulerInterface from "@/components/SchedulerInterface/SchedulerInterface";

export const dynamic = "force-dynamic";

export default function SchedulerPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <SchedulerInterface />
    </div>
  );
}
