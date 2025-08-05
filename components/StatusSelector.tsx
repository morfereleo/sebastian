import React from 'react';
import { Invoice } from '../types';
import { INVOICE_STATUSES } from '../constants';

interface StatusSelectorProps {
  currentStatus: Invoice['status'];
  onChange: (newStatus: Invoice['status']) => void;
}

const statusStyles: { [key in Invoice['status']]: string } = {
  Pagada: 'bg-green-100 text-green-800 ring-green-600/20',
  Pendiente: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
  Vencida: 'bg-red-100 text-red-800 ring-red-600/20',
};

const StatusSelector: React.FC<StatusSelectorProps> = ({ currentStatus, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as Invoice['status']);
  };

  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={handleChange}
        className={`appearance-none cursor-pointer w-full text-xs font-medium pl-2.5 pr-8 py-0.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${statusStyles[currentStatus]}`}
      >
        {INVOICE_STATUSES.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-inherit">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
        </svg>
      </div>
    </div>
  );
};

export default StatusSelector;