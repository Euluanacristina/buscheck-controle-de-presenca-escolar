
import React from 'react';

interface HeaderProps {
  onOpenSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg md:hidden">
          <span className="material-icons text-white text-sm">directions_bus</span>
        </div>
        <h1 className="text-lg md:text-2xl font-bold text-slate-800">
          Olá, <span className="text-blue-600">Raissa</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={onOpenSettings}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
          title="Configurações"
        >
          <span className="material-icons text-sm md:text-base">settings</span>
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900 leading-none">Raissa Pinheiro</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Monitora Responsável</p>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
          <span className="material-icons text-blue-600 text-sm md:text-base">person</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
