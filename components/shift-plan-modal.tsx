"use client"

import { X, User, ChevronLeft, ChevronRight, Plus, Trash2, CalendarDays } from "lucide-react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Technician, ShiftType, ShiftPlan } from "@/lib/types"
import { SHIFT_TIMES } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ShiftPlanModalProps {
  technician: Technician
  onClose: () => void
  onSave: (id: string, plans: ShiftPlan[]) => void
}

const THAI_DAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

export function ShiftPlanModal({ technician, onClose, onSave }: ShiftPlanModalProps) {
  const [plans, setPlans] = useState<ShiftPlan[]>([...technician.shiftPlans])
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [selectedShift, setSelectedShift] = useState<ShiftType>('เช้า')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isSaving, setIsSaving] = useState(false)

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    // Add all days in the month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d))
    }

    return days
  }, [currentMonth])

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const isDateSelected = (date: Date): boolean => {
    return selectedDates.includes(formatDate(date))
  }

  const getDatePlan = (date: Date): ShiftPlan | undefined => {
    return plans.find(p => p.date === formatDate(date))
  }

  const toggleDateSelection = (date: Date) => {
    const dateStr = formatDate(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date < today) return // Can't select past dates
    
    setSelectedDates(prev => 
      prev.includes(dateStr)
        ? prev.filter(d => d !== dateStr)
        : [...prev, dateStr]
    )
  }

  const addPlansForSelectedDates = () => {
    if (selectedDates.length === 0) return
    
    const newPlans = [...plans]
    for (const date of selectedDates) {
      const existingIndex = newPlans.findIndex(p => p.date === date)
      if (existingIndex >= 0) {
        newPlans[existingIndex] = { date, shift: selectedShift }
      } else {
        newPlans.push({ date, shift: selectedShift })
      }
    }
    
    setPlans(newPlans.sort((a, b) => a.date.localeCompare(b.date)))
    setSelectedDates([])
  }

  const removePlan = (date: string) => {
    setPlans(prev => prev.filter(p => p.date !== date))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    onSave(technician.id, plans)
    setIsSaving(false)
    onClose()
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const hasChanges = JSON.stringify(plans) !== JSON.stringify(technician.shiftPlans)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-border max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-primary p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-primary-foreground" />
            <h2 className="text-lg font-bold text-primary-foreground">วางแผนกะล่วงหน้า</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
          >
            <X className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>
        
        {/* Technician Info */}
        <div className="p-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border-2 border-primary">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">{technician.name}</h3>
              <p className="text-xs text-muted-foreground">{technician.employeeId} | {technician.department}</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Calendar */}
            <div className="border border-border rounded-lg p-3">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-3">
                <button 
                  onClick={prevMonth}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="font-medium text-sm">
                  {THAI_MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear() + 543}
                </span>
                <button 
                  onClick={nextMonth}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {THAI_DAYS.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, i) => {
                  if (!date) {
                    return <div key={`empty-${i}`} className="aspect-square" />
                  }
                  
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  const isPast = date < today
                  const isToday = formatDate(date) === formatDate(today)
                  const plan = getDatePlan(date)
                  const isSelected = isDateSelected(date)
                  
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => toggleDateSelection(date)}
                      disabled={isPast}
                      className={cn(
                        "aspect-square rounded text-xs flex flex-col items-center justify-center transition-all relative",
                        isPast && "text-muted-foreground/50 cursor-not-allowed",
                        !isPast && !isSelected && !plan && "hover:bg-muted",
                        isSelected && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1",
                        isToday && !isSelected && "ring-1 ring-primary",
                        plan && !isSelected && SHIFT_TIMES.find(s => s.name === plan.shift)?.color
                      )}
                    >
                      <span>{date.getDate()}</span>
                      {plan && !isSelected && (
                        <span className="text-[8px] leading-none mt-0.5">{plan.shift}</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Shift Selection for Selected Dates */}
              {selectedDates.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    เลือกแล้ว {selectedDates.length} วัน - กำหนดกะ:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SHIFT_TIMES.filter(s => s.name !== 'หยุด').map(shift => (
                      <button
                        key={shift.name}
                        onClick={() => setSelectedShift(shift.name)}
                        className={cn(
                          "px-2 py-1 rounded text-xs transition-all border",
                          selectedShift === shift.name
                            ? "border-primary " + shift.color
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {shift.name}
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedShift('หยุด')}
                      className={cn(
                        "px-2 py-1 rounded text-xs transition-all border",
                        selectedShift === 'หยุด'
                          ? "border-primary bg-muted text-muted-foreground"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      หยุด
                    </button>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-2 bg-primary hover:bg-primary/90"
                    onClick={addPlansForSelectedDates}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    เพิ่มแผนกะ
                  </Button>
                </div>
              )}
            </div>

            {/* Planned Shifts List */}
            <div className="border border-border rounded-lg p-3">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                แผนกะที่กำหนดไว้
              </h4>
              
              {plans.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>ยังไม่มีแผนกะล่วงหน้า</p>
                  <p className="text-xs mt-1">เลือกวันที่ในปฏิทินเพื่อกำหนดกะ</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-auto">
                  {plans.map(plan => {
                    const date = new Date(plan.date)
                    const shiftInfo = SHIFT_TIMES.find(s => s.name === plan.shift)
                    return (
                      <div 
                        key={plan.date}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50 group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {date.getDate()} {THAI_MONTHS[date.getMonth()].slice(0, 3)} {date.getFullYear() + 543}
                          </span>
                          <Badge className={cn("text-xs", shiftInfo?.color)}>
                            {plan.shift}
                          </Badge>
                        </div>
                        <button
                          onClick={() => removePlan(plan.date)}
                          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 bg-muted/30 border-t border-border flex gap-3 shrink-0">
          <Button 
            variant="outline" 
            className="flex-1 bg-transparent"
            onClick={onClose}
          >
            ยกเลิก
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "กำลังบันทึก..." : "บันทึกแผนกะ"}
          </Button>
        </div>
      </div>
    </div>
  )
}
