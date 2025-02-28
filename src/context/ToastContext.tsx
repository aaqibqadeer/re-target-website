import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Toast, ToastType } from '@/components/UI/Toast'

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<{
    visible: boolean
    type: ToastType
    message: string
  }>({
    visible: false,
    type: 'success',
    message: '',
  })

  const showToast = (type: ToastType, message: string) => {
    setToast({
      visible: true,
      type,
      message,
    })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.visible}
        onClose={hideToast}
        duration={5000} // Toast will persist for 5 seconds
      />
    </ToastContext.Provider>
  )
}