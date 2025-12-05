import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { YokaiList } from '@/widgets/yokai-list'
import { yokaiApi } from '@/shared/api'
import { Yokai } from '@/shared/model'
import { AlertContainer } from '@/shared/ui/alert-container'

jest.mock('@/shared/api', () => ({
  yokaiApi: {
    getAll: jest.fn(),
    capture: jest.fn(),
  },
}))

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <AlertContainer>{ui}</AlertContainer>
    </QueryClientProvider>
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

describe('YokaiList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('должен отображать состояние загрузки', () => {
    ;(yokaiApi.getAll as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Никогда не резолвится
    )

    renderWithProviders(<YokaiList />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('должен отображать список духов после загрузки', async () => {
    ;(yokaiApi.getAll as jest.Mock).mockResolvedValue(mockYokaiList)

    renderWithProviders(<YokaiList />)

    expect(await screen.findByText('Kitsune')).toBeInTheDocument()
    expect(screen.getByText('Oni')).toBeInTheDocument()
    expect(screen.getByText('Shibuya District')).toBeInTheDocument()
    expect(screen.getByText('Shinjuku District')).toBeInTheDocument()
  })

  it('должен отображать сообщение об ошибке при неудачной загрузке', async () => {
    const error = new Error('Failed to fetch yokai')
    ;(yokaiApi.getAll as jest.Mock).mockRejectedValue(error)

    renderWithProviders(<YokaiList />)

    const errorElement = await screen.findByText(/error loading yokai/i)
    expect(errorElement).toBeInTheDocument()
    // Проверяем, что текст ошибки присутствует в элементе или его дочерних элементах
    expect(errorElement.textContent).toContain('Failed to fetch yokai')
  })

  it('должен отображать сообщение при пустом списке', async () => {
    ;(yokaiApi.getAll as jest.Mock).mockResolvedValue([])

    renderWithProviders(<YokaiList />)

    expect(await screen.findByText(/no yokai detected/i)).toBeInTheDocument()
  })

  it('должен отображать карточки для всех духов', async () => {
    ;(yokaiApi.getAll as jest.Mock).mockResolvedValue(mockYokaiList)

    renderWithProviders(<YokaiList />)

    await screen.findByText('Kitsune')

    // Проверяем, что все карточки отображаются
    const captureButtons = screen.getAllByRole('button', { name: /capture/i })
    expect(captureButtons.length).toBe(2)
  })
})

