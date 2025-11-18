"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Project, Unit } from "@/app/types/project"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ProjectDetailsSheetProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDetailsSheet({ project, open, onOpenChange }: ProjectDetailsSheetProps) {
  if (!project) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        className="w-full sm:max-w-md md:max-w-lg overflow-y-auto transition-all duration-300 ease-in-out"
        side="right"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">{project.info.name}</SheetTitle>
          <SheetDescription>
            {project.info.developer} • {project.info.address}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Informações do Projeto</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Status:</span> {project.status || 'Não informado'}</p>
              <p><span className="text-muted-foreground">Data de Entrega:</span> {project.info.releaseDate ? formatDate(project.info.releaseDate) : 'Não informada'}</p>
              <p><span className="text-muted-foreground">Descrição:</span> {project.info.description || 'Não informada'}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Unidades Disponíveis</h3>
            <div className="space-y-2">
              {project.units?.length ? (
                project.units.map((unit: Unit) => (
                  <div key={unit._id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{unit.footage}m²</p>
                        <p className="text-sm text-muted-foreground">{unit.type || 'Tipo não especificado'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(unit.price)}</p>
                        <p className="text-sm text-muted-foreground">{unit.status || 'Disponível'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma unidade cadastrada</p>
              )}
            </div>
          </div>

          {project.amenities && project.amenities.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Diferenciais</h3>
              <div className="flex flex-wrap gap-2">
                {project.amenities?.map((amenity: string, index: number) => (
                  <span key={index} className="px-2 py-1 text-xs rounded-full bg-secondary">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-8">
          <SheetClose asChild>
            <Button type="button" variant="outline">Fechar</Button>
          </SheetClose>
          <Button asChild>
            <a href={`/dashboard/projects/${project._id}/edit`}>
              Editar Projeto
            </a>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
