import React, { useState } from 'react';
import { ProfileType } from '../types';

interface NewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProfile: (name: string, taxId: string, type: ProfileType) => void;
}

const NewProfileModal: React.FC<NewProfileModalProps> = ({ isOpen, onClose, onAddProfile }) => {
  const [profileType, setProfileType] = useState<ProfileType>('Individual');
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && taxId.trim()) {
      onAddProfile(name, taxId, profileType);
    }
  };

  if (!isOpen) return null;

  const isIndividual = profileType === 'Individual';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all flex flex-col" role="dialog" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Perfil</h2>
          <p className="text-slate-500 mt-1">Añade una nueva cuenta para gestionar por separado.</p>
        </div>
        
        <div className="p-6 space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Tipo de Perfil</label>
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setProfileType('Individual')} className={`p-3 rounded-lg border-2 text-sm font-semibold transition-colors ${isIndividual ? 'border-cuadrai-blue-600 bg-cuadrai-blue-50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>Individual</button>
                    <button type="button" onClick={() => setProfileType('Empresa')} className={`p-3 rounded-lg border-2 text-sm font-semibold transition-colors ${!isIndividual ? 'border-cuadrai-blue-600 bg-cuadrai-blue-50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>Empresa</button>
                </div>
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-600">{isIndividual ? 'Nombre y Apellidos' : 'Razón Social'}</label>
                <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} placeholder={isIndividual ? 'Ej: Ana García López' : 'Ej: Startup Creativa S.L.'} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-cuadrai-blue-500 focus:ring-1 focus:ring-cuadrai-blue-500" required />
            </div>
             <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-slate-600">{isIndividual ? 'DNI / NIE' : 'CIF'}</label>
                <input type="text" name="taxId" id="taxId" value={taxId} onChange={e => setTaxId(e.target.value)} placeholder={isIndividual ? '12345678A' : 'B12345678'} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-cuadrai-blue-500 focus:ring-1 focus:ring-cuadrai-blue-500" required />
            </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-b-2xl border-t border-slate-200 flex justify-end gap-3">
             <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 font-medium py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors">
                Cancelar
            </button>
             <button type="submit" disabled={!name.trim() || !taxId.trim()} className="bg-cuadrai-blue-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-cuadrai-blue-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                Crear Perfil
            </button>
        </div>
      </form>
    </div>
  );
};

export default NewProfileModal;