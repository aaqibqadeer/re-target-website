import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa'

export type ToastType = 'success' | 'error'

interface ToastProps {
  type: ToastType
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 4000,
}) => {
  const [isExiting, setIsExiting] = useState(false)
  
  useEffect(() => {
    if (isVisible) {
      // Reset exit animation state when showing
      setIsExiting(false)
      
      // Set timer to close the toast
      const timer = setTimeout(() => {
        // Start exit animation
        setIsExiting(true)
        
        // Close after animation completes
        setTimeout(onClose, 500)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed top-6 right-0 left-0 mx-auto w-[90%] max-w-md z-50 transition-all duration-500 ease-in-out
        ${isExiting ? 'opacity-0 translate-y-[-20px]' : 'opacity-100 translate-y-0'}
      `}
    >
      <div 
        className={`
          flex items-center p-4 rounded-md shadow-lg border-l-4
          ${type === 'success' 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
          }
        `}
      >
        <div 
          className={`flex-shrink-0 mr-3 
            ${type === 'success' ? 'text-green-500' : 'text-red-500'}`
          }
        >
          {type === 'success' 
            ? <FaCheckCircle size={24} /> 
            : <FaExclamationTriangle size={24} />
          }
        </div>
        <div className="flex-grow">
          <p 
            className={`text-base font-medium
              ${type === 'success' ? 'text-green-800' : 'text-red-800'}
            `}
          >
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(onClose, 500)
          }}
          className={`
            ml-3 flex-shrink-0 p-1 rounded-full
            ${type === 'success' ? 'text-green-500 hover:bg-green-100' : 'text-red-500 hover:bg-red-100'}
            focus:outline-none
          `}
          aria-label="Close"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  )
}