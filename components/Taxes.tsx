import React from 'react';
import { Invoice, Expense } from '../types';

interface TaxesProps {
  invoices: Invoice[];
  expenses: Expense[];
}

interface TaxCardProps {
    model: string;
    title: string;
    description: string;
    amount: number;
    details: {label: string, value: number, colorClass?: string}[];
}

const TaxCard: React.FC<TaxCardProps> = ({ model, title, description, amount, details }) => {
    const formatCurrency = (val: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-cuadrai-blue-700">{model}</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-1">{title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{description}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">Total a pagar (est.)</p>
                    <p className={`text-2xl sm:text-3xl font-bold ${amount >= 0 ? 'text-orange-500' : 'text-green-500'}`}>{formatCurrency(amount)}</p>
                </div>
            </div>
            <div className="mt-6 border-t border-slate-200 pt-4">
                <h4 className="font-semibold text-slate-600 mb-3">Cómo se calcula</h4>
                <div className="space-y-2">
                    {details.map((detail, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <p className="text-slate-500">{detail.label}</p>
                            <p className={`font-medium ${detail.colorClass || 'text-slate-700'}`}>{formatCurrency(detail.value)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


const Taxes: React.FC<TaxesProps> = ({ invoices, expenses }) => {
  const ivaRepercutido = invoices.reduce((sum, inv) => sum + (inv.subtotal * inv.iva / 100), 0);
  const ivaSoportado = expenses.reduce((sum, exp) => sum + exp.iva, 0);
  const ivaAPagar = ivaRepercutido - ivaSoportado;

  const ingresosComputables = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);
  const gastosDeducibles = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const rendimientoNeto = ingresosComputables - gastosDeducibles;
  const pagoFraccionadoIRPF = rendimientoNeto * 0.20; // Simplified 20%
  const retencionesSoportadas = invoices.reduce((sum, inv) => sum + (inv.subtotal * inv.irpf / 100), 0);


  return (
    <div className="p-4 sm:p-8">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-700">Tu Previsión de Impuestos</h2>
            <p className="text-slate-500 mt-1">Estimación de lo que pagarás a Hacienda este trimestre. Así, sin sorpresas.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TaxCard 
                model="Modelo 303"
                title="Tu declaración de IVA"
                description="La diferencia entre el IVA que cobras y el que pagas."
                amount={ivaAPagar}
                details={[
                    {label: 'IVA que has cobrado en tus facturas', value: ivaRepercutido, colorClass: 'text-green-600'},
                    {label: 'IVA que has pagado en tus gastos', value: -ivaSoportado, colorClass: 'text-red-600'},
                ]}
            />
            <TaxCard 
                model="Modelo 130"
                title="Tu pago a cuenta de IRPF"
                description="Un adelanto de tu impuesto sobre la renta."
                amount={pagoFraccionadoIRPF > 0 ? pagoFraccionadoIRPF : 0}
                details={[
                    {label: 'Lo que has ganado (sin impuestos)', value: ingresosComputables, colorClass: 'text-slate-700'},
                    {label: 'Tus gastos deducibles', value: -gastosDeducibles, colorClass: 'text-slate-700'},
                    {label: 'Beneficio (Base del cálculo)', value: rendimientoNeto, colorClass: 'text-slate-700 font-bold'},
                    {label: 'Retenciones que ya te aplicaron', value: -retencionesSoportadas, colorClass: 'text-slate-700'},
                ]}
            />
        </div>
         <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <h3 className="font-semibold text-slate-800">¿Tienes un gestor?</h3>
            <p className="text-slate-500 mt-2 mb-4 max-w-2xl mx-auto">Con un clic, genera un resumen de tus libros de registro en un formato perfecto para compartir con tu asesoría. Ahorra tiempo y evita errores.</p>
            <button className="bg-cuadrai-blue-100 text-cuadrai-blue-800 font-bold py-2 px-5 rounded-lg hover:bg-cuadrai-blue-200 transition-colors">
                Generar Exportación para Gestoría
            </button>
        </div>
    </div>
  );
};

export default Taxes;