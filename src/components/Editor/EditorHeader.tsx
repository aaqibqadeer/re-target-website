import React from 'react'

interface EditorHeaderProps {
  logout: () => void
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ logout }) => {
  return (
    <div className='flex justify-between items-center mb-4'>
      <h1 className='text-2xl font-bold mb-4'>Data Editor</h1>

      <button
        onClick={logout}
        className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
      >
        Logout
      </button>
    </div>
  )
}