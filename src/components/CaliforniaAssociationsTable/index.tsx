import React from 'react'
import { MarketCategory } from '@/lib/data'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import DataTable from 'react-data-table-component'
import { FaLink } from 'react-icons/fa'

export const CaliforniaAssociationsTable = ({
  data,
}: {
  data: MarketCategory
}) => {
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

  const columns = [
    {
      name: '',
      cell: (row: any) => (
        <Image src={row.icon} alt='icon' width={50} height={60} />
      ),
      selector: (row: any) => row.icon,
      width: '80px',
    },
    {
      name: 'Name',
      selector: (row: any) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'City',
      selector: (row: any) => row.city,
      sortable: true,
    },
    {
      name: 'State',
      selector: (row: any) => row.state,
      sortable: true,
    },
    {
      name: 'Service Area',
      selector: (row: any) => row.serviceArea || 'TBD',
      sortable: true,
    },
    {
      name: 'Agents',
      selector: (row: any) => row.users,
      sortable: true,
      format: (row: any) => `${row.users.toLocaleString()}+`,
    },
    {
      name: 'Rate Card',
      cell: (row: any) => (
        <a
          href={row.url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-600 hover:text-blue-800 p-4'
        >
          <FaLink />
        </a>
      ),
      width: '100px',
    },
  ]
  return (
    <div className='general-table'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-4 '>
        California Associations
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

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        fixedHeader
        highlightOnHover
        responsive
        striped
        customStyles={{
          headRow: {
            style: {
              backgroundColor: '#f3f4f6',
              fontWeight: 'bold',
            },
          },
        }}
      />
    </div>
  )
}
