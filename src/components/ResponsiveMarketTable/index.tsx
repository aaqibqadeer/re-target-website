import React, { useState, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { Properties, tableColumns } from '@/lib/tableProperties'
import { MarketCategory } from '@/lib/data'
import {MobileView} from './MobileView'

export const ResponsiveMarketTable = ({ data }: { data: MarketCategory }) => {
  const [filterText, setFilterText] = useState('')
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter data based on search text but keep original order
  const filteredData = useMemo(() => {
    return data.list.filter((item) => {
      return (
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.city.toLowerCase().includes(filterText.toLowerCase()) ||
        item.state.toLowerCase().includes(filterText.toLowerCase()) ||
        item.serviceArea?.toLowerCase().includes(filterText.toLowerCase())
      )
    })
  }, [filterText, data.list])

  // Sort data for mobile/tablet view only when a sort field is selected
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData; // Return filtered data in original order if no sort field
    
    return [...filteredData].sort((a, b) => {
      let compareValueA = a[sortField as keyof typeof a]
      let compareValueB = b[sortField as keyof typeof b]

      // Handle undefined or string comparison
      compareValueA = compareValueA || ''
      compareValueB = compareValueB || ''

      if (typeof compareValueA === 'string') {
        return sortDirection === 'asc'
          ? compareValueA.localeCompare(compareValueB as string)
          : (compareValueB as string).localeCompare(compareValueA)
      } else {
        return sortDirection === 'asc'
          ? Number(compareValueA) - Number(compareValueB)
          : Number(compareValueB) - Number(compareValueA)
      }
    })
  }, [filteredData, sortField, sortDirection])

  const handleSort = (field: string | null) => {
    if (field === null) {
      // Clear sorting
      setSortField(null)
      return
    }
    
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className='market-table my-16'>
      <h2 className='font-semibold text-gray-800 mb-4 text-xl md:text-2xl'>
        {data.name}
      </h2>

      <div className='mb-4'>
        <input
          type='text'
          placeholder='Search by name, city, state, or service area'
          className='p-2 border rounded w-full max-w-md'
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <div className='hidden lg:block'>
        <DataTable 
          columns={tableColumns} 
          data={filteredData} 
          {...Properties} 
        />
      </div>

      <MobileView 
        originalData={filteredData}
        sortedData={sortedData}
        sortField={sortField}
        handleSort={handleSort}
      />
    </div>
  )
}
