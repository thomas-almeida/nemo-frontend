'use client'

import { useState } from 'react';
import { Folder, Plus, Trash2, Upload, X } from "lucide-react";
import FileUpload from "@/app/components/FileUpload";
import { Input } from "@/components/ui/input";
import Accordion from "@/app/components/Accordion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import DatePicker from '@/app/components/DatePicker';
import Select from '@/app/components/Select';
import { Label } from '@/components/ui/label';

interface Unit {
    id: string;
    size: string;
    value: string;
}

interface RegionItem {
    id: string;
    name: string;
    distance: string
}

export default function NewProject() {
    const [units, setUnits] = useState<Unit[]>([]);
    const [regionItem, setRegionItem] = useState<RegionItem[]>([]);
    const [newUnit, setNewUnit] = useState({ size: '', value: '' });
    const [newRegionItem, setNewRegionItem] = useState({ name: '', distance: '' });
    return (
        <>
            <div className="flex justify-center items-start h-screen w-full py-4">
                <div className="w-[80%] p-4">
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
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="Nome do projeto" className="" />
                                        <Input placeholder="Endereço do Projeto" className="" />
                                        <Input placeholder="Incorporadora" className="" />
                                        <Input placeholder="Construtora" className="" />
                                        <div className="py-4">
                                            <DatePicker label="Data de Entrega" selectText="Selecione a data" />
                                        </div>
                                        <div className="py-4">
                                            <DatePicker label="Lançamento" selectText="Selecione a data" />
                                        </div>
                                    </div>
                                </div>

                                <div className='py-2 flex flex-col gap-2'>
                                    <h3 className="font-medium text-sm">Informações Extras</h3>
                                    <Textarea
                                        placeholder="..."
                                        className=""
                                    />
                                </div>

                                <div className='flex flex-col gap-4 pt-4'>
                                    <div className="flex flex-col gap-2 border p-2 rounded py-4">
                                        <h3 className="font-medium text-sm">Unidades e Valores</h3>
                                        <div className="space-y-2">
                                            {units.map((unit) => (
                                                <div key={unit.id} className="flex items-center gap-2 p-2 border rounded mb-4">
                                                    <div className="flex-1">
                                                        <span className="text-sm font-medium">{unit.size}m²</span>
                                                        <span className="mx-2 text-muted-foreground">•</span>
                                                        <span className="text-sm">R$ {unit.value}</span>
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
                                                    placeholder="Metragem (m²)"
                                                    value={newUnit.size}
                                                    onChange={(e) => setNewUnit({ ...newUnit, size: e.target.value })}
                                                    className="flex-1"
                                                />
                                                <Input
                                                    placeholder="Valor"
                                                    value={newUnit.value}
                                                    onChange={(e) => setNewUnit({ ...newUnit, value: e.target.value })}
                                                    className="flex-1"
                                                />
                                            </div>
                                            <Button
                                                className="w-full cursor-pointer mt-1"
                                                onClick={() => {
                                                    if (newUnit.size && newUnit.value) {
                                                        setUnits([...units, {
                                                            id: Date.now().toString(),
                                                            ...newUnit
                                                        }]);
                                                        setNewUnit({ size: '', value: '' });
                                                    }
                                                }}
                                                disabled={!newUnit.size || !newUnit.value}
                                            >
                                                Adicionar Unidade
                                                <Plus className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 border p-2 rounded py-4">
                                        <h3 className="font-medium text-sm">Região</h3>
                                        <div className="space-y-2">
                                            {regionItem.map((region) => (
                                                <div key={region.id} className="flex items-center gap-2 p-2 border rounded mb-4">
                                                    <div className="flex-1">
                                                        <span className="text-sm font-medium">{region.name}</span>
                                                        <span className="mx-2 text-muted-foreground">•</span>
                                                        <span className="text-sm">{region.distance} m</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                        onClick={() => setRegionItem(regionItem.filter(r => r.id !== region.id))}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Ponto de referencia (Ex: faculdade, parque, etc.)"
                                                    value={newRegionItem.name}
                                                    onChange={(e) => setNewRegionItem({ ...newRegionItem, name: e.target.value })}
                                                    className="flex-1"
                                                />
                                                <Input
                                                    placeholder="Distância (metros)"
                                                    value={newRegionItem.distance}
                                                    onChange={(e) => setNewRegionItem({ ...newRegionItem, distance: e.target.value })}
                                                    className="flex-1"
                                                />
                                            </div>
                                            <Button
                                                className="w-full cursor-pointer mt-1"
                                                onClick={() => {
                                                    if (newRegionItem.name && newRegionItem.distance) {
                                                        setRegionItem([...regionItem, {
                                                            id: Date.now().toString(),
                                                            ...newRegionItem
                                                        }]);
                                                        setNewRegionItem({ name: '', distance: '' });
                                                    }
                                                }}
                                                disabled={!newRegionItem.name || !newRegionItem.distance}
                                            >
                                                Adicionar Ponto
                                                <Plus className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Accordion>
                        </div>
                        <div >
                            <Accordion title="Materiais" defaultOpen={false}>
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
                        <Button>
                            Adicionar Empreendimento
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}