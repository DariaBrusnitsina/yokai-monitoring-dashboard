'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AlertContainer } from '@/shared/ui/alert-container'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
            refetchInterval: false,
            notifyOnChangeProps: ['data', 'error', 'status'],
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AlertContainer>{children}</AlertContainer>
    </QueryClientProvider>
  )
}

