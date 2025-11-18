
"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CampaignsPage() {

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground">Gerencie suas campanhas de marketing</p>
        </div>
        <Link href="/dashboard/campaigns/new-campaign">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Novo Disparo
          </Button>
        </Link>
      </div>

    </div>
  )
}