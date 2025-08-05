import React from 'react';
import { View } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 my-1 text-base rounded-lg transition-colors duration-200 ${
        isActive 
          ? 'bg-cuadrai-blue-700 text-white shadow-sm' 
          : 'text-slate-100 hover:bg-cuadrai-blue-800'
      }`}
    >
      <span className="opacity-80">{icon}</span>
      <span className="ml-4 font-medium">{label}</span>
    </button>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const navItems = [
    { view: View.Dashboard, icon: ICONS.dashboard, label: 'Resumen' },
    { view: View.MagicCapture, icon: ICONS.magic, label: 'Captura Mágica' },
    { view: View.Invoices, icon: ICONS.invoices, label: 'Facturas' },
    { view: View.Expenses, icon: ICONS.expenses, label: 'Gastos' },
    { view: View.Taxes, icon: ICONS.taxes, label: 'Impuestos' },
  ];

  const handleNavItemClick = (view: View) => {
    onViewChange(view);
    onClose(); // Close sidebar on mobile after navigation
  };

  return (
    <>
        {/* Overlay for mobile */}
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={onClose}
        ></div>

        <aside className={`w-64 fixed lg:relative inset-y-0 left-0 bg-cuadrai-blue-900 text-white flex flex-col p-4 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="flex items-center justify-between gap-3 mb-8 px-2">
                <div className="flex items-center gap-3">
                    {ICONS.logo}
                    <h1 className="text-2xl font-bold tracking-tight">CUADRAI</h1>
                </div>
            </div>
            <nav className="flex-grow">
                <ul>
                {navItems.map((item) => (
                    <NavItem
                    key={item.view}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentView === item.view}
                    onClick={() => handleNavItemClick(item.view)}
                    />
                ))}
                </ul>
            </nav>
            <div className="mt-auto">
                <NavItem
                    icon={ICONS.settings}
                    label="Configuración"
                    isActive={currentView === View.Settings}
                    onClick={() => handleNavItemClick(View.Settings)}
                />
            </div>
        </aside>
    </>
  );
};

export default Sidebar;