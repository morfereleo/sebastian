import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '../types';
import { ICONS } from '../constants';

interface ProfileSwitcherProps {
  profiles: Profile[];
  activeProfile: Profile;
  onProfileChange: (profileId: string) => void;
  onAddNewProfile: () => void;
}

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ profiles, activeProfile, onProfileChange, onAddNewProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const handleSelect = (profileId: string) => {
    onProfileChange(profileId);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    onAddNewProfile();
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
        <img
          src={activeProfile.avatarUrl}
          alt="Avatar"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cuadrai-blue-200"
        />
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-slate-700 truncate max-w-[150px]">{activeProfile.name}</p>
          <p className="text-sm text-slate-500">{activeProfile.type}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block text-slate-500"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-30 overflow-hidden animate-fade-in-up">
          <div className="p-2">
            <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase">Perfiles</p>
            {profiles.map(profile => (
              <button 
                key={profile.id}
                onClick={() => handleSelect(profile.id)}
                className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${profile.id === activeProfile.id ? 'bg-cuadrai-blue-50' : 'hover:bg-slate-50'}`}
              >
                 <img src={profile.avatarUrl} alt={profile.name} className="w-9 h-9 rounded-full"/>
                 <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-800">{profile.name}</p>
                    <p className="text-xs text-slate-500">{profile.type}</p>
                 </div>
                 {profile.id === activeProfile.id && <span className="text-cuadrai-blue-600">{ICONS.checkCircle}</span>}
              </button>
            ))}
          </div>
          <div className="border-t border-slate-200 p-2">
            <button onClick={handleAddNew} className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-slate-50 transition-colors text-slate-700">
                <span className="p-1.5 bg-slate-100 rounded-md">{ICONS.userPlus}</span>
                <span className="text-sm font-semibold">Añadir nuevo perfil</span>
            </button>
          </div>
        </div>
      )}
       <style>{`
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease-out forwards;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileSwitcher;