// app/admin/components/SectionCard.tsx
'use client'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export default function SectionCard ({ title, link, icon }) {
  return (
    <Link href={link}>
      <div className='bg-white shadow hover:shadow-md p-6 border hover:border-indigo-500 rounded-xl transition cursor-pointer'>
        <h3 className='mb-2 font-bold text-xl'>{icon} {title}</h3>
        <p className='text-gray-600'>Manage {title.toLowerCase()} here.</p>
        <div className='flex items-center space-x-1 mt-3 text-indigo-600'>
          <span>Go to {title}</span>
          <FiArrowRight />
        </div>
      </div>
    </Link>
  )
}
