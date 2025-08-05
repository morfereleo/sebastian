import React from 'react';
import { ICONS } from '../constants';

interface AIAssistantButtonProps {
    onConsult: () => void;
}

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onConsult }) => {
    return (
        <button
            onClick={onConsult}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 bg-cuadrai-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-cuadrai-blue-800 focus:outline-none focus:ring-2 focus:ring-cuadrai-blue-500 focus:ring-offset-2 focus:ring-offset-slate-100 transition-transform transform hover:scale-110"
            aria-label="Abrir asistente de IA"
        >
            <span className="text-3xl">{ICONS.sparkles}</span>
        </button>
    );
};

export default AIAssistantButton;
