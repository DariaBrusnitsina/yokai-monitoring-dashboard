import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useYokaiSSE } from '@/entities/yokai'
import { Yokai } from '@/shared/model'
import React from 'react'

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const mockYokaiList: Yokai[] = [
  {
    id: '1',
    name: 'Kitsune',
    threatLevel: 'Medium',
    location: 'Shibuya District',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Oni',
    threatLevel: 'High',
    location: 'Shinjuku District',
    status: 'Active',
  },
]

describe('useYokaiSSE Hook', () => {
  let mockEventSource: any
  let eventSourceInstances: any[] = []

  beforeEach(() => {
    jest.clearAllMocks()
    eventSourceInstances = []

    // Мокаем EventSource
    mockEventSource = class MockEventSource {
      url: string
      onmessage: ((event: MessageEvent) => void) | null = null
      onerror: ((event: Event) => void) | null = null
      readyState: number = 1

      constructor(url: string) {
        this.url = url
        eventSourceInstances.push(this)
      }

      close() {
        this.readyState = 2
      }

      simulateMessage(data: any) {
        if (this.onmessage) {
          this.onmessage({
            data: JSON.stringify(data),
          } as MessageEvent)
        }
      }

      simulateError() {
        if (this.onerror) {
          this.onerror(new Event('error'))
        }
      }
    }

    // Заменяем глобальный EventSource
    ;(global as any).EventSource = mockEventSource
  })

  afterEach(() => {
    eventSourceInstances.forEach((instance) => instance.close())
  })

  it('должен подключаться к правильному SSE endpoint', () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(['yokai', 'list'], mockYokaiList)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    renderHook(() => useYokaiSSE(), { wrapper })

    expect(eventSourceInstances.length).toBe(1)
    expect(eventSourceInstances[0].url).toBe('/api/yokai/stream')
  })

  it('должен обновлять кэш при получении обновления духа', async () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(['yokai', 'list'], mockYokaiList)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    renderHook(() => useYokaiSSE(), { wrapper })

    const updatedYokai: Yokai = {
      ...mockYokaiList[0],
      threatLevel: 'Critical',
    }

    // Симулируем получение обновления
    eventSourceInstances[0].simulateMessage(updatedYokai)

    await waitFor(() => {
      const cachedData = queryClient.getQueryData<Yokai[]>(['yokai', 'list'])
      expect(cachedData?.[0].threatLevel).toBe('Critical')
    })
  })

  it('должен игнорировать сообщения о подключении', async () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(['yokai', 'list'], mockYokaiList)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    renderHook(() => useYokaiSSE(), { wrapper })

    const initialData = queryClient.getQueryData<Yokai[]>(['yokai', 'list'])

    // Симулируем сообщение о подключении
    eventSourceInstances[0].simulateMessage({ connected: true })

    // Данные не должны измениться
    await waitFor(() => {
      const cachedData = queryClient.getQueryData<Yokai[]>(['yokai', 'list'])
      expect(cachedData).toEqual(initialData)
    })
  })

  it('должен закрывать соединение при размонтировании', () => {
    const queryClient = createTestQueryClient()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { unmount } = renderHook(() => useYokaiSSE(), { wrapper })

    expect(eventSourceInstances.length).toBe(1)
    expect(eventSourceInstances[0].readyState).toBe(1) // OPEN

    unmount()

    expect(eventSourceInstances[0].readyState).toBe(2) // CLOSED
  })

  it('должен обрабатывать ошибки подключения', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const queryClient = createTestQueryClient()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    renderHook(() => useYokaiSSE(), { wrapper })

    // Симулируем ошибку
    eventSourceInstances[0].simulateError()

    expect(eventSourceInstances[0].readyState).toBe(2) // CLOSED после ошибки

    consoleErrorSpy.mockRestore()
  })

  it('должен обновлять только конкретного духа, не затрагивая других', async () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(['yokai', 'list'], mockYokaiList)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    renderHook(() => useYokaiSSE(), { wrapper })

    const updatedYokai: Yokai = {
      ...mockYokaiList[0],
      threatLevel: 'Low',
    }

    eventSourceInstances[0].simulateMessage(updatedYokai)

    await waitFor(() => {
      const cachedData = queryClient.getQueryData<Yokai[]>(['yokai', 'list'])
      expect(cachedData?.[0].threatLevel).toBe('Low')
      expect(cachedData?.[1].threatLevel).toBe('High') // Второй дух не изменился
    })
  })
})

