import { useEffect, useState } from 'react'
import useFetchFirebaseData from '@/hooks/useFetchFirebaseData'
import { useAuth } from '@/hooks/useAuth'
import { AuthGuard } from '@/auth/auth'
import { EditorHeader } from '@/components/Editor/EditorHeader'
import { SearchBar } from '@/components/Editor/SearchBar'
import { CsvImportSection } from '@/components/Editor/CsvImportSection'
import { JsonEditorSection } from '@/components/Editor/JsonEditorSection'
import { TableViewSection } from '@/components/Editor/TableViewSection'

export default function Editor() {
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvImportSuccess, setCsvImportSuccess] = useState(false)

  const { fetchData, data } = useFetchFirebaseData()
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

  const filteredData =
    modifiedData?.map((section) => ({
      ...section,
      list: section.list.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.state.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    })) || []

  return (
    <AuthGuard requireAuth={true}>
      <div className='w-[90%] mx-auto'>
        <div className='p-4 max-w-[1400px] mx-auto'>
          <EditorHeader logout={logout} />

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            data={data}
          />

          <CsvImportSection
            data={data}
            setCsvFile={setCsvFile}
            csvFile={csvFile}
            setJsonValue={setJsonValue}
            setModifiedData={setModifiedData}
            setJsonError={setJsonError}
            csvImportSuccess={csvImportSuccess}
            setCsvImportSuccess={setCsvImportSuccess}
          />

          <div className='grid grid-cols-1 lg:grid-cols-1 gap-4'>
            <JsonEditorSection
              jsonValue={jsonValue}
              handleJsonChange={handleJsonChange}
              jsonError={jsonError}
              csvImportSuccess={csvImportSuccess}
              setCsvImportSuccess={setCsvImportSuccess}
            />

            <TableViewSection filteredData={filteredData} />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
