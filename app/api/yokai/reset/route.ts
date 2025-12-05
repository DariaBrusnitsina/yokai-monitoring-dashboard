import { NextResponse } from 'next/server'
import { yokaiStore } from '@/shared/lib/yokai-store'

export async function POST() {
  const resetData = yokaiStore.reset()
  return NextResponse.json({ message: 'Data reset successfully', data: resetData })
}

export async function GET() {
  const resetData = yokaiStore.reset()
  return NextResponse.json({ message: 'Data reset successfully', data: resetData })
}

