import React from 'react'
import { Spinner } from '@/components/Spinner'
import { useUpdateData } from '@/hooks/useUpdateData'
import { useToast } from '@/context/ToastContext'

interface UpdateActionBarProps {
  jsonValue: string
  jsonError: string | null
  csvImportSuccess: boolean
  setCsvImportSuccess: (success: boolean) => void
}

export const UpdateActionBar: React.FC<UpdateActionBarProps> = ({
  jsonValue,
  jsonError,
  csvImportSuccess,
  setCsvImportSuccess
}) => {
  const { updateDocument, loading, error } = useUpdateData()
  const { showToast } = useToast()

  const handleUpdate = async () => {
    try {
      const newData = JSON.parse(jsonValue)
      const result = await updateDocument(newData)
      
      if (result?.success) {
        showToast('success', 'Data has been successfully updated!')
        setCsvImportSuccess(false)
      } else if (error) {
        showToast('error', `Update failed: ${error}`)
      }
    } catch (err) {
      console.error('Update error:', err)
      showToast('error', `Error updating data: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between border border-gray-200'>
      <div>
        <h2 className='text-xl font-semibold'>
          {csvImportSuccess ? 'Save Changes to Database' : 'Update Data'}
        </h2>
        <p className='text-gray-600 mt-1'>
          {csvImportSuccess 
            ? 'Review the imported data and save your changes' 
            : 'Apply your edits to the database'}
        </p>
      </div>
      
      <div className='flex items-center gap-4'>
        {loading && <Spinner />}
        <button
          onClick={handleUpdate}
          disabled={!!jsonError || loading}
          className={`px-6 py-3 ${
            csvImportSuccess
              ? 'bg-blue-600 animate-pulse'
              : 'bg-blue-500'
          } text-white text-lg font-medium rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {csvImportSuccess ? 'Save Imported Data' : 'Update Data'}
        </button>
      </div>
    </div>
  )
}