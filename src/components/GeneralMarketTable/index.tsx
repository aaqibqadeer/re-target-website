import React from 'react'
import { useState, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { Properties, tableColumns as columns } from '@/lib/tableProperties'
import { MarketCategory } from '@/lib/data'
import { commonProperties } from '@/lib/properties'

export const GeneralMarketTable = ({ data }: { data: MarketCategory }) => {
  const [filterText, setFilterText] = useState('')

  const filteredData = useMemo(() => {
    return data.list.filter((item) => {
      return (
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.city.toLowerCase().includes(filterText.toLowerCase()) ||
        item.state.toLowerCase().includes(filterText.toLowerCase()) ||
        item.serviceArea?.toLowerCase().includes(filterText.toLowerCase())
      )
    })
  }, [filterText])

  return (
    <div className='general-table'>
      <h2
        className={`font-semibold text-gray-800 mb-4 ${commonProperties.H2_SIZE}`}
      >
        Available Markets
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

      <DataTable columns={columns} data={filteredData} {...Properties} />
    </div>
  )
}
