"use client"

import { Users, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Technician } from "@/lib/types"
import { SHIFT_TIMES, getCurrentShift } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ShiftOverviewProps {
  technicians: Technician[]
}

export function ShiftOverview({ technicians }: ShiftOverviewProps) {
  const currentShift = getCurrentShift()
  
  const shiftCounts = SHIFT_TIMES.map(shift => ({
    ...shift,
    count: technicians.filter(t => t.shift === shift.name).length,
    isCurrent: shift.name === currentShift
  }))

  const totalActive = technicians.filter(t => t.shift !== 'Day Off').length
  const currentShiftCount = technicians.filter(t => t.shift === currentShift).length

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{technicians.length}</p>
                <p className="text-xs text-muted-foreground">Total Technicians</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalActive}</p>
                <p className="text-xs text-muted-foreground">On Duty</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{currentShiftCount}</p>
                <p className="text-xs text-muted-foreground">{currentShift} Shift (Current)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{technicians.filter(t => t.shift === 'Day Off').length}</p>
                <p className="text-xs text-muted-foreground">Day Off</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shift Distribution */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">Shift Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {shiftCounts.map((shift) => (
              <div 
                key={shift.name}
                className={cn(
                  "rounded-lg p-4 border transition-all",
                  shift.isCurrent 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className={cn("text-xs", shift.color)}>
                    {shift.name}
                  </Badge>
                  {shift.isCurrent && (
                    <span className="text-xs text-primary font-medium animate-pulse">● Current</span>
                  )}
                </div>
                <p className="text-3xl font-bold text-foreground">{shift.count}</p>
                <p className="text-xs text-muted-foreground">
                  {shift.startTime === '-' ? 'Day Off' : `${shift.startTime} - ${shift.endTime}`}
                </p>
                
                {/* Progress bar */}
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      shift.name === 'Morning' && "bg-gray-400",
                      shift.name === 'Afternoon' && "bg-red-600",
                      shift.name === 'Night' && "bg-yellow-400",
                      shift.name === 'Day Off' && "bg-green-500"
                    )}
                    style={{ width: `${(shift.count / technicians.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Distribution */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">Department Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Maintenance', 'Electrical', 'Mechanical'].map(dept => {
              const deptTechs = technicians.filter(t => t.department === dept)
              const deptShifts = SHIFT_TIMES.map(s => ({
                name: s.name,
                color: s.color,
                count: deptTechs.filter(t => t.shift === s.name).length
              }))
              
              return (
                <div key={dept} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                  <div className="w-24 font-medium text-foreground text-sm">{dept}</div>
                  <div className="flex-1 flex items-center gap-2">
                    {deptShifts.map(s => (
                      <div key={s.name} className="flex items-center gap-1">
                        <Badge variant="outline" className={cn("text-xs", s.color)}>
                          {s.name}: {s.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Total: {deptTechs.length}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
