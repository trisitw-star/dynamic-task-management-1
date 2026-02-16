export type ShiftType = 'เช้า' | 'บ่าย' | 'ดึก' | 'หยุด'

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
  { name: 'เช้า', startTime: '06:00', endTime: '14:00', color: 'bg-white text-gray-800 border border-gray-300' },
  { name: 'บ่าย', startTime: '14:00', endTime: '22:00', color: 'bg-red-600 text-white' },
  { name: 'ดึก', startTime: '22:00', endTime: '06:00', color: 'bg-yellow-400 text-gray-900' },
  { name: 'หยุด', startTime: '-', endTime: '-', color: 'bg-green-500 text-white' },
]

export function getCurrentShift(): ShiftType {
  const now = new Date()
  const hours = now.getHours()
  
  if (hours >= 6 && hours < 14) return 'เช้า'
  if (hours >= 14 && hours < 22) return 'บ่าย'
  return 'ดึก'
}
