import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getFinancialAdvice } from '../services/geminiService';
import { ICONS } from '../constants';
import { ChatMessage, QuickAction, Invoice, Expense } from '../types';

interface GeminiModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatMessage[];
  onHistoryChange: (newHistory: ChatMessage[]) => void;
  profileContext: string;
  invoices: Invoice[];
  expenses: Expense[];
}

const formatCurrency = (val: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);

const QUICK_ACTIONS: QuickAction[] = [
    {
        label: '¿Cuánto IVA a pagar?',
        prompt: 'Calcula mi IVA a pagar este trimestre.',
        actionType: 'local',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 17h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2m-4-6h18M12 13V5m0 0L9 8m3-3 3 3"/></svg>
    },
    {
        label: '¿Tengo facturas vencidas?',
        prompt: 'Revisa si tengo facturas vencidas.',
        actionType: 'local',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
    },
    {
        label: '¿Cuál es mi beneficio neto?',
        prompt: 'Calcula mi beneficio neto hasta la fecha.',
        actionType: 'local',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    },
    {
        label: 'Consejos para reducir gastos',
        prompt: 'Dame algunos consejos prácticos para un autónomo en España sobre cómo reducir mis gastos deducibles.',
        actionType: 'remote',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
    }
];

const GeminiModal: React.FC<GeminiModalProps> = ({ isOpen, onClose, chatHistory, onHistoryChange, profileContext, invoices, expenses }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleConsult = useCallback(async (textPrompt: string) => {
    if (!textPrompt.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: textPrompt };
    const newHistory = [...chatHistory, userMessage];
    onHistoryChange(newHistory);
    
    setPrompt('');
    setIsLoading(true);

    try {
      const result = await getFinancialAdvice(textPrompt, newHistory, profileContext);
      const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: result };
      onHistoryChange([...newHistory, aiMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Lo siento, ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.' };
      onHistoryChange([...newHistory, errorMessage]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, chatHistory, onHistoryChange, profileContext]);

  const handleQuickActionClick = (action: QuickAction) => {
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: action.label };
    const newHistoryWithUserMessage = [...chatHistory, userMessage];
    onHistoryChange(newHistoryWithUserMessage);
    
    setIsLoading(true);

    // Simulate thinking time for local actions
    setTimeout(() => {
        let aiResponseText = '';
        if (action.actionType === 'local') {
            switch(action.label) {
                case '¿Cuánto IVA a pagar?':
                    const ivaRepercutido = invoices.reduce((sum, inv) => sum + (inv.subtotal * inv.iva / 100), 0);
                    const ivaSoportado = expenses.reduce((sum, exp) => sum + exp.iva, 0);
                    const ivaAPagar = ivaRepercutido - ivaSoportado;
                    aiResponseText = `Tu estimación de IVA a pagar para este trimestre es de **${formatCurrency(ivaAPagar)}**. \n\nEsto se calcula así:\n- **IVA cobrado (repercutido):** ${formatCurrency(ivaRepercutido)}\n- **IVA pagado (soportado):** ${formatCurrency(ivaSoportado)}`;
                    break;
                case '¿Tengo facturas vencidas?':
                    const overdueInvoices = invoices.filter(inv => inv.status === 'Vencida');
                    if(overdueInvoices.length > 0) {
                        aiResponseText = `Sí, tienes **${overdueInvoices.length} factura(s) vencida(s)** por un total de **${formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.total, 0))}**. Te recomiendo reclamar el pago pronto.`;
                    } else {
                        aiResponseText = `¡Buenas noticias! No tienes ninguna factura vencida. Todas tus facturas están al día.`;
                    }
                    break;
                case '¿Cuál es mi beneficio neto?':
                    const totalIncome = invoices.reduce((acc, inv) => acc + inv.subtotal, 0);
                    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
                    const netProfit = totalIncome - totalExpenses;
                     aiResponseText = `Hasta ahora, tu beneficio neto (ingresos menos gastos) es de **${formatCurrency(netProfit)}**. \n\n- **Total Ingresos:** ${formatCurrency(totalIncome)}\n- **Total Gastos:** ${formatCurrency(totalExpenses)}`;
                    break;
            }
            const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
            onHistoryChange([...newHistoryWithUserMessage, aiMessage]);
            setIsLoading(false);

        } else { // 'remote' action
            handleConsult(action.prompt);
        }
    }, 500);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all flex flex-col" role="dialog" style={{height: '90vh', maxHeight: '700px'}}>
        <div className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cuadrai-blue-100 rounded-full">{ICONS.sparkles}</div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Chat con tu Copiloto Fiscal</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>En línea</p>
            </div>
          </div>
           <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </div>
        
        <div ref={chatContainerRef} className="p-4 sm:p-6 flex-grow overflow-y-auto space-y-4">
          {chatHistory.map(msg => (
             <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-cuadrai-blue-700 text-white flex items-center justify-center flex-shrink-0 mt-1">{ICONS.sparkles}</div>}
                <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-cuadrai-blue-700 text-white rounded-br-lg' : 'bg-slate-100 text-slate-800 rounded-bl-lg'}`}>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></div>
                </div>
             </div>
          ))}

          {isLoading && (
             <div className="flex justify-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cuadrai-blue-700 text-white flex items-center justify-center flex-shrink-0 mt-1">{ICONS.sparkles}</div>
                <div className="bg-slate-100 text-slate-800 p-3 rounded-2xl rounded-bl-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
          )}

          {/* Quick Actions */}
           {chatHistory.length <= 1 && !isLoading && (
             <div className="border-t border-slate-200 pt-4 mt-4">
                <p className="text-sm font-semibold text-slate-500 mb-3 text-center">O prueba una de estas acciones rápidas:</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {QUICK_ACTIONS.map(action => (
                         <button 
                            key={action.label}
                            onClick={() => handleQuickActionClick(action)}
                            className="flex items-center gap-2 text-sm text-cuadrai-blue-700 font-semibold bg-cuadrai-blue-50 px-3 py-2 rounded-lg hover:bg-cuadrai-blue-100 hover:text-cuadrai-blue-800 transition-colors"
                        >
                            {action.icon}
                            {action.label}
                        </button>
                    ))}
                </div>
             </div>
          )}

        </div>

        <div className="p-3 sm:p-4 bg-slate-50/80 backdrop-blur-sm rounded-b-2xl border-t border-slate-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleConsult(prompt);
                  }
              }}
              placeholder="Escribe aquí tu duda..."
              className="w-full p-3 resize-none bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-cuadrai-blue-500 focus:border-cuadrai-blue-500 transition-shadow"
              rows={1}
              style={{maxHeight: '120px'}}
              disabled={isLoading}
            />
            <button 
                onClick={() => handleConsult(prompt)}
                disabled={isLoading || !prompt.trim()}
                className="flex-shrink-0 bg-cuadrai-blue-700 text-white font-bold p-3 rounded-lg hover:bg-cuadrai-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Enviar pregunta">
                {ICONS.send}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiModal;