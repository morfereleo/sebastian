import React from 'react';
import { Expense } from '../types';
import { ICONS } from '../constants';

interface ExpensesProps {
  expenses: Expense[];
  onNewExpense: () => void;
  onViewExpense: (expense: Expense) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

const Expenses: React.FC<ExpensesProps> = ({ expenses, onNewExpense, onViewExpense }) => {

  return (
    <div className="p-4 sm:p-8">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-700">Control de Gastos</h2>
          <button 
            onClick={onNewExpense}
            className="flex items-center gap-2 bg-cuadrai-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-sm">
            {ICONS.plus}
            <span className="hidden sm:inline">Nuevo Gasto</span>
          </button>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Proveedor</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Categoría</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Importe</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Justificante</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{expense.vendor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{expense.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{expense.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{formatCurrency(expense.amount)}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {expense.hasReceipt || expense.imageUrl
                                 ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Adjunto</span>
                                 : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Pendiente</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onViewExpense(expense)} className="text-cuadrai-blue-600 hover:text-cuadrai-blue-900 font-semibold">Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
            {expenses.map((expense) => (
                 <div key={expense.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-slate-800">{expense.vendor}</p>
                            <p className="text-sm text-slate-600">{expense.category}</p>
                        </div>
                        <p className="font-semibold text-slate-800">{formatCurrency(expense.amount)}</p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <div className="text-sm">
                            <p className="text-slate-500">{expense.date}</p>
                             {expense.hasReceipt || expense.imageUrl
                                ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">Adjunto</span>
                                : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">Pendiente</span>}
                        </div>
                        <button onClick={() => onViewExpense(expense)} className="text-cuadrai-blue-600 hover:text-cuadrai-blue-900 font-semibold text-sm">Editar</button>
                    </div>
                </div>
            ))}
        </div>

    </div>
  );
};

export default Expenses;