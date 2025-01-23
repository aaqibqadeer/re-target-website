import React, { useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface DownloadPDFButtonProps {
  targetRef?: React.RefObject<HTMLElement> // Optional ref to specific element
  fileName?: string
  label?: string
  className?: string
}

export const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  targetRef,
  fileName = 'page.pdf',
  label = 'Download PDF',
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  //   const generatePDF = async () => {
  //     try {
  //       setIsLoading(true)
  //       setError(null)

  //       const element = targetRef?.current || document.body
  //       const canvas = await html2canvas(element, {
  //         scale: 2,
  //         useCORS: true,
  //         logging: false,
  //       })

  //       const imageData = canvas.toDataURL('image/png')
  //       const pdf = new jsPDF({
  //         orientation: 'portrait',
  //         unit: 'px',
  //         format: [canvas.width, canvas.height],
  //       })

  //       pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height)
  //       pdf.save(fileName)
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : 'Failed to generate PDF')
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  const generatePDF = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const element = targetRef?.current || document.body
      const elementWidth = element.offsetWidth
      const elementHeight = element.offsetHeight

      // Calculate dimensions for A4 page
      const a4Width = 595.28 // Points
      const a4Height = 841.89 // Points
      const margin = 40 // Points
      const scale = (a4Width - margin * 2) / elementWidth

      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowWidth: elementWidth,
        windowHeight: elementHeight,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
      })

      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      })

      // Calculate pages needed
      const imgWidth = a4Width - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = margin

      // First page
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight)
      heightLeft -= a4Height - margin * 2

      // Add subsequent pages if needed
      while (heightLeft > 0) {
        position = margin
        pdf.addPage()
        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          position - (imgHeight - heightLeft),
          imgWidth,
          imgHeight,
        )
        heightLeft -= a4Height - margin * 2
      }

      pdf.save(fileName)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex justify-end'>
      <div className='inline-block'>
        <button
          onClick={generatePDF}
          disabled={isLoading}
          className={`
              flex items-center gap-2 px-4 py-2
              bg-blue-600 hover:bg-blue-700 
              text-white rounded-lg
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
        >
          <FiDownload
            className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
          />
          <span>{isLoading ? 'Generating PDF...' : label}</span>
        </button>

        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
      </div>
    </div>
  )
}
