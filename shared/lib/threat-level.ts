import { ThreatLevel } from '@/shared/model'

export const getThreatLevelColor = (level: ThreatLevel): string => {
  switch (level) {
    case 'Low':
      return '#4ade80' // green
    case 'Medium':
      return '#fbbf24' // yellow
    case 'High':
      return '#fb923c' // orange
    case 'Critical':
      return '#ef4444' // red
    default:
      return '#6b7280' // gray
  }
}

export const getThreatLevelBgColor = (level: ThreatLevel): string => {
  switch (level) {
    case 'Low':
      return 'rgba(74, 222, 128, 0.1)'
    case 'Medium':
      return 'rgba(251, 191, 36, 0.1)'
    case 'High':
      return 'rgba(251, 146, 60, 0.1)'
    case 'Critical':
      return 'rgba(239, 68, 68, 0.1)'
    default:
      return 'rgba(107, 114, 128, 0.1)'
  }
}

