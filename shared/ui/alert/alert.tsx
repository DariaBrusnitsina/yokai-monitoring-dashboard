'use client'

import { useEffect, useState } from 'react'
import styles from './alert.module.scss'

interface AlertProps {
  message: string
  type?: 'error' | 'success' | 'info'
  duration?: number
  onClose?: () => void
}

export function Alert({ message, type = 'error', duration = 5000, onClose }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onClose?.()
        }, 300) // Wait for fade-out animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`${styles.alert} ${styles[type]} ${styles.visible}`}>
      <div className={styles.content}>
        <span className={styles.icon}>
          {type === 'error' && '⚠️'}
          {type === 'success' && '✅'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className={styles.message}>{message}</span>
        <button
          className={styles.closeButton}
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose?.(), 300)
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}

