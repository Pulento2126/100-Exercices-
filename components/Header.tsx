
import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  alertCount: number;
}

const navItems: { view: ViewType; label: string; icon: React.ReactNode }[] = [
  {
    view: 'dashboard',
    label: 'Tableau de bord',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    view: 'inventaire',
    label: 'Inventaire',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  },
  {
    view: 'mouvement',
    label: 'Mouvement',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  },
  {
    view: 'ajouter',
    label: 'Ajouter',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  },
];

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, alertCount }) => {
  return (
    <header className="bg-secondary/80 backdrop-blur-md border-b border-cardBorder sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">GestoStock</h1>
              <p className="text-[10px] text-textMuted uppercase tracking-widest leading-none">Matériel BTP</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ view, label, icon }) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === view
                    ? 'bg-accent/20 text-accent'
                    : 'text-textMuted hover:text-white hover:bg-primary/50'
                }`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
                {view === 'dashboard' && alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
