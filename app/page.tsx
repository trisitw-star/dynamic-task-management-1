"use client"

import { useEffect, useState } from "react"
import { ShiftHeader } from "@/components/shift-header"
import { TechnicianSidebar } from "@/components/technician-sidebar"
import { ShiftOverview } from "@/components/shift-overview"
import { EditShiftModal } from "@/components/edit-shift-modal"
import { ShiftPlanModal } from "@/components/shift-plan-modal"
import { initialTechnicians } from "@/lib/store"
import type { Technician, ShiftType, ShiftPlan } from "@/lib/types"

export default function ShiftManagementPage() {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [, setTick] = useState(0)

  // Update every minute to check shift changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const selectedTechnician = technicians.find(t => t.id === selectedId)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setShowModal(true)
  }

  const handleSaveShift = (id: string, newShift: ShiftType) => {
    setTechnicians(prev => 
      prev.map(tech => 
        tech.id === id ? { ...tech, shift: newShift } : tech
      )
    )
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedId(null)
  }

  const handleOpenPlanModal = () => {
    setShowModal(false)
    setShowPlanModal(true)
  }

  const handleClosePlanModal = () => {
    setShowPlanModal(false)
    setSelectedId(null)
  }

  const handleSavePlans = (id: string, plans: ShiftPlan[]) => {
    setTechnicians(prev => 
      prev.map(tech => 
        tech.id === id ? { ...tech, shiftPlans: plans } : tech
      )
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ShiftHeader />
      
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Technician List */}
        <TechnicianSidebar
          technicians={technicians}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
        
        {/* Main Content - Overview */}
        <main className="flex-1 overflow-auto">
          <ShiftOverview technicians={technicians} />
        </main>
      </div>

      {/* Edit Modal */}
      {showModal && selectedTechnician && (
        <EditShiftModal
          technician={selectedTechnician}
          onClose={handleCloseModal}
          onSave={handleSaveShift}
          onOpenPlanModal={handleOpenPlanModal}
        />
      )}

      {/* Plan Modal */}
      {showPlanModal && selectedTechnician && (
        <ShiftPlanModal
          technician={selectedTechnician}
          onClose={handleClosePlanModal}
          onSave={handleSavePlans}
        />
      )}
    </div>
  )
}
