import React, { useState, useEffect, useRef } from 'react';

interface SchoolAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  schools: string[];
  studentCounts: Record<string, number>;
}

const SchoolAutocomplete: React.FC<SchoolAutocompleteProps> = ({ value, onChange, schools, studentCounts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = schools
    .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (studentCounts[b] || 0) - (studentCounts[a] || 0));

  const handleSelect = (school: string) => {
    onChange(school);
    setSearchTerm(school);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">school</span>
        <input
          type="text"
          placeholder="Digite o nome da escola..."
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 font-medium"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required
        />
      </div>

      {isOpen && (searchTerm || suggestions.length > 0) && (
        <div className="absolute z-[60] left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden animate-[fadeIn_0.2s_ease-out]">
          {suggestions.map((school) => (
            <button
              key={school}
              type="button"
              onClick={() => handleSelect(school)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between transition-colors border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className="material-icons text-slate-400 text-sm">school</span>
                <span className="font-medium text-slate-700">{school}</span>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                {studentCounts[school] || 0}
              </span>
            </button>
          ))}
          
          {searchTerm && !schools.some(s => s.toLowerCase() === searchTerm.toLowerCase()) && (
            <button
              type="button"
              onClick={() => handleSelect(searchTerm)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-2 text-blue-600 transition-colors"
            >
              <span className="material-icons text-sm">add</span>
              <span className="font-bold">Adicionar "{searchTerm}"</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolAutocomplete;
