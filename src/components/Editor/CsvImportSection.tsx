import React, { useRef } from 'react'
import Papa from 'papaparse'

interface CsvImportSectionProps {
  data: any
  csvFile: File | null
  csvImportSuccess: boolean
  setCsvFile: (file: File | null) => void
  setJsonValue: (value: string) => void
  setModifiedData: (data: any) => void
  setJsonError: (error: string | null) => void
  setCsvImportSuccess: (success: boolean) => void
}

export const CsvImportSection: React.FC<CsvImportSectionProps> = ({
  data,
  csvFile,
  csvImportSuccess,
  setCsvFile,
  setJsonValue,
  setModifiedData,
  setJsonError,
  setCsvImportSuccess
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0])
      setCsvImportSuccess(false)
    }
  }

  const handleCsvImport = () => {
    if (!csvFile) {
      return
    }

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

  return (
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
  )
}