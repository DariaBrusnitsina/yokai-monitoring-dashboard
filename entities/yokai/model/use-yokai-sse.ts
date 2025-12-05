'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Yokai } from '@/shared/model'

export const useYokaiSSE = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const eventSource = new EventSource('/api/yokai/stream')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        if (data.connected) {
          return
        }
        
        const updatedYokai: Yokai = data
        
        queryClient.setQueryData<Yokai[]>(['yokai', 'list'], (old) => {
          if (!old) return old
          return old.map((yokai) =>
            yokai.id === updatedYokai.id ? updatedYokai : yokai
          )
        })
      } catch (error) {
        console.error('Error parsing SSE message:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [queryClient])
}

