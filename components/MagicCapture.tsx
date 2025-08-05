import React, { useState, useCallback, useRef } from 'react';
import { ExtractedData } from '../types';
import { ICONS } from '../constants';
import { extractDataFromImage } from '../services/geminiService';

interface MagicCaptureProps {
  onSave: (data: ExtractedData, imageUrl: string | null) => void;
}

type Status = 'idle' | 'preview' | 'loading' | 'confirm' | 'error';

const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const [mimeType, data] = result.split(';base64,');
            resolve({ data, mimeType: mimeType.replace('data:', '') });
        };
        reader.onerror = error => reject(error);
    });
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

const ChoiceButton: React.FC<{icon: React.ReactNode, title: string, description: string, onClick: () => void, 'data-testid'?: string}> = ({ icon, title, description, onClick, ...props }) => (
    <button
        onClick={onClick}
        {...props}
        className="flex flex-col items-center justify-center text-center p-6 border-2 border-slate-200 rounded-xl hover:bg-cuadrai-blue-50 hover:border-cuadrai-blue-400 transition-all duration-200 h-full w-full"
    >
        <div className="p-4 bg-cuadrai-blue-100 rounded-full mb-4 text-cuadrai-blue-700 text-3xl">
            {icon}
        </div>
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">{description}</p>
    </button>
);


const MagicCapture: React.FC<MagicCaptureProps> = ({ onSave }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Es un gasto deducible para mi actividad.');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setStatus('idle');
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setPrompt('Es un gasto deducible para mi actividad.');
    setExtractedData(null);
    setError(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
       if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setStatus('preview');
      setError(null);
    } else {
      setError('Por favor, selecciona un archivo de imagen válido (JPEG, PNG, etc.).');
    }
  }, [previewUrl]);

  const handleProcess = useCallback(async () => {
    if (!file) return;
    setStatus('loading');
    setError(null);
    try {
      const { data, mimeType } = await fileToBase64(file);
      const result = await extractDataFromImage(data, mimeType, prompt);
      setExtractedData(result);
      setStatus('confirm');
    } catch (err: any) {
      setError(err.message || 'Ha ocurrido un error al procesar la imagen.');
      setStatus('error');
    }
  }, [file, prompt]);

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(dragging);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      handleDragEvents(e, false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFileSelect(e.dataTransfer.files[0]);
      }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files && e.target.files[0]) {
          handleFileSelect(e.target.files[0]);
      }
  }

  const triggerCamera = () => {
    if (fileInputRef.current) {
        fileInputRef.current.setAttribute('capture', 'environment');
        fileInputRef.current.click();
    }
  }

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
        fileInputRef.current.removeAttribute('capture');
        fileInputRef.current.click();
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center p-10">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cuadrai-blue-700"></div>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mt-6">Analizando documento...</h3>
            <p className="text-slate-500 mt-2">CUADRAI está leyendo los datos. Esto puede tardar unos segundos.</p>
          </div>
        );
      case 'error':
      case 'preview':
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Previsualización</h3>
                    <div className="aspect-w-1 aspect-h-1 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        {previewUrl && <img src={previewUrl} alt="Previsualización de factura" className="w-full h-full object-contain" />}
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Instrucciones para la IA</h3>
                    <p className="text-sm text-slate-500 mb-3">Añade una nota para ayudar a CUADRAI a clasificar el documento. Por ejemplo: "Es una factura de cliente" o "Es un gasto de material de oficina".</p>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Escribe aquí tus instrucciones..."
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cuadrai-blue-500 focus:border-cuadrai-blue-500 transition flex-grow"
                        rows={4}
                    />
                    {status === 'error' && error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg text-sm">{error}</div>}
                    <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
                         <button onClick={resetState} className="w-full bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancelar</button>
                         <button onClick={handleProcess} className="w-full bg-cuadrai-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-cuadrai-blue-800 transition-colors flex items-center justify-center gap-2">
                            {ICONS.magic} Analizar Documento
                        </button>
                    </div>
                </div>
            </div>
        );
      case 'confirm':
        if (!extractedData) return null;
        const isExpense = extractedData.documentType === 'expense';
        return (
            <div>
                 <h3 className="text-lg font-semibold text-slate-800 mb-4">Verifica los datos extraídos</h3>
                 <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><p className="text-slate-500">{isExpense ? 'Proveedor' : 'Cliente'}</p><p className="font-semibold text-slate-800">{extractedData.vendorOrClient}</p></div>
                        <div><p className="text-slate-500">Fecha</p><p className="font-semibold text-slate-800">{extractedData.date}</p></div>
                        {extractedData.invoiceId && <div><p className="text-slate-500">Nº Factura</p><p className="font-semibold text-slate-800">{extractedData.invoiceId}</p></div>}
                        {isExpense && extractedData.category && <div><p className="text-slate-500">Categoría</p><p className="font-semibold text-slate-800">{extractedData.category}</p></div>}
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                        <div className="flex justify-end gap-8">
                            <div className="text-right"><p className="text-slate-500">Base Imponible</p><p className="font-medium text-slate-700">{formatCurrency(extractedData.subtotal)}</p></div>
                            <div className="text-right"><p className="text-slate-500">IVA</p><p className="font-medium text-slate-700">{formatCurrency(extractedData.ivaAmount)}</p></div>
                            <div className="text-right"><p className="text-slate-500 text-lg font-bold">Total</p><p className="font-bold text-cuadrai-blue-800 text-lg">{formatCurrency(extractedData.totalAmount)}</p></div>
                        </div>
                    </div>
                 </div>
                 <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button onClick={resetState} className="w-full bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors">Descartar</button>
                    <button onClick={() => { if(extractedData) onSave(extractedData, previewUrl); resetState(); }} className="w-full bg-cuadrai-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">Confirmar y Guardar</button>
                 </div>
            </div>
        );

      case 'idle':
      default:
        return (
          <div
            onDragOver={(e) => handleDragEvents(e, true)}
            onDragLeave={(e) => handleDragEvents(e, false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition-all duration-300 ${isDragging ? 'border-cuadrai-blue-500 bg-cuadrai-blue-50' : 'border-slate-300'}`}
          >
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 sm:gap-6">
                 <ChoiceButton 
                    icon={ICONS.camera} 
                    title="Tomar Foto con el Móvil"
                    description="Usa la cámara de tu dispositivo para capturar el documento al instante."
                    onClick={triggerCamera}
                    data-testid="take-photo-button"
                />
                 <ChoiceButton 
                    icon={ICONS.upload} 
                    title="Subir un Archivo"
                    description="Selecciona una imagen (PNG, JPG) desde tu ordenador o galería."
                    onClick={triggerFileUpload}
                    data-testid="upload-file-button"
                />
            </div>
             <p className="text-xs text-slate-400 mt-6">O si lo prefieres, arrastra y suelta el archivo aquí.</p>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileInputChange}
            />
            {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
          </div>
        );
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-700">Captura Mágica con IA</h2>
        <p className="text-slate-500 mt-1">Ahorra tiempo dejando que CUADRAI registre tus gastos y facturas por ti.</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default MagicCapture;