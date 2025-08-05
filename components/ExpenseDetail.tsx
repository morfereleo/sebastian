import React, { useState, useEffect, useRef } from 'react';
import { Expense } from '../types';
import { EXPENSE_CATEGORIES, ICONS } from '../constants';

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

interface ExpenseDetailProps {
  expense: Expense | null; // null indicates a new expense
  onBack: () => void;
  onSave: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
}

const emptyExpense: Omit<Expense, 'id'> = {
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    category: EXPENSE_CATEGORIES[0],
    amount: 0,
    iva: 0,
    hasReceipt: false,
    imageUrl: undefined,
};

const ExpenseDetail: React.FC<ExpenseDetailProps> = ({ expense, onBack, onSave, onDelete }) => {
    const [formData, setFormData] = useState<Omit<Expense, 'id'>>(expense || emptyExpense);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isNew = !expense;

    useEffect(() => {
        const initialData = expense || emptyExpense;
        // Clean up old blob urls if component is reused
        if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(formData.imageUrl);
        }
        setFormData(initialData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expense]);
    
    // Cleanup blob url on unmount
    useEffect(() => {
        return () => {
            if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(formData.imageUrl);
            }
        }
    }, [formData.imageUrl]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        const isNumber = type === 'number' || name === 'amount' || name === 'iva';

        setFormData(prev => ({
            ...prev,
            [name]: isNumber ? parseFloat(value) || 0 : value,
        }));
    };

     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newImageUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                imageUrl: newImageUrl,
                hasReceipt: true,
            }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const expenseToSave: Expense = {
            id: expense?.id || `G2024-${Date.now().toString().slice(-4)}`,
            ...formData,
            hasReceipt: !!formData.imageUrl,
        };
        onSave(expenseToSave);
    };

    const handleDeleteClick = () => {
        if (expense && window.confirm('¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer.')) {
            onDelete(expense.id);
        }
    };


    return (
        <div className="p-4 sm:p-8">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Volver a Gastos
            </button>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Image column */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Justificante</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 aspect-[4/5] flex items-center justify-center">
                        {formData.imageUrl ? (
                            <img src={formData.imageUrl} alt={`Gasto de ${formData.vendor}`} className="w-full h-full object-contain rounded-lg" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center h-full bg-slate-50 rounded-lg p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                <p className="text-slate-500 font-medium">Sin justificante</p>
                                <p className="text-xs text-slate-400 mt-1">Sube una imagen del ticket o factura para poder deducir este gasto.</p>
                            </div>
                        )}
                    </div>
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 mt-3 bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        {ICONS.upload}
                        <span>{formData.imageUrl ? 'Cambiar Justificante' : 'Subir Justificante'}</span>
                    </button>
                </div>

                {/* Details Form column */}
                <div className="lg:col-span-3">
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800 -mb-2">{isNew ? 'Detalles del Nuevo Gasto' : 'Editar Gasto'}</h3>
                             <div>
                                <label htmlFor="vendor" className="block text-sm font-medium text-slate-600">Proveedor</label>
                                <input type="text" name="vendor" id="vendor" value={formData.vendor} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-cuadrai-blue-500 focus:ring-1 focus:ring-cuadrai-blue-500" required />
                            </div>
                             <div>
                                <label htmlFor="date" className="block text-sm font-medium text-slate-600">Fecha</label>
                                <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-cuadrai-blue-500 focus:ring-1 focus:ring-cuadrai-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-600">Categoría</label>
                                <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-cuadrai-blue-500 focus:ring-1 focus:ring-cuadrai-blue-500">
                                    {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-slate-600">Base Imponible (€)</label>
                                    <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} step="0.01" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-cuadrai-blue-500 focus:ring-1 focus:ring-cuadrai-blue-500" required />
                                </div>
                                <div>
                                    <label htmlFor="iva" className="block text-sm font-medium text-slate-600">IVA (€)</label>
                                    <input type="number" name="iva" id="iva" value={formData.iva} onChange={handleChange} step="0.01" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-cuadrai-blue-500 focus:ring-1 focus:ring-cuadrai-blue-500" required />
                                </div>
                            </div>
                            <div className="border-t border-slate-200 !mt-6 !mb-0 pt-4 text-right">
                                <p className="text-slate-500">Total Gasto</p>
                                <p className="font-bold text-xl text-cuadrai-blue-800">{formatCurrency(formData.amount + formData.iva)}</p>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-slate-50 rounded-b-xl flex flex-col-reverse sm:flex-row justify-end gap-3">
                           {!isNew && (
                             <button type="button" onClick={handleDeleteClick} className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-red-600 bg-transparent rounded-md hover:bg-red-50">
                                Eliminar Gasto
                            </button>
                           )}
                           <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-cuadrai-green-500 rounded-lg hover:bg-green-600 shadow-sm">
                                {isNew ? 'Guardar Gasto' : 'Guardar Cambios'}
                            </button>
                        </div>
                     </div>
                </div>
            </form>
        </div>
    );
};

export default ExpenseDetail;