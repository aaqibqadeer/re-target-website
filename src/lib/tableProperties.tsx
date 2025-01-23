import Image from 'next/image'
import { FaLink } from 'react-icons/fa'

export const Properties = {
  pagination: false,
  fixedHeader: false,
  highlightOnHover: true,
  responsive: true,
  striped: true,
  customStyles: {
    headRow: {
      style: {
        backgroundColor: '#f3f4f6',
        fontWeight: 'bold',
        fontSize: '1rem',
      },
    },
    rows: {
      style: {
        fontSize: '1.3rem',
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
      },
    },
    cells: {
      style: {},
    },
  },
}

export const tableColumns = [
  {
    id: 'icon',
    name: '',
    cell: (row: any) => (
      <Image src={row.icon} alt='icon' width={100} height={60} />
    ),
    selector: (row: any) => row.icon,
    minWidth: '130px',
  },
  {
    name: 'Name',
    selector: (row: any) => row.name,
    sortable: true,
    wrap: true,
    grow: 4,
  },
  {
    name: 'City',
    selector: (row: any) => row.city,
    sortable: true,
    wrap: true,
    omit: true,
  },
  {
    name: 'State',
    selector: (row: any) => row.state,
    sortable: true,
    wrap: true,
    format: (row: any) => `${row.state.slice(0, 2).toUpperCase()}`,
  },
  {
    name: 'Service Area',
    selector: (row: any) => row.serviceArea || 'TBD',
    sortable: true,
    wrap: true,
    grow: 5,
  },
  {
    name: 'Agents (~)',
    selector: (row: any) => row.users,
    sortable: true,
    format: (row: any) => `${row.users.toLocaleString()}`,
    wrap: true,
    right: true,
    grow: 1.3,
  },
  {
    id: 'rateCard',
    name: 'Rate Card',
    right: true,
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
    wrap: true,
  },
]
