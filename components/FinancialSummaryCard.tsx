import React from 'react';
import { Invoice, Expense } from '../types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

interface FinancialSummaryCardProps {
    invoices: Invoice[];
    expenses: Expense[];
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ invoices, expenses }) => {
    const totalIncome = invoices.reduce((acc, inv) => acc + inv.subtotal, 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const total = totalIncome + totalExpenses;
    const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 0;

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="font-semibold text-slate-800 text-lg mb-4">Resumen Financiero</h3>
            <div className="space-y-4 flex-grow flex flex-col">
                <div className="w-full bg-red-100 rounded-full h-2.5">
                    <div className="bg-green-400 h-2.5 rounded-full" style={{ width: `${incomePercentage}%` }}></div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1 text-sm">
                        <p className="flex items-center gap-2 font-medium text-slate-600"><span className="h-2 w-2 rounded-full bg-green-400"></span>Ingresos</p>
                        <p className="font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <p className="flex items-center gap-2 font-medium text-slate-600"><span className="h-2 w-2 rounded-full bg-red-400"></span>Gastos</p>
                        <p className="font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                    </div>
                </div>
                <div className="border-t border-slate-200 !mt-auto pt-3">
                     <div className="flex justify-between items-center font-bold">
                        <p className="text-slate-800">Resultado Neto</p>
                        <p className={`text-lg ${netProfit >= 0 ? 'text-cuadrai-blue-800' : 'text-red-700'}`}>{formatCurrency(netProfit)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialSummaryCard;
