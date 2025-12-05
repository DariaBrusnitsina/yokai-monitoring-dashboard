import { NextRequest, NextResponse } from 'next/server'
import { yokaiStore } from '@/shared/lib/yokai-store'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id

  if (Math.random() < 0.3) {
    return NextResponse.json(
      { message: 'Capture failed: Spiritual barrier too strong!' },
      { status: 500 }
    )
  }

  const yokai = yokaiStore.findById(id)

  if (!yokai) {
    return NextResponse.json({ message: 'Yokai not found' }, { status: 404 })
  }

  if (yokai.status === 'Captured') {
    return NextResponse.json(
      { message: 'Yokai already captured' },
      { status: 400 }
    )
  }

  const updatedYokai = yokaiStore.updateStatus(id, 'Captured')
  
  if (!updatedYokai) {
    return NextResponse.json({ message: 'Failed to update yokai' }, { status: 500 })
  }
  
  return NextResponse.json(updatedYokai)
}

