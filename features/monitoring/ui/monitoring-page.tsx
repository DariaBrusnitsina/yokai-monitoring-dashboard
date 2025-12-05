'use client'

import { YokaiList } from '@/widgets/yokai-list'
import { useYokaiSSE, useResetYokai } from '@/entities/yokai'
import { useAlert } from '@/shared/ui/alert-container'
import styles from './monitoring-page.module.scss'

export function MonitoringPage() {
  useYokaiSSE()
  const resetMutation = useResetYokai()
  const { showAlert } = useAlert()

  const handleReset = () => {
    resetMutation.mutate(undefined, {
      onSuccess: () => {
        showAlert('All yokai have been reset to Active status', 'success')
      },
      onError: (error) => {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to reset yokai'
        showAlert(`Failed to reset: ${errorMessage}`, 'error')
      },
    })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Yokai Monitoring Dashboard</h1>
            <p className={styles.subtitle}>
              Real-time spiritual anomaly detection in Tokyo
            </p>
          </div>
          <button
            className={styles.resetButton}
            onClick={handleReset}
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? 'Resetting...' : 'Reset All'}
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <YokaiList />
      </main>
    </div>
  )
}

