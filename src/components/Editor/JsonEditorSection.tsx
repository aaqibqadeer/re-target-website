import React from 'react'
import { Editor as JSONEditor } from '@monaco-editor/react'

interface JsonEditorSectionProps {
  jsonValue: string
  handleJsonChange: (value: string | undefined) => void
  jsonError: string | null
}

export const JsonEditorSection: React.FC<JsonEditorSectionProps> = ({
  jsonValue,
  handleJsonChange,
  jsonError,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-md border border-gray-200'>
      <h2 className='text-xl font-semibold mb-2 p-4 border-b'>JSON Editor</h2>
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
    </div>
  )
}