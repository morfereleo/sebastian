import React from 'react';
import { ICONS } from '../constants';
import { Profile } from '../types';
import ProfileSwitcher from './ProfileSwitcher';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  profiles: Profile[];
  activeProfile: Profile | undefined;
  onProfileChange: (profileId: string) => void;
  onAddNewProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, profiles, activeProfile, onProfileChange, onAddNewProfile }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 w-full border-b border-slate-200">
      <div className="flex items-center justify-between h-20 px-4 sm:px-8">
        <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="lg:hidden p-2 text-slate-600 hover:text-cuadrai-blue-700">
                <span className="sr-only">Abrir menú</span>
                {ICONS.menu}
            </button>
            <h1 className="text-xl sm:text-3xl font-bold text-slate-800">{title}</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
            {activeProfile && (
                <ProfileSwitcher 
                    profiles={profiles}
                    activeProfile={activeProfile}
                    onProfileChange={onProfileChange}
                    onAddNewProfile={onAddNewProfile}
                />
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;