'use client'

import { useYokaiList } from '@/entities/yokai'
import { YokaiCard } from '@/widgets/yokai-card'
import { useEffect } from 'react'
import styles from './yokai-list.module.scss'

export function YokaiList() {
  const { data: yokaiList, isLoading, error } = useYokaiList()

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading yokai data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading yokai: {error.message}
        </div>
      </div>
    )
  }

  if (!yokaiList || yokaiList.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>No yokai detected</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {yokaiList.map((yokai) => (
          <YokaiCard 
            key={`${yokai.id}-${yokai.status}`} 
            yokai={yokai} 
          />
        ))}
      </div>
    </div>
  )
}

