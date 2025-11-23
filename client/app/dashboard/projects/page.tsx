"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useProjects } from "@/app/hooks/use-projects"
import DataTable from "@/app/components/DataTable"
import { useState, useMemo } from "react"
import { columns } from "@/app/utils/project-columns"
import TypeFilter from "@/app/components/TypeFilter"
import { SearchBar } from "@/app/components/ui/search-bar"
import { Project } from "@/app/types/project"
import { useRouter } from "next/navigation"

export default function ProjectsPage() {

  const { projects } = useProjects()
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const router = useRouter()

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesType = !typeFilter || (project.type && project.type.includes(typeFilter));
      const matchesSearch = project.info.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [projects, typeFilter, searchTerm]);

  // Extrai todos os tipos únicos para o filtro
  const allTypes = useMemo(() => {
    const types = new Set<string>();
    projects.forEach(project => {
      if (project.type) {
        project.type.forEach((t: string) => types.add(t));
      }
    });
    return Array.from(types);
  }, [projects]);

  return (
    <div className="container mx-auto py-6 w-[90%]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">Gerencie seus projetos imobiliários</p>
        </div>
        <Link href="/dashboard/projects/new-project">
          <Button className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1"
          />
          <TypeFilter
            value={typeFilter}
            onChange={setTypeFilter}
            availableTypes={projects.map(p => p.type || [])}
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredProjects}
          onRowClick={(row) =>
            router.push(`/dashboard/projects/${row._id}`)
          }
        />
      </div>

    </div>
  )
}