'use client'

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/use-auth';
import { createAttachment } from '@/app/service/attachment-service';
import { Folder, Plus, Trash2, Upload, X } from "lucide-react";
import FileUpload from "@/app/components/FileUpload";
import { Input } from "@/components/ui/input";
import Accordion from "@/app/components/Accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import DatePicker from '@/app/components/DatePicker';
import Select from '@/app/components/Select'
import { Label } from '@/components/ui/label';
import CheckBoxItem from '@/app/components/CheckBoxItem';
import { createProject } from '@/app/service/project-service';


type FormData = {
    name: string;
    owner: string;
    book?: File;
};


export default function NewProject() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attachments, setAttachments] = useState<{ type: string; file: File }[]>([]);
    const [bookFile, setBookFile] = useState<File | null>(null);
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            owner: user.id,
        }
    });

    const handleFileSelect = (file: File | null, type: string) => {
        if (!file) {
            setAttachments(prev => prev.filter(att => att.type !== type));
            return;
        }

        setAttachments(prev => [
            ...prev.filter(att => att.type !== type),
            { type, file }
        ]);
    };

    const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBookFile(e.target.files[0]);
        }
    };

    const onSubmit = async (data: FormData) => {
        if (!user) {
            console.error('Usuário não autenticado');
            return;
        }

        if (!bookFile) {
            alert('Por favor, selecione um arquivo de livro');
            return;
        }

        const projectData = {
            ...data,
            owner: user.id,
        };

        try {
            setIsSubmitting(true);

            // 1. Criar o projeto primeiro com o arquivo do livro
            const projectResponse = await createProject(projectData, bookFile || undefined);
            const projectId = projectResponse?._id || projectResponse?.data?._id;

            if (!projectId) {
                throw new Error('Falha ao criar o projeto: ID não retornado');
            }

            // 2. Fazer upload dos anexos adicionais em paralelo
            if (attachments.length > 0) {
                const uploadPromises = attachments.map(attachment =>
                    createAttachment({
                        file: attachment.file,
                        name: `${projectData.name} - ${attachment.type}`,
                        projectId,
                        ownerId: user.id
                    })
                );

                await Promise.all(uploadPromises);
            }

            router.push('/dashboard/projects');
        } catch (error) {
            console.error('Erro ao criar projeto ou enviar anexos:', error);
            // Aqui você pode adicionar tratamento de erro mais detalhado
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
            <div className="flex justify-center items-start w-full py-4">
                <form onSubmit={handleSubmit(onSubmit)} className="w-[80%] p-4">
                    <div>
                        <div className="flex items-center gap-1">
                            <Folder className="h-5 w-5" />
                            <h1 className="text-xl font-semibold">Novo projeto</h1>
                        </div>
                        <p className="text-sm text-slate-500">Adicione projetos para organizar campanhas, materiais e informações uteis.</p>
                    </div>

                    <div className="flex flex-col justify-start py-4">
                        <div className="">
                            <Accordion title="Informações Básicas" defaultOpen={true}>
                                <div className="py-2 flex flex-col gap-2">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Nome do Projeto</Label>
                                            <Input
                                                id="name"
                                                placeholder="Digite o nome do projeto"
                                                className="mt-2"
                                                {...register('name', { required: 'Nome do projeto é obrigatório' })}
                                            />
                                            {errors.name && (
                                                <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label>Book do projeto</Label>
                                            <div className="flex items-center gap-2">
                                                <label
                                                    htmlFor="book-upload"
                                                    className="flex-1 cursor-pointer border border-dashed rounded-md p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors min-h-[120px]"
                                                >
                                                    <Upload className="h-5 w-5 text-muted-foreground mb-2" />
                                                    <span className="text-sm text-muted-foreground text-center">
                                                        {bookFile ? bookFile.name : 'Clique para fazer upload do book do projeto'}
                                                    </span>
                                                    <input
                                                        id="book-upload"
                                                        type="file"
                                                        className="hidden"
                                                        accept=".pdf,.epub,.mobi"
                                                        onChange={handleBookFileChange}
                                                        required
                                                    />
                                                </label>
                                                {bookFile && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-destructive hover:bg-destructive/10"
                                                        onClick={() => setBookFile(null)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            {bookFile && (
                                                <div className="text-xs text-muted-foreground">
                                                    Tamanho: {(bookFile.size / 1024).toFixed(2)} KB
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>


                        <div>
                            <Accordion title="Materiais (Opcional)" defaultOpen={false}>
                                <div className="py-2 flex flex-col gap-6">
                                    <FileUpload
                                        label="Outros Documentos: Vídeos, Imagens, PDFs, etc.. (Opcional)"
                                        accept=".pdf,.doc,.docx,.xlsx,.xls,.mp4,.mov,.avi,.jpg,.jpeg,.png,.gif"
                                        onFileSelect={(file) => handleFileSelect(file, 'other_docs')}
                                    />
                                </div>
                            </Accordion>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className='cursor-pointer'
                        >
                            {isSubmitting ? 'Salvando...' : 'Criar Projeto'}
                        </Button>

                    </div>
                </form>
            </div>
        </>
    )
}