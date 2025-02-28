import React, { useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa'

export type NotificationType = 'success' | 'error'

interface NotificationProps {
  type: NotificationType
  message: string
  isVisible: boolean
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, autoClose, duration])

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-6 right-6 z-50 w-80 p-4 rounded-md shadow-lg flex items-start ${
        type === 'success' ? 'bg-green-50' : 'bg-red-50'
      }`}
    >
      <div
        className={`flex-shrink-0 mr-3 ${
          type === 'success' ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {type === 'success' ? (
          <FaCheckCircle size={20} />
        ) : (
          <FaExclamationCircle size={20} />
        )}
      </div>
      <div className="flex-grow">
        <p
          className={`text-sm font-medium ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}
        >
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className={`ml-3 flex-shrink-0 ${
          type === 'success' ? 'text-green-500' : 'text-red-500'
        } hover:opacity-75 focus:outline-none`}
      >
        <FaTimes size={16} />
      </button>
    </div>
  )
}