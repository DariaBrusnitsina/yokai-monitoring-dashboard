import { NextResponse } from 'next/server'
import { yokaiStore } from '@/shared/lib/yokai-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function GET() {
  const data = yokaiStore.getAll()
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export async function POST() {
  const resetData = yokaiStore.reset()
  return NextResponse.json({ message: 'Data reset successfully', data: resetData })
}

