import React, { useState, useEffect, useRef } from 'react';
import { Profile } from '../types';

interface SettingsProps {
    profile: Profile;
    onUpdateProfile: (profile: Profile) => void;
}

type ActiveTab = 'profile' | 'billing' | 'tax';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void }> = ({ label, isActive, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            isActive ? 'bg-cuadrai-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
        }`}
    >
        {label}
    </button>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-600">{label}</label>
        <input
            {...props}
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-cuadrai-blue-500 focus:ring-1 focus:ring-cuadrai-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
        />
    </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, children: React.ReactNode }> = ({ label, children, ...props }) => (
     <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-600">{label}</label>
        <select {...props} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-cuadrai-blue-500 focus:ring-1 focus:ring-cuadrai-blue-500">
            {children}
        </select>
    </div>
);


const Settings: React.FC<SettingsProps> = ({ profile, onUpdateProfile }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [formData, setFormData] = useState<Profile>(profile);
    const [isDirty, setIsDirty] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    useEffect(() => {
        setIsDirty(JSON.stringify(profile) !== JSON.stringify(formData));
    }, [formData, profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (category: 'address' | 'billing' | 'tax', e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [name]: finalValue,
            }
        }));
    };
    
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                 setFormData(prev => ({
                    ...prev,
                    billing: {
                        ...prev.billing,
                        logoUrl: reader.result as string,
                    }
                }));
            }
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile(formData);
        setIsDirty(false);
    };

    const isIndividual = formData.type === 'Individual';

    return (
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-700">Configuración del Perfil</h2>
                    <p className="text-slate-500 mt-1">Ajusta los detalles de <span className="font-semibold text-slate-600">{profile.name}</span>.</p>
                </div>
                <button type="submit" disabled={!isDirty} className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-cuadrai-blue-700 rounded-lg hover:bg-cuadrai-blue-800 shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none">
                    Guardar Cambios
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <TabButton label="Perfil" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                        <TabButton label="Facturación" isActive={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
                        <TabButton label="Impuestos" isActive={activeTab === 'tax'} onClick={() => setActiveTab('tax')} />
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-4 max-w-2xl">
                            <h3 className="text-lg font-semibold text-slate-800">Información del Perfil</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label={isIndividual ? "Nombre y Apellidos" : "Razón Social"} name="name" value={formData.name} onChange={handleChange} />
                                <InputField label={isIndividual ? "DNI / NIE" : "CIF"} name="taxId" value={formData.taxId} onChange={handleChange} />
                            </div>
                             <h4 className="text-md font-semibold text-slate-700 pt-4">Dirección Fiscal</h4>
                             <InputField label="Dirección" name="street" value={formData.address.street} onChange={(e) => handleNestedChange('address', e)} />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Ciudad" name="city" value={formData.address.city} onChange={(e) => handleNestedChange('address', e)} />
                                <InputField label="Código Postal" name="postalCode" value={formData.address.postalCode} onChange={(e) => handleNestedChange('address', e)} />
                                <InputField label="País" name="country" value={formData.address.country} onChange={(e) => handleNestedChange('address', e)} />
                            </div>
                        </div>
                    )}
                     {activeTab === 'billing' && (
                        <div className="space-y-4 max-w-2xl">
                             <h3 className="text-lg font-semibold text-slate-800">Datos de Facturación</h3>
                             <div>
                                <label className="block text-sm font-medium text-slate-600">Logo</label>
                                <div className="mt-1 flex items-center gap-4">
                                    <div className="h-16 w-16 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200">
                                        {formData.billing.logoUrl ? <img src={formData.billing.logoUrl} alt="Logo" className="h-full w-full object-contain" /> : <span className="text-slate-400 text-xs">Sin logo</span>}
                                    </div>
                                    <input type="file" accept="image/png, image/jpeg" ref={logoInputRef} onChange={handleLogoChange} className="hidden"/>
                                    <button type="button" onClick={() => logoInputRef.current?.click()} className="px-3 py-1.5 text-sm font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-50">Subir Logo</button>
                                </div>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="Serie de Facturación" name="invoiceSeries" value={formData.billing.invoiceSeries} onChange={(e) => handleNestedChange('billing', e)} />
                                <InputField label="IVA por defecto (%)" name="defaultIva" type="number" value={formData.billing.defaultIva} onChange={(e) => handleNestedChange('billing', e)} />
                                <InputField label="IRPF por defecto (%)" name="defaultIrpf" type="number" value={formData.billing.defaultIrpf} onChange={(e) => handleNestedChange('billing', e)} />
                             </div>
                             <InputField label="IBAN para tus facturas" name="bankIban" value={formData.billing.bankIban} onChange={(e) => handleNestedChange('billing', e)} placeholder="ES00 0000 0000 0000 0000 0000" />
                        </div>
                    )}
                     {activeTab === 'tax' && (
                        <div className="space-y-4 max-w-2xl">
                             <h3 className="text-lg font-semibold text-slate-800">Configuración de Impuestos</h3>
                            <SelectField label="Régimen de IVA" name="ivaRegime" value={formData.tax.ivaRegime} onChange={(e) => handleNestedChange('tax', e)}>
                                <option value="General">General</option>
                                <option value="Recargo de Equivalencia">Recargo de Equivalencia</option>
                                <option value="Otro">Otro</option>
                            </SelectField>
                            <p className="text-sm text-slate-500 !mt-2">Seleccionar tu régimen de IVA es fundamental para que CUADRAI calcule tus impuestos correctamente.</p>
                        </div>
                    )}
                </div>
            </div>

             <div className="border border-red-200 bg-red-50 rounded-xl p-6 max-w-2xl">
                <h3 className="font-bold text-red-800">Área de Peligro</h3>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-3">
                    <p className="text-sm text-red-700">Eliminar este perfil borrará de forma permanente todas sus facturas, gastos y datos asociados. <br className="hidden sm:block"/>Esta acción no se puede deshacer.</p>
                    <button type="button" onClick={() => alert('Función de borrado no implementada.')} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 w-full sm:w-auto flex-shrink-0">
                        Eliminar Perfil
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Settings;