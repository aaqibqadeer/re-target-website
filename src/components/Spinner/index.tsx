import React from 'react'

export const Spinner = () => {
  return (
    <div className='flex items-center justify-center p-8'>
      <div className='relative'>
        <div className='w-12 h-12 rounded-full border-4 border-gray-200'></div>
        <div className='w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute left-0 top-0'></div>
      </div>
    </div>
  )
}
