import { useEffect, useState } from 'react'
import { Editor as JSONEditor } from '@monaco-editor/react'
import useFetchFirebaseData from '@/hooks/useFetchFirebaseData'
import { useUpdateData } from '@/hooks/useUpdateData'
import { Spinner } from '@/components/Spinner'
import { useRouter } from 'next/router'
import { AuthGuard } from '@/auth/auth'

interface Item {
  icon: string
  name: string
  city: string
  state: string
  serviceArea?: string
  users: number
  url: string
}

export default function Editor() {
  const router = useRouter()

  const [jsonError, setJsonError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVersion, setSelectedVersion] = useState('')

  const { fetchData, data } = useFetchFirebaseData()
  const { updateDocument, loading, error } = useUpdateData()

  const [modifiedData, setModifiedData] = useState(data)
  const [jsonValue, setJsonValue] = useState(JSON.stringify(data, null, 2))

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setJsonValue(JSON.stringify(data, null, 2))
    setModifiedData(data)
  }, [data])

  const handleJsonChange = (value: string | undefined) => {
    if (!value) return
    setJsonValue(value)
    setModifiedData(JSON.parse(value))
    try {
      JSON.parse(value)
      setJsonError(null)
    } catch (err) {
      setJsonError('Invalid JSON format')
    }
  }

  const handleUpdate = () => {
    try {
      const newData = JSON.parse(jsonValue)
      setJsonError(null)
      updateDocument(newData)
    } catch (err) {
      setJsonError('Invalid JSON format')
    }
  }

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    let csv = 'Section,Icon,Name,City,State,Users,URL\n'
    data.forEach((section) => {
      section.list.forEach((item) => {
        csv += `${section.name},"${item.icon}","${item.name}","${item.city}","${item.state}",${item.users},"${item.url}"\n`
      })
    })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredData = modifiedData.map((section) => ({
    ...section,
    list: section.list.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.state.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }))

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    router.push('/admin')
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className='w-[90%] mx-auto'>
        <div className='p-4 max-w-[1400px] mx-auto'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold mb-4'>Data Editor</h1>

            <button
              onClick={handleLogout}
              className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600'
            >
              Logout
            </button>
          </div>

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
              onClick={handleExportJSON}
              className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600'
            >
              Export JSON
            </button>

            <button
              onClick={handleExportCSV}
              className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600'
            >
              Export CSV
            </button>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-1 gap-4'>
            <div className='bg-white rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-2 p-4 border-b'>
                JSON Editor
              </h2>
              <div className='h-[600px] border rounded-b-lg overflow-hidden'>
                <JSONEditor
                  height='100%'
                  defaultLanguage='json'
                  value={jsonValue}
                  onChange={handleJsonChange}
                  theme='vs-light'
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    folding: true,
                    automaticLayout: true,
                  }}
                />
              </div>
              {jsonError && (
                <p className='text-red-500 text-sm mt-2 px-4'>{jsonError}</p>
              )}
              <div className='p-4 border-t flex justify-between items-center'>
                <button
                  onClick={handleUpdate}
                  disabled={!!jsonError || loading}
                  className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                  Update Data
                </button>
                {loading && <Spinner />}
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-md p-4'>
              <h2 className='text-xl font-semibold mb-2 pb-4 border-b'>
                Table View
              </h2>
              <div className='overflow-y-auto max-h-[600px]'>
                {filteredData.map((section, sectionIndex) => (
                  <div key={sectionIndex} className='mb-8'>
                    <h3 className='text-lg font-medium mb-2'>{section.name}</h3>
                    <div className='overflow-x-auto'>
                      <table className='min-w-full border'>
                        <thead>
                          <tr className='bg-gray-50'>
                            <th className='p-2 border'>Icon</th>
                            <th className='p-2 border'>Name</th>
                            <th className='p-2 border'>City</th>
                            <th className='p-2 border'>State</th>
                            <th className='p-2 border'>Users</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.list.map((item: Item, itemIndex) => (
                            <tr key={itemIndex}>
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
                              <td className='p-2 border text-right'>
                                {item.users.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
