
import React, { useState, useRef, useEffect } from 'react';
import { FilterOptions } from '../types';

interface FiltersProps {
  options: FilterOptions;
  onChange: (options: FilterOptions) => void;
  onReset: () => void;
  onOpenSchoolManagement?: () => void;
  schools: string[];
  studentCounts: Record<string, number>;
}

const Filters: React.FC<FiltersProps> = ({ options, onChange, onReset, onOpenSchoolManagement, schools, studentCounts }) => {
  const [isSchoolMenuOpen, setIsSchoolMenuOpen] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState('');
  const schoolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (schoolRef.current && !schoolRef.current.contains(event.target as Node)) {
        setIsSchoolMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field: keyof FilterOptions, value: any) => {
    onChange({ ...options, [field]: value });
  };

  const toggleSchool = (school: string) => {
    const currentSchools = Array.isArray(options.school) ? options.school : (options.school ? [options.school] : []);
    if (currentSchools.includes(school)) {
      const next = currentSchools.filter(s => s !== school);
      handleChange('school', next.length === 0 ? '' : next);
    } else {
      handleChange('school', [...currentSchools, school]);
    }
  };

  const filteredSchools = schools
    .filter(s => s.toLowerCase().includes(schoolSearch.toLowerCase()))
    .sort((a, b) => (studentCounts[b] || 0) - (studentCounts[a] || 0));

  const selectedSchoolsCount = Array.isArray(options.school) ? options.school.length : (options.school ? 1 : 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 animate-[slideDown_0.2s_ease-out]">
      <div className="space-y-1 relative" ref={schoolRef}>
        <label className="text-xs font-semibold text-slate-500 uppercase px-1 flex justify-between">
          Escola
          {selectedSchoolsCount > 0 && (
            <span className="text-blue-600 lowercase font-bold">({selectedSchoolsCount} selecionada{selectedSchoolsCount > 1 ? 's' : ''})</span>
          )}
        </label>
        <button 
          onClick={() => setIsSchoolMenuOpen(!isSchoolMenuOpen)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 font-bold outline-none flex items-center justify-between hover:border-slate-300 transition-all"
        >
          <span className="truncate">
            {selectedSchoolsCount === 0 ? 'Todas as escolas' : 
             selectedSchoolsCount === 1 ? (Array.isArray(options.school) ? options.school[0] : options.school) : 
             `${selectedSchoolsCount} escolas selecionadas`}
          </span>
          <span className="material-icons text-slate-400">expand_more</span>
        </button>

        {isSchoolMenuOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <span className="material-icons absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input 
                  type="text"
                  placeholder="Buscar escola..."
                  className="w-full bg-slate-50 border-none rounded-md py-1.5 pl-8 pr-2 text-xs outline-none focus:ring-1 focus:ring-blue-500/20"
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              <button
                onClick={() => {
                  handleChange('school', '');
                  setIsSchoolMenuOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
              >
                <span className={`material-icons text-sm ${!options.school ? 'text-blue-600' : 'text-slate-300'}`}>
                  {!options.school ? 'check_box' : 'check_box_outline_blank'}
                </span>
                Todas as escolas
              </button>
              {filteredSchools.map(s => {
                const isSelected = Array.isArray(options.school) ? options.school.includes(s) : options.school === s;
                return (
                  <button
                    key={s}
                    onClick={() => toggleSchool(s)}
                    className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`material-icons text-sm ${isSelected ? 'text-blue-600' : 'text-slate-300'}`}>
                        {isSelected ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      {s}
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full">
                      {studentCounts[s] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase px-1">Status de Presença</label>
        <select 
          value={options.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="present">Presente</option>
          <option value="absent">Ausente</option>
        </select>
      </div>
      
      <div className="md:col-span-2 flex justify-between items-center">
        <button 
          onClick={onOpenSchoolManagement}
          className="text-xs font-bold text-slate-500 hover:text-slate-600 px-2 py-1 transition-colors flex items-center gap-1"
        >
          <span className="material-icons text-sm">settings</span>
          GERENCIAR ESCOLAS
        </button>
        <button 
          onClick={onReset}
          className="text-xs font-bold text-rose-500 hover:text-rose-600 px-2 py-1 transition-colors flex items-center gap-1"
        >
          <span className="material-icons text-sm">refresh</span>
          LIMPAR FILTROS
        </button>
      </div>
    </div>
  );
};

export default Filters;
