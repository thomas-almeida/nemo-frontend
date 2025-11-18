'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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


type Unit = {
    id: string;
    footage: number;
    price: number;
};

type Location = {
    name: string;
    distance: number;
};

type FormData = {
    info: {
        name: string;
        address: string;
        developer: string;
        company: string;
        details: string;
        launchDate: Date | null;
        deliveryDate: Date | null;
    };
    type: string[];
    owner: {
        id: string;
        role: string;
    };
    units: Unit[];
    location: Location[];
};


const UNIT_TYPES = [
    { id: 'HIS', label: 'HIS', description: 'Unidades Residenciais com trava de renda' },
    { id: 'HMP', label: 'HMP', description: 'Unidades Residenciais com curta temporada' },
    { id: 'R2V', label: 'R2V', description: 'Unidades com livre legislação' },
    { id: 'NR', label: 'NR', description: 'Unidades para curta temporada apenas' },
];

export default function NewProject() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [units, setUnits] = useState<Unit[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [newUnit, setNewUnit] = useState({ footage: '', price: '' });
    const [newLocation, setNewLocation] = useState({ name: '', distance: '' });
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        defaultValues: {
            info: {
                name: '',
                address: '',
                developer: '',
                company: '',
                details: '',
                launchDate: null,
                deliveryDate: null
            },
            type: [],
            owner: {
                id: '691926d75f63e7c8cd712c3f', // Default owner ID from your example
                role: 'ADMIN'
            },
            units: [],
            location: []
        }
    });

    const handleTypeToggle = (typeId: string) => {
        setSelectedTypes(prev =>
            prev.includes(typeId)
                ? prev.filter(id => id !== typeId)
                : [...prev, typeId]
        );
    };

    const onSubmit = async (data: FormData) => {

        const formData = {
            ...data,
            type: selectedTypes,
            units: units.map(unit => ({
                footage: Number(unit.footage),
                price: Number(unit.price)
            })),
            location: locations.map(loc => ({
                name: loc.name,
                distance: Number(loc.distance)
            }))
        };

        try {
            setIsSubmitting(true);
            const response = await createProject(formData);
            console.log(response)
            router.push('/dashboard/projects');
        } catch (error) {
            console.error('Error:', error);
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
                            <Accordion title="Informações Básicas">
                                <div className="py-2 flex flex-col gap-2">
                                    <h3 className="font-medium text-sm">Dados do Empreendimento</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Input
                                                placeholder="Nome do projeto"
                                                {...register('info.name', { required: 'Nome do projeto é obrigatório' })}
                                                className={errors.info?.name ? 'border-red-500' : ''}
                                            />
                                            {errors.info?.name && (
                                                <p className="text-xs text-red-500">{errors.info.name.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                placeholder="Endereço do Projeto"
                                                {...register('info.address', { required: 'Endereço é obrigatório' })}
                                                className={errors.info?.address ? 'border-red-500' : ''}
                                            />
                                            {errors.info?.address && (
                                                <p className="text-xs text-red-500">{errors.info.address.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                placeholder="Incorporadora"
                                                {...register('info.developer', { required: 'Incorporadora é obrigatória' })}
                                                className={errors.info?.developer ? 'border-red-500' : ''}
                                            />
                                            {errors.info?.developer && (
                                                <p className="text-xs text-red-500">{errors.info.developer.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                placeholder="Construtora"
                                                {...register('info.company', { required: 'Construtora é obrigatória' })}
                                                className={errors.info?.company ? 'border-red-500' : ''}
                                            />
                                            {errors.info?.company && (
                                                <p className="text-xs text-red-500">{errors.info.company.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <DatePicker
                                                label="Data de Lançamento"
                                                selectText="Selecione a data"
                                                onSelectDate={(date) => {
                                                    // Atualiza o valor do formulário quando uma data é selecionada
                                                    const form = document.forms[0] as HTMLFormElement;
                                                    const formData = new FormData(form);
                                                    formData.set('info.launchDate', date?.toISOString() || '');
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <DatePicker
                                                label="Data de Entrega"
                                                selectText="Selecione a data"
                                                onSelectDate={(date) => {
                                                    // Atualiza o valor do formulário quando uma data é selecionada
                                                    const form = document.forms[0] as HTMLFormElement;
                                                    const formData = new FormData(form);
                                                    formData.set('info.deliveryDate', date?.toISOString() || '');
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className='py-2 flex flex-col gap-2'>
                                    <h3 className="font-medium text-sm">Informações Extras</h3>
                                    <Textarea
                                        placeholder="Detalhes adicionais sobre o projeto..."
                                        {...register('info.details')}
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div className='flex flex-col gap-4 pt-4'>
                                    <div className="flex flex-col gap-2 border p-2 rounded py-4">
                                        <h3 className="font-medium text-sm">Tipo das Unidades</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {UNIT_TYPES.map((type) => (
                                                <CheckBoxItem
                                                    key={type.id}
                                                    label={type.label}
                                                    description={type.description}
                                                    checked={selectedTypes.includes(type.id)}
                                                    onCheckedChange={() => handleTypeToggle(type.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-4 pt-4'>
                                    <div className="flex flex-col gap-2 border p-2 rounded py-4">
                                        <h3 className="font-medium text-sm">Unidades e Valores</h3>
                                        <div className="space-y-2">
                                            {units.map((unit) => (
                                                <div key={unit.id} className="flex items-center gap-2 p-2 border rounded mb-4">
                                                    <div className="flex-1">
                                                        <span className="text-sm font-medium">{unit.footage}m²</span>
                                                        <span className="mx-2 text-muted-foreground">•</span>
                                                        <span className="text-sm">R$ {unit.price.toLocaleString('pt-BR')}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                        onClick={() => setUnits(units.filter(u => u.id !== unit.id))}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Metragem (m²)"
                                                    value={newUnit.footage}
                                                    onChange={(e) => setNewUnit({ ...newUnit, footage: e.target.value })}
                                                    className="flex-1"
                                                    min="1"
                                                    step="0.01"
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Valor"
                                                    value={newUnit.price}
                                                    onChange={(e) => setNewUnit({ ...newUnit, price: e.target.value })}
                                                    className="flex-1"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                            <Button
                                                className="w-full cursor-pointer mt-1"
                                                onClick={() => {
                                                    if (newUnit.footage && newUnit.price) {
                                                        setUnits([...units, {
                                                            id: Date.now().toString(),
                                                            footage: parseFloat(newUnit.footage),
                                                            price: parseFloat(newUnit.price)
                                                        }]);
                                                        setNewUnit({ footage: '', price: '' });
                                                    }
                                                }}
                                                disabled={!newUnit.footage || !newUnit.price}
                                            >
                                                Adicionar Unidade
                                                <Plus className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 border p-2 rounded py-4">
                                        <h3 className="font-medium text-sm">Região</h3>
                                        <div className="space-y-2">
                                            {locations.map((location) => (
                                                <div key={location.name} className="flex items-center gap-2 p-2 border rounded mb-4">
                                                    <div className="flex-1">
                                                        <span className="text-sm font-medium">{location.name}</span>
                                                        <span className="mx-2 text-muted-foreground">•</span>
                                                        <span className="text-sm">{location.distance} m</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                        onClick={() => setLocations(locations.filter(l => l.name !== location.name))}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Ponto de referencia (Ex: faculdade, parque, etc.)"
                                                    value={newLocation.name}
                                                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                                    className="flex-1"
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Distância (metros)"
                                                    value={newLocation.distance}
                                                    onChange={(e) => setNewLocation({ ...newLocation, distance: e.target.value })}
                                                    className="flex-1"
                                                    min="0"
                                                    step="1"
                                                />
                                            </div>
                                            <Button
                                                className="w-full cursor-pointer mt-1"
                                                onClick={() => {
                                                    if (newLocation.name && newLocation.distance) {
                                                        setLocations([...locations, {
                                                            name: newLocation.name,
                                                            distance: parseInt(newLocation.distance)
                                                        }]);
                                                        setNewLocation({ name: '', distance: '' });
                                                    }
                                                }}
                                                disabled={!newLocation.name || !newLocation.distance}
                                            >
                                                Adicionar Ponto
                                                <Plus className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>


                        <div>
                            <Accordion title="Materiais (Opcional)" defaultOpen={false}>
                                <div className="py-2 flex flex-col gap-6">
                                    <FileUpload
                                        label="Book do Projeto (PDF ou Imagens)"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onFileSelect={(file) => {
                                            // Handle file selection
                                            console.log('Book do Projeto selecionado:', file?.name);
                                        }}
                                    />

                                    <FileUpload
                                        label="Vídeo de Decorado (MP4, MOV)"
                                        accept=".mp4,.mov,.avi"
                                        onFileSelect={(file) => {
                                            // Handle file selection
                                            console.log('Vídeo de Decorado selecionado:', file?.name);
                                        }}
                                    />

                                    <FileUpload
                                        label="Tabela de Pagamentos (PDF, Excel)"
                                        accept=".pdf,.xlsx,.xls"
                                        onFileSelect={(file) => {
                                            // Handle file selection
                                            console.log('Tabela de Pagamentos selecionada:', file?.name);
                                        }}
                                    />

                                    <FileUpload
                                        label="Outros Documentos (PDF, Word, Excel)"
                                        accept=".pdf,.doc,.docx,.xlsx,.xls"
                                        onFileSelect={(file) => {
                                            // Handle file selection
                                            console.log('Outro documento selecionado:', file?.name);
                                        }}
                                    />
                                </div>
                            </Accordion>
                        </div>
                        <div>
                            <Accordion
                                title="Carteira de Clientes"
                                defaultOpen={false}
                            >
                                <p className='text-sm text-slate-500'>Clientes para receberem disparos desse projeto por padrão.</p>
                                <div className="py-2 flex flex-col gap-6">
                                    <FileUpload
                                        label="Importar nova base (CSV)"
                                        accept=".csv"
                                        onFileSelect={(file) => {
                                            console.log('Base selecionada:', file?.name);
                                        }}
                                    />

                                    <div>
                                        <Label>Selecionar das Bases Existentes</Label>
                                        <Select
                                            options={[
                                                { value: 'option1', label: 'Nenhum' },
                                                { value: 'option2', label: 'Base 2' },
                                                { value: 'option3', label: 'Base 3' },
                                            ]}
                                            value={''}
                                            onChange={(value) => console.log('Opção selecionada:', value)}
                                        />
                                    </div>
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