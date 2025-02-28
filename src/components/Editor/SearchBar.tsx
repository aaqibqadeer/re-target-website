import React, { useState } from 'react'
import { handleExport } from '@/utils/export'

interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  data: any
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm,
  data
}) => {
  const [selectedVersion, setSelectedVersion] = useState('')

  return (
    <div className='flex flex-wrap gap-4 mb-4'>
      <input
        type='text'
        placeholder='Search...'
        className='flex-1 p-2 border rounded'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className='p-2 border rounded bg-white disabled:bg-gray-100'
        value={selectedVersion}
        onChange={(e) => setSelectedVersion(e.target.value)}
        disabled
      >
        <option value=''>Select Version</option>
        <option value='1.0'>Version 1.0</option>
        <option value='1.1'>Version 1.1</option>
        <option value='1.2'>Version 1.2</option>
      </select>

      <button
        onClick={() => handleExport(data, 'json')}
        className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600'
      >
        Export JSON
      </button>

      <button
        onClick={() => handleExport(data, 'csv')}
        className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600'
      >
        Export CSV
      </button>
    </div>
  )
}