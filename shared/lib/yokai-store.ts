import { Yokai } from '@/shared/model'

class YokaiStore {
  private data: Yokai[] = [
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
    {
      id: '3',
      name: 'Tengu',
      threatLevel: 'Low',
      location: 'Ueno Park',
      status: 'Active',
    },
    {
      id: '4',
      name: 'Kappa',
      threatLevel: 'Medium',
      location: 'Sumida River',
      status: 'Active',
    },
    {
      id: '5',
      name: 'Yuki-onna',
      threatLevel: 'Critical',
      location: 'Mount Takao',
      status: 'Active',
    },
    {
      id: '6',
      name: 'Nue',
      threatLevel: 'High',
      location: 'Imperial Palace',
      status: 'Active',
    },
  ]

  getAll(): Yokai[] {
    return this.data
  }

  findById(id: string): Yokai | undefined {
    return this.data.find((y) => y.id === id)
  }

  updateStatus(id: string, status: Yokai['status']): Yokai | null {
    const yokai = this.data.find((y) => y.id === id)
    if (yokai) {
      yokai.status = status
      return yokai
    }
    return null
  }

  reset(): Yokai[] {
    this.data.forEach((yokai) => {
      yokai.status = 'Active'
    })
    return this.data
  }
}

export const yokaiStore = new YokaiStore()

