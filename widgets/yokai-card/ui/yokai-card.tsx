'use client'

import { Yokai } from '@/shared/model'
import { getThreatLevelColor, getThreatLevelBgColor } from '@/shared/lib'
import { useCaptureYokai, useYokaiList } from '@/entities/yokai'
import { useAlert } from '@/shared/ui/alert-container'
import { useEffect, useState } from 'react'
import styles from './yokai-card.module.scss'

interface YokaiCardProps {
  yokai: Yokai
}

export function YokaiCard({ yokai: initialYokai }: YokaiCardProps) {
  const captureMutation = useCaptureYokai()
  const { showAlert } = useAlert()
  const { data: yokaiList } = useYokaiList()
  const [forceUpdate, setForceUpdate] = useState(0)
  
  const yokai = yokaiList?.find((y) => y.id === initialYokai.id) || initialYokai

  const [lastStatus, setLastStatus] = useState(yokai.status)
  
  useEffect(() => {
    if (yokai.status !== lastStatus) {
      setLastStatus(yokai.status)
      setForceUpdate((prev) => prev + 1)
    }
  }, [yokai.status, lastStatus])

  const handleCapture = async () => {
    try {
      await captureMutation.mutateAsync(yokai.id)
      setForceUpdate((prev) => prev + 1)
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to capture yokai'
      showAlert(`Failed to capture ${yokai.name}: ${errorMessage}`, 'error')
    }
  }

  const threatColor = getThreatLevelColor(yokai.threatLevel)
  const threatBgColor = getThreatLevelBgColor(yokai.threatLevel)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{yokai.name}</h3>
        <span
          className={styles.threatLevel}
          style={{
            color: threatColor,
            backgroundColor: threatBgColor,
          }}
        >
          {yokai.threatLevel}
        </span>
      </div>
      <div className={styles.body}>
        <div className={styles.info}>
          <span className={styles.label}>Location:</span>
          <span className={styles.value}>{yokai.location}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.label}>Status:</span>
          <span
            className={styles.status}
            data-status={yokai.status.toLowerCase()}
          >
            {yokai.status}
          </span>
        </div>
      </div>
      <button
        className={styles.captureButton}
        onClick={handleCapture}
        disabled={yokai.status === 'Captured' || captureMutation.isPending}
      >
        {captureMutation.isPending ? 'Capturing...' : 'Capture'}
      </button>
    </div>
  )
}

