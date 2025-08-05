import React from 'react';
import { Invoice } from '../types';
import { ICONS } from '../constants';
import StatusSelector from './StatusSelector';

interface InvoicesProps {
  invoices: Invoice[];
  onNewInvoice: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onStatusChange: (invoiceId: string, status: Invoice['status']) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

const Invoices: React.FC<InvoicesProps> = ({ invoices, onNewInvoice, onViewInvoice, onStatusChange }) => {
  return (
    <div className="p-4 sm:p-8">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-700">Gestión de Facturas</h2>
          <button 
            onClick={onNewInvoice}
            className="flex items-center gap-2 bg-cuadrai-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cuadrai-blue-800 transition-colors shadow-sm">
            {ICONS.plus}
            <span className="hidden sm:inline">Nueva Factura</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nº Factura</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cliente</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha Emisión</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cuadrai-blue-700">{invoice.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{invoice.clientName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{invoice.issueDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{formatCurrency(invoice.total)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <StatusSelector currentStatus={invoice.status} onChange={(newStatus) => onStatusChange(invoice.id, newStatus)} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => onViewInvoice(invoice)} className="text-cuadrai-blue-600 hover:text-cuadrai-blue-900 font-semibold">
                                    Ver Detalle
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
            {invoices.map((invoice) => (
                <div key={invoice.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-cuadrai-blue-700">{invoice.id}</p>
                            <p className="text-sm text-slate-600">{invoice.clientName}</p>
                        </div>
                        <StatusSelector currentStatus={invoice.status} onChange={(newStatus) => onStatusChange(invoice.id, newStatus)} />
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <div>
                            <p className="text-xs text-slate-500">Total</p>
                            <p className="font-semibold text-slate-800">{formatCurrency(invoice.total)}</p>
                        </div>
                        <button onClick={() => onViewInvoice(invoice)} className="text-cuadrai-blue-600 hover:text-cuadrai-blue-900 font-semibold text-sm">
                            Ver Detalle
                        </button>
                    </div>
                </div>
            ))}
        </div>

    </div>
  );
};

export default Invoices;