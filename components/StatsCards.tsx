
import React from 'react';
import { AttendanceStats } from '../types';

interface StatsCardsProps {
  stats: AttendanceStats;
  totalGeral: number;
  activeFilter: string;
  onFilterClick: (filter: string) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, totalGeral, activeFilter, onFilterClick }) => {
  const isFiltered = stats.total < totalGeral;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 py-2">
      {/* Total Card */}
      <button 
        onClick={() => onFilterClick('')}
        className={`p-3 md:p-4 rounded-2xl border shadow-sm flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-3 transition-all active:scale-95 text-left ${
          activeFilter === '' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-800'
        }`}
      >
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          activeFilter === '' ? 'bg-white/20' : 'bg-blue-50'
        }`}>
          <span className={`material-icons text-lg md:text-xl ${activeFilter === '' ? 'text-white' : 'text-blue-600'}`}>groups</span>
        </div>
        <div className="overflow-hidden w-full">
          <p className="text-xl md:text-2xl font-black leading-none">
            {stats.total}
          </p>
          <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tighter truncate ${
            activeFilter === '' ? 'text-white/70' : 'text-slate-400'
          }`}>
            Total
          </p>
          {isFiltered && activeFilter === '' && (
            <p className="text-[8px] font-medium opacity-60">de {totalGeral}</p>
          )}
        </div>
      </button>

      {/* Present Card */}
      <button 
        onClick={() => onFilterClick('present')}
        className={`p-3 md:p-4 rounded-2xl border shadow-sm flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-3 transition-all active:scale-95 text-left ${
          activeFilter === 'present' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-emerald-50 border-emerald-100 text-slate-800'
        }`}
      >
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          activeFilter === 'present' ? 'bg-white/20' : 'bg-white'
        }`}>
          <span className={`material-icons text-lg md:text-xl ${activeFilter === 'present' ? 'text-white' : 'text-emerald-500'}`}>check_circle</span>
        </div>
        <div className="overflow-hidden w-full">
          <p className="text-xl md:text-2xl font-black leading-none">
            {stats.present}
          </p>
          <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tighter truncate ${
            activeFilter === 'present' ? 'text-white/70' : 'text-emerald-600/70'
          }`}>
            Presentes
          </p>
        </div>
      </button>

      {/* Absent Card */}
      <button 
        onClick={() => onFilterClick('absent')}
        className={`p-3 md:p-4 rounded-2xl border shadow-sm flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-3 transition-all active:scale-95 text-left ${
          activeFilter === 'absent' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-rose-50 border-rose-100 text-slate-800'
        }`}
      >
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          activeFilter === 'absent' ? 'bg-white/20' : 'bg-white'
        }`}>
          <span className={`material-icons text-lg md:text-xl ${activeFilter === 'absent' ? 'text-white' : 'text-rose-500'}`}>cancel</span>
        </div>
        <div className="overflow-hidden w-full">
          <p className="text-xl md:text-2xl font-black leading-none">
            {stats.absent}
          </p>
          <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tighter truncate ${
            activeFilter === 'absent' ? 'text-white/70' : 'text-rose-600/70'
          }`}>
            Ausentes
          </p>
        </div>
      </button>

      {/* Pending Payment Card */}
      <button 
        onClick={() => onFilterClick('pendingPayment')}
        className={`p-3 md:p-4 rounded-2xl border shadow-sm flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-3 transition-all active:scale-95 text-left ${
          activeFilter === 'pendingPayment' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-amber-50 border-amber-100 text-slate-800'
        }`}
      >
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          activeFilter === 'pendingPayment' ? 'bg-white/20' : 'bg-white'
        }`}>
          <span className={`material-icons text-lg md:text-xl ${activeFilter === 'pendingPayment' ? 'text-white' : 'text-amber-500'}`}>warning</span>
        </div>
        <div className="overflow-hidden w-full">
          <p className="text-xl md:text-2xl font-black leading-none">
            {stats.pendingPayment}
          </p>
          <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tighter truncate ${
            activeFilter === 'pendingPayment' ? 'text-white/70' : 'text-amber-600/70'
          }`}>
            Pendentes
          </p>
        </div>
      </button>
    </div>
  );
};

export default StatsCards;
