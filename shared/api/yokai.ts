import { Yokai, YokaiSchema } from '@/shared/model'

const API_BASE = '/api'

export const yokaiApi = {
  getAll: async (): Promise<Yokai[]> => {
    const response = await fetch(`${API_BASE}/yokai`)
    if (!response.ok) {
      throw new Error('Failed to fetch yokai')
    }
    const data = await response.json()
    return YokaiSchema.array().parse(data)
  },

  capture: async (id: string): Promise<Yokai> => {
    const response = await fetch(`${API_BASE}/yokai/${id}/capture`, {
      method: 'POST',
    })
    if (!response.ok) {
      let errorMessage = 'Failed to capture yokai'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch (e) {
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }
    const data = await response.json()
    return YokaiSchema.parse(data)
  },

  reset: async (): Promise<Yokai[]> => {
    const response = await fetch(`${API_BASE}/yokai/reset`, {
      method: 'GET',
    })
    if (!response.ok) {
      throw new Error('Failed to reset yokai')
    }
    const data = await response.json()
    return YokaiSchema.array().parse(data.data || data)
  },
}

