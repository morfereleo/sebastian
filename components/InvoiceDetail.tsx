import React from 'react';
import { Invoice } from '../types';
import StatusSelector from './StatusSelector';

const formatCurrency = (amount: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
  onStatusChange: (invoiceId: string, status: Invoice['status']) => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoice, onBack, onStatusChange }) => {
    const ivaAmount = (invoice.subtotal * invoice.iva) / 100;
    const irpfAmount = (invoice.subtotal * invoice.irpf) / 100;

    return (
        <div className="p-4 sm:p-8">
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                Volver a Facturas
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Image column */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Justificante Adjunto</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 aspect-[4/5] flex items-center justify-center">
                        {invoice.imageUrl ? (
                            <img src={invoice.imageUrl} alt={`Factura ${invoice.id}`} className="w-full h-full object-contain rounded-lg" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center h-full bg-slate-50 rounded-lg p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mb-2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                <p className="text-slate-500 font-medium">No hay imagen adjunta</p>
                                <p className="text-xs text-slate-400 mt-1">Este registro se creó manualmente o no se adjuntó un justificante.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details column */}
                <div className="lg:col-span-3">
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="mb-4 sm:mb-0">
                                    <p className="font-bold text-slate-800 text-2xl">Factura #{invoice.id}</p>
                                    <p className="text-slate-500 mt-1">Para: <span className="font-medium text-slate-700">{invoice.clientName}</span></p>
                                </div>
                                <StatusSelector currentStatus={invoice.status} onChange={(newStatus) => onStatusChange(invoice.id, newStatus)} />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm mt-4">
                                <div><p className="text-slate-500">Fecha de emisión</p><p className="font-semibold text-slate-700">{invoice.issueDate}</p></div>
                                <div><p className="text-slate-500">Fecha de vencimiento</p><p className="font-semibold text-slate-700">{invoice.dueDate}</p></div>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <h4 className="text-base font-semibold text-slate-600 mb-3">Conceptos</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="text-left font-medium text-slate-500 pb-2">Descripción</th>
                                            <th className="text-right font-medium text-slate-500 pb-2">Cant.</th>
                                            <th className="text-right font-medium text-slate-500 pb-2">Precio</th>
                                            <th className="text-right font-medium text-slate-500 pb-2">Importe</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map((item, index) => (
                                            <tr key={index} className="border-b border-slate-100 last:border-0">
                                                <td className="py-3 pr-2 text-slate-800">{item.description}</td>
                                                <td className="text-right py-3 px-2 text-slate-600">{item.quantity}</td>
                                                <td className="text-right py-3 px-2 text-slate-600">{formatCurrency(item.price)}</td>
                                                <td className="text-right py-3 pl-2 font-medium text-slate-800">{formatCurrency(item.price * item.quantity)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end">
                            <div className="w-full max-w-xs space-y-2 text-sm">
                                <div className="flex justify-between"><p className="text-slate-500">Subtotal</p><p className="font-medium text-slate-700">{formatCurrency(invoice.subtotal)}</p></div>
                                <div className="flex justify-between"><p className="text-slate-500">IVA ({invoice.iva}%)</p><p className="font-medium text-slate-700">{formatCurrency(ivaAmount)}</p></div>
                                { irpfAmount > 0 && <div className="flex justify-between"><p className="text-slate-500">IRPF ({invoice.irpf}%)</p><p className="font-medium text-red-600">{formatCurrency(-irpfAmount)}</p></div> }
                                <div className="border-t border-slate-300 my-2"></div>
                                <div className="flex justify-between font-bold text-base text-slate-800"><p>Total</p><p>{formatCurrency(invoice.total)}</p></div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetail;