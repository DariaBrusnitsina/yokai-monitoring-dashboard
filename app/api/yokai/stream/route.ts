import { NextRequest } from 'next/server'
import { yokaiStore } from '@/shared/lib/yokai-store'
import { ThreatLevel } from '@/shared/model'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const threatLevels: ThreatLevel[] = ['Low', 'Medium', 'High', 'Critical']

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = () => {
        try {
          const yokaiData = yokaiStore.getAll()
          if (yokaiData.length === 0) return

          const randomIndex = Math.floor(Math.random() * yokaiData.length)
          const yokai = yokaiData[randomIndex]

          if (yokai.status === 'Active') {
            const currentIndex = threatLevels.indexOf(yokai.threatLevel)
            let newIndex = currentIndex
            while (newIndex === currentIndex) {
              newIndex = Math.floor(Math.random() * threatLevels.length)
            }
            yokai.threatLevel = threatLevels[newIndex]

            const data = JSON.stringify(yokai)
            controller.enqueue(
              encoder.encode(`data: ${data}\n\n`)
            )
          }
        } catch (error) {
          console.error('Error in SSE stream:', error)
        }
      }

      const interval = setInterval(sendUpdate, 5000)

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ connected: true })}\n\n`))
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

