export type ShiftType = 'Morning' | 'Afternoon' | 'Night' | 'Day Off'

export interface ShiftPlan {
  date: string // YYYY-MM-DD format
  shift: ShiftType
}

export interface Technician {
  id: string
  name: string
  employeeId: string
  department: string
  position: string
  shift: ShiftType
  phone: string
  shiftPlans: ShiftPlan[]
}

export interface ShiftTime {
  name: ShiftType
  startTime: string
  endTime: string
  color: string
}

export const SHIFT_TIMES: ShiftTime[] = [
  { name: 'Morning', startTime: '06:00', endTime: '14:00', color: 'bg-white text-gray-800 border border-gray-300' },
  { name: 'Afternoon', startTime: '14:00', endTime: '22:00', color: 'bg-red-600 text-white' },
  { name: 'Night', startTime: '22:00', endTime: '06:00', color: 'bg-yellow-400 text-gray-900' },
  { name: 'Day Off', startTime: '-', endTime: '-', color: 'bg-green-500 text-white' },
]

export function getCurrentShift(): ShiftType {
  const now = new Date()
  const hours = now.getHours()
  
  if (hours >= 6 && hours < 14) return 'Morning'
  if (hours >= 14 && hours < 22) return 'Afternoon'
  return 'Night'
}
