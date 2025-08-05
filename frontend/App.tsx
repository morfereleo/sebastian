import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import Expenses from './components/Expenses';
import Taxes from './components/Taxes';
import GeminiModal from './components/GeminiModal';
import MagicCapture from './components/MagicCapture';
import InvoiceDetail from './components/InvoiceDetail';
import ExpenseDetail from './components/ExpenseDetail';
import NewExpenseModal from './components/NewExpenseModal';
import AIAssistantButton from './components/AIAssistantButton';
import ProfileSwitcher from './components/ProfileSwitcher';
import NewProfileModal from './components/NewProfileModal';
import Settings from './components/Settings';
import { View, Invoice as InvoiceType, Expense as ExpenseType, ExtractedData, Profile, ChatMessage, ProfileType } from './types';
import { MOCK_PROFILES } from './constants';

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>(MOCK_PROFILES[0].id);

  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  
  const [isGeminiModalOpen, setGeminiModalOpen] = useState(false);
  const [isNewExpenseModalOpen, setNewExpenseModalOpen] = useState(false);
  const [isNewProfileModalOpen, setNewProfileModalOpen] = useState(false);
  
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceType | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseType | 'new' | null>(null);
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const activeProfile = useMemo(() => profiles.find(p => p.id === activeProfileId), [profiles, activeProfileId]);

  const updateActiveProfile = useCallback((updateFn: (profile: Profile) => Profile) => {
    setProfiles(prevProfiles =>
      prevProfiles.map(p =>
        p.id === activeProfileId ? updateFn(p) : p
      )
    );
  }, [activeProfileId]);


  const resetSelections = () => {
    setSelectedInvoice(null);
    setSelectedExpense(null);
  }

  const handleViewChange = useCallback((view: View) => {
    resetSelections();
    setCurrentView(view);
  }, []);
  
  const handleToggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  // --- Modal Handlers ---
  const openGeminiModal = useCallback(() => setGeminiModalOpen(true), []);
  const closeGeminiModal = useCallback(() => setGeminiModalOpen(false), []);
  const openNewExpenseModal = useCallback(() => setNewExpenseModalOpen(true), []);
  const closeNewExpenseModal = useCallback(() => setNewExpenseModalOpen(false), []);
  const openNewProfileModal = useCallback(() => setNewProfileModalOpen(true), []);
  const closeNewProfileModal = useCallback(() => setNewProfileModalOpen(false), []);

  // --- Profile Handlers ---
  const handleProfileChange = useCallback((profileId: string) => {
    if (profileId !== activeProfileId) {
        resetSelections();
        setCurrentView(View.Dashboard);
        setActiveProfileId(profileId);
    }
  }, [activeProfileId]);

  const handleAddProfile = useCallback((name: string, taxId: string, type: ProfileType) => {
    const newProfile: Profile = {
        id: `p${Date.now()}`,
        name,
        taxId,
        type,
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
        invoices: [],
        expenses: [],
        obligations: [],
        chatHistory: [{ id: 'init', sender: 'ai', text: `¡Hola! Soy tu copiloto fiscal. He creado tu nuevo perfil de ${type}. ¿En qué puedo ayudarte?`}],
        address: { street: '', city: '', postalCode: '', country: 'España' },
        billing: { logoUrl: '', invoiceSeries: 'F-', defaultIva: 21, defaultIrpf: type === 'Individual' ? 15 : 0, bankIban: '' },
        tax: { ivaRegime: 'General' }
    };
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
    closeNewProfileModal();
    setCurrentView(View.Settings);
  }, []);

  const handleProfileUpdate = useCallback((updatedProfile: Profile) => {
    setProfiles(prevProfiles => 
        prevProfiles.map(p => p.id === updatedProfile.id ? updatedProfile : p)
    );
  }, []);


  const handleChatHistoryChange = useCallback((newHistory: ChatMessage[]) => {
      updateActiveProfile(profile => ({...profile, chatHistory: newHistory }));
  }, [updateActiveProfile]);


  // --- Invoice Handlers ---
  const handleInvoiceStatusChange = useCallback((invoiceId: string, newStatus: InvoiceType['status']) => {
      updateActiveProfile(profile => ({
          ...profile,
          invoices: profile.invoices.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv)
      }));
      if (selectedInvoice && selectedInvoice.id === invoiceId) {
          setSelectedInvoice(prev => prev ? { ...prev, status: newStatus } : null);
      }
  }, [selectedInvoice, updateActiveProfile]);

  const handleViewInvoice = useCallback((invoice: InvoiceType) => {
    setSelectedInvoice(invoice);
  }, []);

  const handleBackToList = useCallback(() => {
    resetSelections();
  }, []);

  // --- Expense Handlers ---
   const handleViewExpense = useCallback((expense: ExpenseType) => {
    setSelectedExpense(expense);
  }, []);

  const handleNewManualExpense = useCallback(() => {
    closeNewExpenseModal();
    setSelectedExpense('new');
  }, []);
  
  const handleSaveExpense = useCallback((expenseToSave: ExpenseType) => {
    updateActiveProfile(profile => {
        const existing = profile.expenses.find(e => e.id === expenseToSave.id);
        const newExpenses = existing 
            ? profile.expenses.map(e => e.id === expenseToSave.id ? expenseToSave : e)
            : [expenseToSave, ...profile.expenses];
        return { ...profile, expenses: newExpenses };
    });
    resetSelections();
    setCurrentView(View.Expenses);
  }, [updateActiveProfile]);

  const handleDeleteExpense = useCallback((expenseId: string) => {
    updateActiveProfile(profile => ({
        ...profile,
        expenses: profile.expenses.filter(e => e.id !== expenseId)
    }));
    resetSelections();
  }, [updateActiveProfile]);


  // --- Data Saving Handler ---
  const handleSaveExtractedData = useCallback((data: ExtractedData, imageUrl: string | null) => {
    if (data.documentType === 'invoice') {
      const newInvoice: InvoiceType = {
        id: data.invoiceId || `F2024-${Date.now().toString().slice(-4)}`,
        clientName: data.vendorOrClient,
        issueDate: data.date,
        dueDate: new Date(new Date(data.date).setDate(new Date(data.date).getDate() + 30)).toISOString().split('T')[0],
        status: 'Pendiente',
        items: data.lineItems.length > 0 ? data.lineItems : [{ description: 'Servicio General', price: data.subtotal, quantity: 1 }],
        subtotal: data.subtotal,
        iva: data.subtotal > 0 ? parseFloat(((data.ivaAmount / data.subtotal) * 100).toFixed(2)) : 21,
        irpf: data.subtotal > 0 ? parseFloat(((data.irpfAmount / data.subtotal) * 100).toFixed(2)) : 0,
        total: data.totalAmount,
        imageUrl: imageUrl || undefined,
      };
      updateActiveProfile(p => ({ ...p, invoices: [newInvoice, ...p.invoices]}));
      setCurrentView(View.Invoices);
    } else { // 'expense'
      const newExpense: ExpenseType = {
        id: `G2024-${Date.now().toString().slice(-4)}`,
        vendor: data.vendorOrClient,
        date: data.date,
        category: data.category || 'General',
        amount: data.subtotal,
        iva: data.ivaAmount,
        hasReceipt: true,
        imageUrl: imageUrl || undefined,
      };
      updateActiveProfile(p => ({ ...p, expenses: [newExpense, ...p.expenses]}));
      setCurrentView(View.Expenses);
    }
    resetSelections();
  }, [updateActiveProfile]);


  const renderView = () => {
    if (!activeProfile) {
        return <div className="p-8">Error: No se ha encontrado el perfil activo.</div>;
    }

    if (selectedInvoice) {
        return <InvoiceDetail invoice={selectedInvoice} onBack={handleBackToList} onStatusChange={handleInvoiceStatusChange}/>
    }
    if (selectedExpense) {
        return <ExpenseDetail 
                    expense={selectedExpense === 'new' ? null : selectedExpense} 
                    onSave={handleSaveExpense} 
                    onDelete={handleDeleteExpense}
                    onBack={handleBackToList} />
    }

    switch (currentView) {
      case View.Dashboard:
        return <Dashboard invoices={activeProfile.invoices} expenses={activeProfile.expenses} obligations={activeProfile.obligations} onNavigate={handleViewChange} />;
      case View.MagicCapture:
        return <MagicCapture onSave={handleSaveExtractedData} />;
      case View.Invoices:
        return <Invoices invoices={activeProfile.invoices} onNewInvoice={() => handleViewChange(View.MagicCapture)} onViewInvoice={handleViewInvoice} onStatusChange={handleInvoiceStatusChange} />;
      case View.Expenses:
        return <Expenses expenses={activeProfile.expenses} onNewExpense={openNewExpenseModal} onViewExpense={handleViewExpense} />;
      case View.Taxes:
        return <Taxes invoices={activeProfile.invoices} expenses={activeProfile.expenses} />;
      case View.Settings:
          return <Settings profile={activeProfile} onUpdateProfile={handleProfileUpdate} />;
      default:
        return <Dashboard invoices={activeProfile.invoices} expenses={activeProfile.expenses} obligations={activeProfile.obligations} onNavigate={handleViewChange} />;
    }
  };

  const getHeaderTitle = () => {
    if (selectedInvoice) return `Detalle Factura #${selectedInvoice.id}`;
    if (selectedExpense) return selectedExpense === 'new' ? 'Nuevo Gasto Manual' : `Detalle Gasto #${selectedExpense.id}`;
    
    switch (currentView) {
      case View.Dashboard: return 'Inicio';
      case View.MagicCapture: return 'Captura Mágica';
      case View.Invoices: return 'Facturación';
      case View.Expenses: return 'Gastos';
      case View.Taxes: return 'Impuestos';
      case View.Settings: return 'Configuración';
      default: return 'CUADRAI';
    }
  };

  const profileContextForAI = activeProfile 
    ? `Contexto del perfil: ${activeProfile.type} llamado '${activeProfile.name}' con identificador fiscal ${activeProfile.taxId}.` 
    : "Sin contexto de perfil.";


  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header 
            title={getHeaderTitle()} 
            onMenuClick={handleToggleSidebar}
            profiles={profiles}
            activeProfile={activeProfile}
            onProfileChange={handleProfileChange}
            onAddNewProfile={openNewProfileModal}
        />
        <main className="flex-grow">
          {renderView()}
        </main>
      </div>
      <AIAssistantButton onConsult={openGeminiModal} />
      {activeProfile && (
        <GeminiModal 
            isOpen={isGeminiModalOpen} 
            onClose={closeGeminiModal}
            chatHistory={activeProfile.chatHistory}
            onHistoryChange={handleChatHistoryChange}
            profileContext={profileContextForAI}
            invoices={activeProfile.invoices}
            expenses={activeProfile.expenses}
        />
      )}
      <NewExpenseModal 
        isOpen={isNewExpenseModalOpen} 
        onClose={closeNewExpenseModal}
        onSelectMagicCapture={() => {
            closeNewExpenseModal();
            handleViewChange(View.MagicCapture);
        }}
        onSelectManualEntry={handleNewManualExpense}
      />
       <NewProfileModal 
        isOpen={isNewProfileModalOpen} 
        onClose={closeNewProfileModal}
        onAddProfile={handleAddProfile}
      />
    </div>
  );
};

export default App;