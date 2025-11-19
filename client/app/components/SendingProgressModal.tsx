'use client';

import { X } from 'lucide-react';

interface SendingProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  currentBatch: number;
  totalBatches: number;
  currentNumber: string;
  totalNumbers: number;
  processedCount: number;
  sentNumbers: string[];
}

export function SendingProgressModal({
  isOpen,
  onClose,
  progress,
  currentBatch,
  totalBatches,
  currentNumber,
  totalNumbers,
  processedCount,
  sentNumbers = [],
}: SendingProgressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Enviando Campanha</h2>
            <button
              onClick={onClose}
              disabled={progress < 100}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mb-6">
            Acompanhe o progresso do envio da sua campanha.
          </p>

          <div className="space-y-4">
            {currentNumber && (
              <div className="p-3 bg-green-50 rounded-md border border-green-100">
                <p className="text-sm text-green-700">
                  Enviando para: <span className="font-medium">{currentNumber}</span>
                </p>
              </div>
            )}
            
            {sentNumbers.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700">Números com envio confirmado:</p>
                <div className="space-y-1">
                  {sentNumbers.map((number, index) => (
                    <div key={index} className="flex items-center text-sm text-green-600">
                      <span className="w-5 h-5 flex items-center justify-center bg-green-100 rounded-full mr-2">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-500 text-xs">Lote Atual</p>
                <p className="font-medium">{`${currentBatch} de ${totalBatches}`}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-500 text-xs">Números Processados</p>
                <p className="font-medium">{`${processedCount} de ${totalNumbers}`}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              disabled={progress < 100}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                progress < 100 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {progress < 100 ? 'Processando...' : 'Concluir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
