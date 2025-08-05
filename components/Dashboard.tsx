import React from 'react';
import { Invoice, Expense, FiscalStatusType, Obligation } from '../types';
import { ICONS } from '../constants';
import FinancialSummaryCard from './FinancialSummaryCard';

const statusConfig: {
    [key in FiscalStatusType]: {
        bgColor: string;
        textColor: string;
        icon: React.ReactNode;
        title: string;
    }
} = {
    ok: {
        bgColor: 'bg-green-500',
        textColor: 'text-green-50',
        icon: ICONS.checkCircle,
        title: 'Todo en orden'
    },
    warning: {
        bgColor: 'bg-amber-500',
        textColor: 'text-amber-50',
        icon: ICONS.warning,
        title: 'Requiere atención'
    },
    danger: {
        bgColor: 'bg-red-600',
        textColor: 'text-red-50',
        icon: ICONS.danger,
        title: 'Acción urgente'
    }
};

const FiscalStatusCard: React.FC<{status: FiscalStatusType, message: string}> = ({ status, message }) => {
    const config = statusConfig[status];
    return (
        <div className={`${config.bgColor} ${config.textColor} p-6 rounded-2xl shadow-lg flex items-start gap-4`}>
            <div className="pt-1">
                <span className="text-3xl opacity-80">{config.icon}</span>
            </div>
            <div>
                <h3 className="text-xl font-bold">{config.title}</h3>
                <p className="opacity-90 mt-1">{message}</p>
            </div>
        </div>
    );
};

interface DashboardProps {
  invoices: Invoice[];
  expenses: Expense[];
  obligations: Obligation[];
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ invoices, expenses, obligations, onNavigate }) => {
  
    // --- Semáforo Logic ---
    let fiscalStatus: FiscalStatusType = 'ok';
    let fiscalMessage = '¡Vas genial! Todos tus impuestos están al día y tus facturas cobradas.';
    
    const overdueInvoices = invoices.filter(inv => inv.status === 'Vencida');
    const pendingReceipts = expenses.filter(exp => !exp.hasReceipt);

    if (overdueInvoices.length > 0) {
        fiscalStatus = 'danger';
        fiscalMessage = `Tienes ${overdueInvoices.length} factura(s) vencida(s). ¡Reclama el pago para no afectar tu tesorería!`;
    } else if (pendingReceipts.length > 0) {
        fiscalStatus = 'warning';
        fiscalMessage = `Hay ${pendingReceipts.length} gasto(s) sin justificante. Sube la foto para poder deducirlos.`;
    }

    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    };

  return (
    <div className="p-4 sm:p-8 space-y-8">
      
      <FiscalStatusCard status={fiscalStatus} message={fiscalMessage} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-lg mb-4">Próximas Obligaciones</h3>
            <div className="space-y-3">
                {obligations.map((obligation) => (
                    <div key={obligation.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked={obligation.completed} className="h-5 w-5 rounded-full border-gray-300 text-cuadrai-blue-600 focus:ring-cuadrai-blue-500" />
                            <div>
                                <p className={`font-medium text-slate-700 ${obligation.completed ? 'line-through text-slate-400' : ''}`}>{obligation.title}</p>
                                <p className={`text-sm ${obligation.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Vence el {formatDueDate(obligation.dueDate)}
                                </p>
                            </div>
                        </div>
                        {obligation.type === 'tax' && 
                            <button onClick={() => onNavigate('Taxes')} className="text-sm font-semibold text-cuadrai-blue-600 hover:text-cuadrai-blue-800">Ver Impuestos</button>
                        }
                    </div>
                ))}
            </div>
        </div>
        
        <FinancialSummaryCard invoices={invoices} expenses={expenses} />

      </div>
    </div>
  );
};

export default Dashboard;