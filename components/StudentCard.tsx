
import React, { useState } from 'react';
import { Student, AttendanceStatus } from '../types';

interface StudentCardProps {
  student: Student;
  onUpdateStatus: (id: string, status: AttendanceStatus) => void;
  onDelete: (id: string) => void;
  onTogglePayment: (id: string) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onUpdateStatus, onDelete, onTogglePayment }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const isPresent = student.status === 'present';
  const isAbsent = student.status === 'absent';
  const isPending = student.status === 'pending';
  const isPendingPayment = student.isPendingPayment;

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300 p-4 mb-3
        ${isPresent ? 'border-emerald-500 bg-emerald-50/20' : ''}
        ${isAbsent ? 'border-rose-500 bg-rose-50/20' : ''}
        ${isPending && !isPendingPayment ? 'bg-white border-slate-200 shadow-sm' : ''}
        ${isPendingPayment ? 'bg-[#FFFBEB] border-[#FCD34D] shadow-sm' : ''}
      `}
    >
      {isPendingPayment && (
        <div 
          onClick={() => onTogglePayment(student.id)}
          className="absolute top-3 right-14 bg-[#FEF3C7] border border-[#FCD34D] text-[#F59E0B] px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer hover:bg-[#FDE68A] transition-colors z-10"
          title={`Mensalidade em atraso desde ${student.pendingSince || 'data não informada'}`}
        >
          <span className="material-icons text-[14px]">payments</span>
          <span className="text-[11px] font-medium uppercase">Pendente</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 flex-grow min-w-0">
          <div 
            onClick={() => onTogglePayment(student.id)}
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer
            ${isPresent ? 'bg-emerald-100 text-emerald-600' : ''}
            ${isAbsent ? 'bg-rose-100 text-rose-600' : ''}
            ${isPending && !isPendingPayment ? 'bg-slate-100 text-slate-400' : ''}
            ${isPendingPayment ? 'bg-amber-100 text-amber-600' : ''}
          `}>
            <span className="material-icons">person</span>
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-base font-bold text-slate-800 truncate leading-tight">{student.name}</h3>
              {isPendingPayment && (
                <span 
                  className="material-icons text-amber-500 text-[16px]" 
                  title={`Mensalidade em atraso desde ${student.pendingSince || 'data não informada'}`}
                >
                  error_outline
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
              <span className="material-icons text-[14px]">school</span>
              {student.school}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
              {student.period}
            </span>
          </div>
        </div>

        {/* Botão de Excluir com Confirmação embutida para Mobile */}
        <button
          onClick={() => {
            if (isConfirmingDelete) {
              onDelete(student.id);
            } else {
              setIsConfirmingDelete(true);
              setTimeout(() => setIsConfirmingDelete(false), 3000); // Cancela após 3s
            }
          }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isConfirmingDelete ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-300 hover:text-rose-500'
          }`}
        >
          <span className="material-icons text-xl">{isConfirmingDelete ? 'delete_forever' : 'delete_outline'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => onUpdateStatus(student.id, 'present')}
          className={`
            flex-grow h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95
            ${isPresent ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-50 text-emerald-600'}
          `}
        >
          <span className="material-icons text-xl">check</span>
          PRESENTE
        </button>
        
        <button
          onClick={() => onUpdateStatus(student.id, 'absent')}
          className={`
            flex-grow h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95
            ${isAbsent ? 'bg-rose-500 text-white shadow-md' : 'bg-rose-50 text-rose-600'}
          `}
        >
          <span className="material-icons text-xl">close</span>
          AUSENTE
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
