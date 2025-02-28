import React from 'react'

interface TableRowProps {
  item: {
    icon: string
    name: string
    city: string
    state: string
    serviceArea?: string
    users: number
  }
}

const TableRow: React.FC<TableRowProps> = ({ item }) => {
  return (
    <tr>
      <td className='p-2 border'>
        <img
          src={item.icon}
          alt={item.name}
          className='w-16 h-8 object-contain'
        />
      </td>
      <td className='p-2 border'>{item.name}</td>
      <td className='p-2 border'>{item.city}</td>
      <td className='p-2 border'>{item.state}</td>
      <td className='p-2 border'>{item.serviceArea || ''}</td>
      <td className='p-2 border text-right'>
        {item.users.toLocaleString()}
      </td>
    </tr>
  )
}

interface TableHeaderProps {}

const TableHeader: React.FC<TableHeaderProps> = () => {
  return (
    <tr className='bg-gray-50'>
      <th className='p-2 border'>Icon</th>
      <th className='p-2 border'>Name</th>
      <th className='p-2 border'>City</th>
      <th className='p-2 border'>State</th>
      <th className='p-2 border'>Service Area</th>
      <th className='p-2 border'>Users</th>
    </tr>
  )
}

interface SectionTableProps {
  section: {
    name: string
    list: any[]
  }
}

const SectionTable: React.FC<SectionTableProps> = ({ section }) => {
  return (
    <div className='mb-8'>
      <h3 className='text-lg font-medium mb-2'>{section.name}</h3>
      <div className='overflow-x-auto'>
        <table className='min-w-full border'>
          <thead>
            <TableHeader />
          </thead>
          <tbody>
            {section.list.map((item, itemIndex) => (
              <TableRow key={itemIndex} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface TableViewSectionProps {
  filteredData: any[]
}

export const TableViewSection: React.FC<TableViewSectionProps> = ({ filteredData }) => {
  return (
    <div className='bg-white rounded-lg shadow-md p-4 border border-gray-200'>
      <h2 className='text-xl font-semibold mb-2 pb-4 border-b'>Table View</h2>
      <div className='overflow-y-auto max-h-[600px]'>
        {filteredData.map((section, sectionIndex) => (
          <SectionTable key={sectionIndex} section={section} />
        ))}
      </div>
    </div>
  )
}