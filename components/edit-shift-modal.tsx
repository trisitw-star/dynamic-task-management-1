"use client"

import { X, User, Phone, Building, Briefcase, Clock, Check, CalendarDays } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Technician, ShiftType } from "@/lib/types"
import { SHIFT_TIMES } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EditShiftModalProps {
  technician: Technician
  onClose: () => void
  onSave: (id: string, newShift: ShiftType) => void
  onOpenPlanModal: () => void
}

export function EditShiftModal({ technician, onClose, onSave, onOpenPlanModal }: EditShiftModalProps) {
  const [selectedShift, setSelectedShift] = useState<ShiftType>(technician.shift)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    onSave(technician.id, selectedShift)
    setIsSaving(false)
    onClose()
  }

  const hasChanges = selectedShift !== technician.shift

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-border">
        {/* Header */}
        <div className="bg-primary p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary-foreground">Edit Work Shift</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-primary-foreground/20 transition-colors"
          >
            <X className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>
        
        {/* Technician Info */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border-2 border-primary">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{technician.name}</h3>
              <p className="text-sm text-muted-foreground">{technician.employeeId}</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>{technician.department}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{technician.position}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <Phone className="h-4 w-4" />
              <span>{technician.phone}</span>
            </div>
          </div>
        </div>
        
        {/* Current Shift */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Shift:</span>
            <Badge className={cn(
              "text-sm",
              SHIFT_TIMES.find(s => s.name === technician.shift)?.color
            )}>
              {technician.shift}
            </Badge>
          </div>
        </div>
        
        {/* Shift Selection */}
        <div className="p-4">
          <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4" />
            Select New Shift:
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            {SHIFT_TIMES.map((shift) => (
              <button
                key={shift.name}
                onClick={() => setSelectedShift(shift.name)}
                className={cn(
                  "relative p-3 rounded-lg border-2 transition-all text-left",
                  selectedShift === shift.name
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                {selectedShift === shift.name && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <Badge className={cn("text-xs mb-1", shift.color)}>
                  {shift.name}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {shift.startTime === '-' ? 'Day Off' : `${shift.startTime} - ${shift.endTime}`}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Plan Button */}
        <div className="px-4 py-3 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full bg-transparent border-primary/50 text-primary hover:bg-primary/5"
            onClick={onOpenPlanModal}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Plan Shifts in Advance
            {technician.shiftPlans.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground text-xs">
                {technician.shiftPlans.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Actions */}
        <div className="p-4 bg-muted/30 border-t border-border flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 bg-transparent"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
