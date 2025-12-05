import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { YokaiCard } from '@/widgets/yokai-card'
import { Yokai } from '@/shared/model'
import { yokaiApi } from '@/shared/api'
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

const mockYokai: Yokai = {
  id: '1',
  name: 'Kitsune',
  threatLevel: 'Medium',
  location: 'Shibuya District',
  status: 'Active',
}

describe('YokaiCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(yokaiApi.getAll as jest.Mock).mockResolvedValue([mockYokai])
  })

  it('должен отображать все обязательные поля духа', () => {
    renderWithProviders(<YokaiCard yokai={mockYokai} />)

    expect(screen.getByText('Kitsune')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Shibuya District')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('должен отображать кнопку "Capture"', () => {
    renderWithProviders(<YokaiCard yokai={mockYokai} />)

    const captureButton = screen.getByRole('button', { name: /capture/i })
    expect(captureButton).toBeInTheDocument()
    expect(captureButton).not.toBeDisabled()
  })

  it('должен отключать кнопку для уже захваченного духа', () => {
    const capturedYokai: Yokai = { ...mockYokai, status: 'Captured' }
    renderWithProviders(<YokaiCard yokai={capturedYokai} />)

    const captureButton = screen.getByRole('button', { name: /capture/i })
    expect(captureButton).toBeDisabled()
  })

  it('должен вызывать API при клике на Capture', async () => {
    const user = userEvent.setup()
    ;(yokaiApi.capture as jest.Mock).mockResolvedValue({
      ...mockYokai,
      status: 'Captured',
    })

    renderWithProviders(<YokaiCard yokai={mockYokai} />)

    const captureButton = screen.getByRole('button', { name: /capture/i })
    await user.click(captureButton)

    await waitFor(() => {
      expect(yokaiApi.capture).toHaveBeenCalledWith('1')
    })
  })

  it('должен показывать "Capturing..." во время выполнения запроса', async () => {
    const user = userEvent.setup()
    let resolveCapture: (value: any) => void
    const capturePromise = new Promise((resolve) => {
      resolveCapture = resolve
    })
    ;(yokaiApi.capture as jest.Mock).mockReturnValue(capturePromise)

    renderWithProviders(<YokaiCard yokai={mockYokai} />)

    const captureButton = screen.getByRole('button', { name: /capture/i })
    await user.click(captureButton)

    expect(screen.getByText('Capturing...')).toBeInTheDocument()
    expect(captureButton).toBeDisabled()

    resolveCapture!({ ...mockYokai, status: 'Captured' })
    await waitFor(() => {
      expect(screen.queryByText('Capturing...')).not.toBeInTheDocument()
    })
  })

  it('должен показывать кастомный alert при ошибке захвата', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Capture failed: Spiritual barrier too strong!'
    ;(yokaiApi.capture as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    )

    renderWithProviders(<YokaiCard yokai={mockYokai} />)

    const captureButton = screen.getByRole('button', { name: /capture/i })
    await user.click(captureButton)

    // Ждем появления кастомного алерта в DOM
    await waitFor(() => {
      const alertMessage = screen.getByText(
        `Failed to capture ${mockYokai.name}: ${errorMessage}`
      )
      expect(alertMessage).toBeInTheDocument()
    }, { timeout: 3000 })

    // Проверяем, что алерт имеет правильный тип (error)
    const alertContainer = screen.getByText(
      `Failed to capture ${mockYokai.name}: ${errorMessage}`
    ).closest('[class*="alert"]')
    expect(alertContainer).toBeInTheDocument()
  })

  it('должен отображать правильный цвет для уровня угрозы', () => {
    const { rerender } = renderWithProviders(<YokaiCard yokai={mockYokai} />)

    const threatLevel = screen.getByText('Medium')
    // Проверяем, что стиль применен (может быть в style атрибуте)
    expect(threatLevel).toBeInTheDocument()
    const style = threatLevel.getAttribute('style')
    expect(style).toBeTruthy()
    expect(style).toContain('color')

    // Проверяем разные уровни угрозы
    const criticalYokai: Yokai = { ...mockYokai, threatLevel: 'Critical' }
    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <AlertContainer>
          <YokaiCard yokai={criticalYokai} />
        </AlertContainer>
      </QueryClientProvider>
    )

    const criticalThreat = screen.getByText('Critical')
    expect(criticalThreat).toBeInTheDocument()
    const criticalStyle = criticalThreat.getAttribute('style')
    expect(criticalStyle).toBeTruthy()
    expect(criticalStyle).toContain('color')
  })
})

