"use client"

import { Search, User, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Technician, ShiftType } from "@/lib/types"
import { SHIFT_TIMES, getCurrentShift } from "@/lib/types"
import { cn } from "@/lib/utils"

interface TechnicianSidebarProps {
  technicians: Technician[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TechnicianSidebar({ technicians, selectedId, onSelect }: TechnicianSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const currentShift = getCurrentShift()

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group and sort: current shift first, then others
  const groupedTechnicians = SHIFT_TIMES.reduce((acc, shiftTime) => {
    const techs = filteredTechnicians.filter(t => t.shift === shiftTime.name)
    if (techs.length > 0) {
      acc.push({
        shift: shiftTime.name,
        color: shiftTime.color,
        time: `${shiftTime.startTime} - ${shiftTime.endTime}`,
        technicians: techs,
        isCurrent: shiftTime.name === currentShift
      })
    }
    return acc
  }, [] as { shift: ShiftType; color: string; time: string; technicians: Technician[]; isCurrent: boolean }[])

  // Sort to put current shift first
  groupedTechnicians.sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1
    if (!a.isCurrent && b.isCurrent) return 1
    return 0
  })

  const getShiftBadgeColor = (shift: ShiftType) => {
    const shiftInfo = SHIFT_TIMES.find(s => s.name === shift)
    return shiftInfo?.color || ''
  }

  return (
    <aside className="w-full lg:w-80 bg-card border-r border-border h-[calc(100vh-80px)] flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search name, ID, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted border-border"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>Total {filteredTechnicians.length} people</span>
          <span className="text-xs">Click to edit shift</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {groupedTechnicians.map((group) => (
          <div key={group.shift} className="border-b border-border last:border-b-0">
            <div className={cn(
              "px-4 py-2 flex items-center justify-between sticky top-0",
              group.isCurrent ? "bg-primary/10 border-l-4 border-l-primary" : "bg-muted/50"
            )}>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-xs", group.color)}>
                  {group.shift}
                </Badge>
                {group.isCurrent && (
                  <span className="text-xs font-medium text-primary animate-pulse">● Current Shift</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{group.technicians.length} people</span>
            </div>
            
            <div className="divide-y divide-border">
              {group.technicians.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => onSelect(tech.id)}
                  className={cn(
                    "w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/50 transition-colors text-left",
                    selectedId === tech.id && "bg-accent border-l-4 border-l-primary"
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{tech.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{tech.employeeId}</span>
                      <span>•</span>
                      <span>{tech.department}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {filteredTechnicians.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No technicians found</p>
          </div>
        )}
      </div>
    </aside>
  )
}
