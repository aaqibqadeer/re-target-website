import React from 'react'
import { Editor as JSONEditor } from '@monaco-editor/react'
import { useUpdateData } from '@/hooks/useUpdateData'
import { Spinner } from '@/components/Spinner'

interface JsonEditorSectionProps {
  jsonValue: string
  handleJsonChange: (value: string | undefined) => void
  jsonError: string | null
  csvImportSuccess: boolean
  setCsvImportSuccess: (success: boolean) => void
}

export const JsonEditorSection: React.FC<JsonEditorSectionProps> = ({
  jsonValue,
  handleJsonChange,
  jsonError,
  csvImportSuccess,
  setCsvImportSuccess
}) => {
  const { updateDocument, loading, error } = useUpdateData()

  const handleUpdate = () => {
    try {
      const newData = JSON.parse(jsonValue)
      updateDocument(newData)
      setCsvImportSuccess(false)
    } catch (err) {
      console.error('Update error:', err)
    }
  }

  return (
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
  )
}