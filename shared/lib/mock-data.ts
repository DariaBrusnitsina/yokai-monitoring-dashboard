import { Yokai } from '@/shared/model'

declare global {
  var yokaiDataStore: Yokai[] | undefined
}

function getYokaiDataStore(): Yokai[] {
  if (!global.yokaiDataStore) {
    global.yokaiDataStore = [
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
  }
  return global.yokaiDataStore
}

export function getYokaiData(): Yokai[] {
  return getYokaiDataStore()
}

export const yokaiData = getYokaiDataStore()

