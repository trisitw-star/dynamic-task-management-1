"use client"

import { Clock, Users, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { getCurrentShift, SHIFT_TIMES } from "@/lib/types"

export function ShiftHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const currentShift = getCurrentShift()
  const shiftInfo = SHIFT_TIMES.find(s => s.name === currentShift)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ระบบจัดการกะทำงาน</h1>
              <p className="text-sm text-muted-foreground">บริหารจัดการกะช่างอย่างมีประสิทธิภาพ</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{formatDate(currentTime)}</span>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono font-bold text-foreground">{formatTime(currentTime)}</span>
            </div>
            
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${shiftInfo?.color}`}>
              <span className="text-sm font-medium">กะปัจจุบัน:</span>
              <span className="font-bold">{currentShift}</span>
              <span className="text-xs opacity-80">({shiftInfo?.startTime} - {shiftInfo?.endTime})</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
