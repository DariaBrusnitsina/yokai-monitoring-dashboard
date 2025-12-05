import { z } from 'zod'

export const ThreatLevelSchema = z.enum(['Low', 'Medium', 'High', 'Critical'])

export const YokaiStatusSchema = z.enum(['Active', 'Captured'])

export const YokaiSchema = z.object({
  id: z.string(),
  name: z.string(),
  threatLevel: ThreatLevelSchema,
  location: z.string(),
  status: YokaiStatusSchema,
})

export type ThreatLevel = z.infer<typeof ThreatLevelSchema>
export type YokaiStatus = z.infer<typeof YokaiStatusSchema>
export type Yokai = z.infer<typeof YokaiSchema>

