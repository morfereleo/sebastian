import React from 'react';
import { ICONS } from '../constants';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMagicCapture: () => void;
  onSelectManualEntry: () => void;
}

const ChoiceButton: React.FC<{icon: React.ReactNode, title: string, description: string, onClick: () => void}> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center text-center p-6 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-cuadrai-blue-400 transition-all duration-200 h-full"
    >
        <div className="p-3 bg-slate-100 rounded-full mb-4 text-cuadrai-blue-700">
            {icon}
        </div>
        <h3 className="font-bold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
    </button>
);


const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ isOpen, onClose, onSelectMagicCapture, onSelectManualEntry }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all flex flex-col" role="dialog" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Añadir Nuevo Gasto</h2>
            <p className="text-slate-500 mt-1">¿Cómo quieres registrar tu gasto?</p>
        </div>
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ChoiceButton 
                icon={ICONS.magic} 
                title="Subir Justificante con IA"
                description="Sube una foto y deja que CUADRAI extraiga los datos por ti."
                onClick={onSelectMagicCapture}
            />
            <ChoiceButton 
                icon={ICONS.edit} 
                title="Introducir Gasto Manualmente"
                description="Rellena los campos del gasto tú mismo, paso a paso."
                onClick={onSelectManualEntry}
            />
        </div>
        <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-200 text-center">
             <button 
                onClick={onClose} 
                className="bg-slate-200 text-slate-700 font-medium py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors">
                Cancelar
            </button>
        </div>
      </div>
    </div>
  );
};

export default NewExpenseModal;
