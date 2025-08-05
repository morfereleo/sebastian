export interface LineItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  status: 'Pagada' | 'Pendiente' | 'Vencida';
  items: LineItem[];
  subtotal: number;
  iva: number; // as a percentage
  irpf: number; // as a percentage
  total: number;
  imageUrl?: string;
}

export interface Expense {
  id: string;
  vendor: string;
  date: string;
  category: string;
  amount: number;
  iva: number;
  hasReceipt: boolean;
  imageUrl?: string;
}

export enum View {
  Dashboard,
  MagicCapture,
  Invoices,
  Expenses,
  Taxes,
  Settings
}

// Type for data extracted by Gemini
export interface ExtractedData {
  documentType: 'invoice' | 'expense';
  vendorOrClient: string;
  date: string;
  totalAmount: number;
  subtotal: number;
  ivaAmount: number;
  irpfAmount: number;
  invoiceId: string | null;
  lineItems: LineItem[];
  category: string | null;
}

// --- New Types from Business Analysis ---

export type FiscalStatusType = 'ok' | 'warning' | 'danger';

export interface Obligation {
  id: string;
  title: string;
  dueDate: string;
  type: 'tax' | 'reminder';
  completed: boolean;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

export interface QuickAction {
    label: string;
    prompt: string;
    actionType: 'local' | 'remote';
    icon: React.ReactNode;
}


// --- New Types for Settings ---

export interface Address {
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface BillingConfig {
    logoUrl: string;
    invoiceSeries: string;
    defaultIva: number; // percentage
    defaultIrpf: number; // percentage
    bankIban: string;
}

export interface TaxConfig {
    ivaRegime: 'General' | 'Recargo de Equivalencia' | 'Otro';
}


// --- Multi-Account Types ---

export type ProfileType = 'Individual' | 'Empresa';

export interface Profile {
    id: string;
    type: ProfileType;
    name: string;
    taxId: string; // DNI/NIE for Individual, CIF for Empresa
    avatarUrl: string;
    invoices: Invoice[];
    expenses: Expense[];
    obligations: Obligation[];
    chatHistory: ChatMessage[];
    // New detailed config
    address: Address;
    billing: BillingConfig;
    tax: TaxConfig;
}