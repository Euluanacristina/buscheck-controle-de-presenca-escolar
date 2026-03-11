
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onToggleFilters, showFilters }) => {
  return (
    <div className="flex items-center gap-3 mt-6">
      <div className="relative flex-grow">
        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">search</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar aluno por nome ou escola..."
          className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 font-medium"
        />
      </div>
      <button 
        onClick={onToggleFilters}
        className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
          showFilters 
            ? 'bg-blue-50 border-blue-200 text-blue-600' 
            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
        aria-label="Abrir filtros"
      >
        <span className="material-icons">tune</span>
      </button>
    </div>
  );
};

export default SearchBar;
