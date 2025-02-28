import { useEffect, useState, useRef } from 'react'
import { Editor as JSONEditor } from '@monaco-editor/react'
import useFetchFirebaseData from '@/hooks/useFetchFirebaseData'
import { useUpdateData } from '@/hooks/useUpdateData'
import { Spinner } from '@/components/Spinner'
import { useRouter } from 'next/router'
import { AuthGuard } from '@/auth/auth'
import { useAuth } from '@/hooks/useAuth'
import Papa from 'papaparse'

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
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvImportSuccess, setCsvImportSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { fetchData, data } = useFetchFirebaseData()
  const { updateDocument, loading, error } = useUpdateData()
  const { logout } = useAuth()

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
    try {
      setModifiedData(JSON.parse(value))
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
      setCsvImportSuccess(false)
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
    let csv = 'Section,Icon,Name,City,State,ServiceArea,Users,URL\n'
    data.forEach((section) => {
      section.list.forEach((item) => {
        csv += `${section.name},"${item.icon}","${item.name}","${item.city}","${
          item.state
        }","${item.serviceArea || ''}",${item.users},"${item.url}"\n`
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

  // Handle CSV file selection
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0])
      setCsvImportSuccess(false)
    }
  }

  // Parse CSV and convert to JSON
  const handleCsvImport = () => {
    if (!csvFile) {
      return
    }
    debugger
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Group results by section
          const grouped: any = results.data.reduce((acc: any, row: any) => {
            const section = row.Section
            if (!section) return acc

            if (!acc[section]) {
              acc[section] = []
            }

            // Convert users to number
            const users = parseInt(row.Users) || 0

            acc[section].push({
              icon: row.Icon || '',
              name: row.Name || '',
              city: row.City || '',
              state: row.State || '',
              serviceArea: row.ServiceArea || '',
              users: users,
              url: row.URL || '',
            })

            return acc
          }, {})

          // Convert to the format expected by our app
          const formattedData = Object.keys(grouped).map((section) => ({
            name: section,
            list: grouped[section],
          }))

          // Update editor with new data
          debugger
          const newJsonValue = JSON.stringify(formattedData, null, 2)
          setJsonValue(newJsonValue)
          setModifiedData(formattedData)
          setJsonError(null)
          setCsvImportSuccess(true)

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          setCsvFile(null)
        } catch (err) {
          setJsonError('Error converting CSV to JSON')
          console.error('CSV import error:', err)
        }
      },
      error: (error) => {
        setJsonError(`CSV parsing error: ${error.message}`)
        console.error('CSV parsing error:', error)
      },
    })
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

  return (
    <AuthGuard requireAuth={true}>
      <div className='w-[90%] mx-auto'>
        <div className='p-4 max-w-[1400px] mx-auto'>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-2xl font-bold mb-4'>Data Editor</h1>

            <button
              onClick={logout}
              className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
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

          {/* CSV Import Section */}
          <div className='mb-6 p-4 bg-white rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-3'>Import Data from CSV</h2>
            <div className='flex flex-wrap items-center gap-3'>
              <input
                type='file'
                accept='.csv'
                ref={fileInputRef}
                onChange={handleCsvFileChange}
                className='flex-1 p-2 border rounded'
              />
              <button
                onClick={handleCsvImport}
                disabled={!csvFile}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                Import CSV
              </button>
            </div>
            {csvImportSuccess && (
              <div className='mt-3 p-2 bg-green-100 text-green-800 rounded'>
                CSV data successfully imported to the editor. Review the data
                and click "Update Data" to save changes.
              </div>
            )}
            <div className='mt-3 text-sm text-gray-600'>
              <p>
                CSV format should have these columns: Section, Icon, Name, City,
                State, ServiceArea, Users, URL
              </p>
              <p>You can export current data to see the required format.</p>
            </div>
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
                  className={`px-4 py-2 ${
                    csvImportSuccess
                      ? 'bg-blue-600 animate-pulse'
                      : 'bg-blue-500'
                  } text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {csvImportSuccess ? 'Save Imported Data' : 'Update Data'}
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
                            <th className='p-2 border'>Service Area</th>
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
                              <td className='p-2 border'>
                                {item.serviceArea || ''}
                              </td>
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
