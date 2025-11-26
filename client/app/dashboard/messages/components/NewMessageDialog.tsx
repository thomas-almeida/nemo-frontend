'use client'

import { useState } from "react"
import { Plus, FileText, Hash, FolderOpen, WandSparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useAuth } from "@/app/hooks/use-auth"
import { useProjects } from "@/app/hooks/use-projects"
import { createMessage } from "@/app/service/message-service"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MessageModal from "@/app/components/MessageModal"

type FormData = {
  name: string
  copy: string
  projectId: string
}

export function NewMessageDialog() {
  const { user } = useAuth()
  const { projects } = useProjects()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    setValue,
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      copy: '',
      projectId: ''
    },
    mode: 'onChange'
  })

  const [isOpen, setIsOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Observa mudanças no campo projectId
  const projectId = watch("projectId")

  // Valida se o formulário está válido
  const isFormValid = watch("name")?.trim() !== '' &&
    watch("copy")?.trim() !== '' &&
    watch("projectId")


  // Atualiza o valor do campo projectId
  const handleProjectChange = (value: string) => {
    setValue("projectId", value)
  }

  const onSubmit = async (data: FormData) => {
    try {
      await createMessage({
        ...data,
        ownerId: user.id,
      })
      toast.success("Mensagem criada com sucesso!")
      reset()
      setIsOpen(false)
      // Aqui você pode adicionar uma atualização da lista de mensagens se necessário
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar mensagem")
    }
  }

  return (
    <>

      <div className="z-auto w-full h-full">
        <MessageModal
          message="Você descobriu um recurso Premium"
          description="Para desbloquear esse recurso, considere assinar um dos nossos planos!"
          visible={showModal}
          onClose={() => { setShowModal(false) }}
        />
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="cursor-pointer">
            Nova Copy
            <Plus className="h-4 w-4 ml-2" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto p-4 px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
            <SheetHeader className="pb-6 border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="font-semibold">Criar Nova Copy</SheetTitle>
                  <SheetDescription className="text-xs">
                    Preencha os campos abaixo para criar uma nova mensagem.
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 py-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  Nome da Copy *
                </Label>
                <Input
                  id="name"
                  placeholder="Dê um nome para sua copy..."
                  className={`transition-colors focus:ring-2 focus:ring-primary/20 ${errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-primary"
                    }`}
                  {...register("name", {
                    required: "O nome é obrigatório",
                    minLength: {
                      value: 3,
                      message: "O nome deve ter pelo menos 3 caracteres"
                    }
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="copy" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Conteúdo da Copy *
                </Label>
                <Textarea
                  id="copy"
                  placeholder="Escreva o conteúdo da sua copy aqui..."
                  className={`min-h-[180px] resize-none transition-colors focus:ring-2 focus:ring-primary/20 ${errors.copy
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-primary"
                    }`}
                  {...register("copy", {
                    required: "O conteúdo é obrigatório",
                    minLength: {
                      value: 10,
                      message: "O conteúdo deve ter pelo menos 10 caracteres"
                    }
                  })}
                />
                <Button
                  className="mb-4 cursor-pointer"
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                  Gerar com IA
                  <WandSparkles className="w-4 h-4" />
                </Button>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{watch("copy")?.length || 0} caracteres</span>
                  {errors.copy && (
                    <p className="text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.copy.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectId" className="flex items-center gap-2 text-sm font-medium">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  Projeto
                </Label>
                <Select
                  onValueChange={handleProjectChange}
                  value={projectId}
                >
                  <SelectTrigger className={`transition-colors focus:ring-2 focus:ring-primary/20 ${!projectId
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-primary bg-primary/5"
                    }`}>
                    <SelectValue placeholder="Selecione um projeto..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {projects.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Nenhum projeto encontrado
                      </div>
                    ) : (
                      projects.map((project) => (
                        <SelectItem key={project._id} value={project._id}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            {project.info?.name || `Projeto ${project._id.substring(0, 6)}...`}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {!projectId && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    Selecione um projeto
                  </p>
                )}
              </div>
            </div>
            <div>
              <SheetFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  style={{
                    width: "100%"
                  }}
                  className={`sm:w-auto transition-all ${isFormValid
                    ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
                    : "opacity-50 cursor-not-allowed"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      Salvando...
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    </>
                  ) : (
                    <>
                      Criar Copy
                      <Plus className="h-4 w-4 mr-2" />
                    </>
                  )}
                </Button>
              </SheetFooter>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
