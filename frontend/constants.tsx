import { Profile } from './types';

export const ICONS = {
    dashboard: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20V16"/></svg>
    ),
    magic: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2.5a1.5 1.5 0 0 1 3 0L14 6l3.5 1.5a1.5 1.5 0 0 1 0 3L14 12l-1.5 3.5a1.5 1.5 0 0 1-3 0L8 12l-3.5-1.5a1.5 1.5 0 0 1 0-3L8 6l1.5-3.5Z"/><path d="M18 9.5a1.5 1.5 0 0 1 3 0L22.5 14l1.5 3.5a1.5 1.5 0 0 1-3 0L19.5 14l-1.5-3.5Z"/></svg>
    ),
    invoices: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
    ),
    expenses: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
    ),
    taxes: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    ),
    settings: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.12l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2.12l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
    ),
    edit: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    ),
    upload: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
    ),
    camera: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
    ),
    logo: (
       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="url(#logo-gradient)"/>
        <path d="M11 7h2v2h-2zm0 4h2v6h-2z" fill="url(#logo-gradient)"/>
        <defs>
            <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2580e5"/>
                <stop offset="1" stopColor="#10b981"/>
            </linearGradient>
        </defs>
    </svg>
    ),
    plus: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    ),
    sparkles: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9z"/></svg>
    ),
    menu: (
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    ),
    checkCircle: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    ),
    warning: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
    ),
    danger: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    ),
    send: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    ),
    userPlus: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="22" y1="8" x2="22" y2="14"/><line x1="19" y1="11" x2="25" y2="11"/></svg>
    )
};

export const MOCK_PROFILES: Profile[] = [
    {
        id: 'p1_individual',
        type: 'Individual',
        name: 'Ana García',
        taxId: '12345678A',
        avatarUrl: 'https://picsum.photos/seed/user-avatar/100/100',
        invoices: [
            { id: 'F2024-003', clientName: 'Startup Creativa S.L.', issueDate: '2024-07-15', dueDate: '2024-08-14', status: 'Pendiente', items: [{ description: 'Consultoría de Diseño UX', quantity: 20, price: 50 }], subtotal: 1000, iva: 21, irpf: 15, total: 1060 },
            { id: 'F2024-002', clientName: 'Tecno Soluciones', issueDate: '2024-06-20', dueDate: '2024-07-20', status: 'Pagada', items: [{ description: 'Desarrollo Landing Page', quantity: 1, price: 1200 }], subtotal: 1200, iva: 21, irpf: 15, total: 1272 },
            { id: 'F2024-001', clientName: 'Marketing Digital Avanzado', issueDate: '2024-05-10', dueDate: '2024-06-09', status: 'Vencida', items: [{ description: 'Campaña SEO', quantity: 1, price: 800 }], subtotal: 800, iva: 21, irpf: 15, total: 848 },
        ],
        expenses: [
            { id: 'G2024-005', vendor: 'Software World', date: '2024-07-10', category: 'Software', amount: 49.99, iva: 10.49, hasReceipt: true, imageUrl: 'https://picsum.photos/seed/receipt1/400/500' },
            { id: 'G2024-004', vendor: 'Espacio Co-working', date: '2024-07-01', category: 'Alquiler', amount: 250.00, iva: 52.50, hasReceipt: true },
        ],
        obligations: [
            { id: '1', title: 'Presentación Modelo 303 (IVA)', dueDate: '2024-10-20', type: 'tax', completed: false },
            { id: '2', title: 'Presentación Modelo 130 (IRPF)', dueDate: '2024-10-20', type: 'tax', completed: false },
        ],
        chatHistory: [
            { id: 'chat1', sender: 'ai', text: '¡Hola Ana! Soy tu copiloto fiscal. ¿En qué te puedo ayudar hoy con tu actividad como autónoma?' }
        ],
        address: {
            street: 'Calle Falsa, 123',
            city: 'Madrid',
            postalCode: '28001',
            country: 'España'
        },
        billing: {
            logoUrl: '',
            invoiceSeries: 'F2024-',
            defaultIva: 21,
            defaultIrpf: 15,
            bankIban: 'ES91 2100 0418 4502 0005 1332'
        },
        tax: {
            ivaRegime: 'General'
        }
    },
    {
        id: 'p2_empresa',
        type: 'Empresa',
        name: 'Startup Creativa S.L.',
        taxId: 'B98765432',
        avatarUrl: 'https://picsum.photos/seed/company-avatar/100/100',
        invoices: [
            { id: 'SC-F2024-010', clientName: 'Global Corp', issueDate: '2024-07-20', dueDate: '2024-08-19', status: 'Pendiente', items: [{ description: 'Servicios de Branding', quantity: 1, price: 5000 }], subtotal: 5000, iva: 21, irpf: 0, total: 6050 },
        ],
        expenses: [
            { id: 'SC-G2024-015', vendor: 'Cloud Services Inc.', date: '2024-07-01', category: 'Software', amount: 300, iva: 63, hasReceipt: true, imageUrl: 'https://picsum.photos/seed/receipt3/400/500' },
            { id: 'SC-G2024-016', vendor: 'Nóminas Julio', date: '2024-07-31', category: 'Salarios', amount: 4500, iva: 0, hasReceipt: true },
        ],
        obligations: [
            { id: '1', title: 'Presentación Modelo 303 (IVA)', dueDate: '2024-10-20', type: 'tax', completed: false },
            { id: '2', title: 'Presentación Modelo 200 (Imp. Sociedades)', dueDate: '2025-07-25', type: 'tax', completed: false },
            { id: '3', title: 'Pago Seguros Sociales', dueDate: '2024-08-31', type: 'reminder', completed: false },
        ],
        chatHistory: [
            { id: 'chat2', sender: 'ai', text: 'Hola, equipo de Startup Creativa. Como vuestro copiloto fiscal, estoy listo para ayudaros a gestionar la fiscalidad de la empresa. ¿Qué necesitáis?' }
        ],
        address: {
            street: 'Avenida de la Innovación, 456',
            city: 'Barcelona',
            postalCode: '08001',
            country: 'España'
        },
        billing: {
            logoUrl: '',
            invoiceSeries: 'SC-F2024-',
            defaultIva: 21,
            defaultIrpf: 0,
            bankIban: 'ES80 2100 0000 0000 0000 0000'
        },
        tax: {
            ivaRegime: 'General'
        }
    }
];


export const INVOICE_STATUSES: ['Pagada', 'Pendiente', 'Vencida'] = ['Pagada', 'Pendiente', 'Vencida'];
export const EXPENSE_CATEGORIES = ['Software', 'Alquiler', 'Marketing', 'Suministros', 'Transporte', 'Dietas', 'Servicios Profesionales', 'Salarios', 'Otros'];