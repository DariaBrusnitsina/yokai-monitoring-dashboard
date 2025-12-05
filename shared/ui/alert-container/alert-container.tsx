'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Alert } from '../alert'

interface AlertItem {
  id: string
  message: string
  type: 'error' | 'success' | 'info'
}

interface AlertContextType {
  showAlert: (message: string, type?: 'error' | 'success' | 'info') => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within AlertContainer')
  }
  return context
}

export function AlertContainer({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  const showAlert = useCallback((message: string, type: 'error' | 'success' | 'info' = 'error') => {
    const id = Math.random().toString(36).substring(7)
    setAlerts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div style={{ 
        position: 'fixed', 
        top: 20, 
        right: 20, 
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}>
        {alerts.map((alert) => (
          <div key={alert.id} style={{ pointerEvents: 'auto' }}>
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => removeAlert(alert.id)}
            />
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  )
}

