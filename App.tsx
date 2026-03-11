
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import StudentCard from './components/StudentCard';
import SchoolAutocomplete from './components/SchoolAutocomplete';
import Toast from './components/Toast';
import { Student, AttendanceStatus, AttendanceStats, FilterOptions, Period } from './types';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('buscheck_students');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [schools, setSchools] = useState<string[]>(() => {
    const saved = localStorage.getItem('buscheck_schools');
    if (saved) return JSON.parse(saved);
    // Extract unique schools from existing students if no saved list
    const initialStudents = JSON.parse(localStorage.getItem('buscheck_students') || '[]');
    const uniqueSchools = Array.from(new Set(initialStudents.map((s: any) => s.school))) as string[];
    return uniqueSchools;
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>(() => {
    const saved = localStorage.getItem('buscheck_filters');
    return saved ? JSON.parse(saved) : {
      search: '',
      school: '',
      period: '',
      status: '',
      onlyPendingPayment: false
    };
  });
  
  const [newStudent, setNewStudent] = useState({ 
    name: '', 
    school: '', 
    period: 'Manhã' as Period,
    isPendingPayment: false
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    localStorage.setItem('buscheck_students', JSON.stringify(students));
    // Update schools list if a new school was added via student
    const currentSchools = Array.from(new Set(students.map(s => s.school)));
    setSchools(prev => {
      const combined = Array.from(new Set([...prev, ...currentSchools]));
      if (JSON.stringify(combined) !== JSON.stringify(prev)) {
        localStorage.setItem('buscheck_schools', JSON.stringify(combined));
        return combined;
      }
      return prev;
    });
  }, [students]);

  useEffect(() => {
    localStorage.setItem('buscheck_filters', JSON.stringify(filters));
  }, [filters]);

  const stats = useMemo<AttendanceStats>(() => {
    // Stats should reflect the current period/school filters but NOT the status/search filters
    // unless the user explicitly wants stats for the filtered set. 
    // Usually stats cards show the context of the current "view".
    const baseSet = students.filter(student => {
      const matchesSchool = !filters.school || 
        (Array.isArray(filters.school) ? filters.school.includes(student.school) : student.school === filters.school);
      const matchesPeriod = !filters.period || student.period === filters.period;
      return matchesSchool && matchesPeriod;
    });

    return {
      total: baseSet.length,
      present: baseSet.filter(s => s.status === 'present').length,
      absent: baseSet.filter(s => s.status === 'absent').length,
      pendingPayment: baseSet.filter(s => s.isPendingPayment).length
    };
  }, [students, filters.school, filters.period]);

  const totalGeral = students.length;

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                            student.school.toLowerCase().includes(filters.search.toLowerCase());
      const matchesSchool = !filters.school || 
        (Array.isArray(filters.school) ? filters.school.includes(student.school) : student.school === filters.school);
      const matchesPeriod = !filters.period || student.period === filters.period;
      const matchesStatus = !filters.status || student.status === filters.status;
      const matchesPending = !filters.onlyPendingPayment || student.isPendingPayment;
      return matchesSearch && matchesSchool && matchesPeriod && matchesStatus && matchesPending;
    }).sort((a, b) => {
      // Prioritize pending payment students
      if (a.isPendingPayment && !b.isPendingPayment) return -1;
      if (!a.isPendingPayment && b.isPendingPayment) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [students, filters]);

  const handleUpdateStatus = useCallback((id: string, status: AttendanceStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === status ? 'pending' : status };
      }
      return s;
    }));
  }, []);

  const handleTogglePayment = useCallback((id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const isPending = !s.isPendingPayment;
        return { 
          ...s, 
          isPendingPayment: isPending,
          pendingSince: isPending ? new Date().toLocaleDateString('pt-BR') : undefined
        };
      }
      return s;
    }));
  }, []);

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setToast({ message: 'Aluno excluído', type: 'success' });
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.school.trim()) return;

    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name.trim(),
      school: newStudent.school.trim(),
      period: newStudent.period,
      status: 'pending',
      isPendingPayment: newStudent.isPendingPayment,
      pendingSince: newStudent.isPendingPayment ? new Date().toLocaleDateString('pt-BR') : undefined
    };

    setStudents(prev => [student, ...prev]);
    setNewStudent({ name: '', school: '', period: 'Manhã', isPendingPayment: false });
    setShowAddForm(false);
    setToast({ message: 'Cadastrado com sucesso!', type: 'success' });
  };

  const handleResetAttendance = () => {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      setTimeout(() => setIsConfirmingReset(false), 3000);
      return;
    }
    setStudents(prev => prev.map(s => ({ ...s, status: 'pending' })));
    setIsConfirmingReset(false);
    setToast({ message: 'Lista zerada para hoje', type: 'success' });
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleDeleteSchool = (schoolName: string) => {
    if (window.confirm(`Deseja realmente excluir a escola "${schoolName}"? Alunos vinculados a esta escola ficarão sem escola definida.`)) {
      setSchools(prev => prev.filter(s => s !== schoolName));
      setStudents(prev => prev.map(student => 
        student.school === schoolName ? { ...student, school: '' } : student
      ));
      setToast({ message: `Escola "${schoolName}" excluída com sucesso.`, type: 'success' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="flex-grow px-3 md:px-8 py-4 max-w-4xl mx-auto w-full">
        <StatsCards 
          stats={stats} 
          totalGeral={totalGeral}
          activeFilter={filters.status || (filters.onlyPendingPayment ? 'pendingPayment' : '')}
          onFilterClick={(status) => {
            if (status === 'pendingPayment') {
              setFilters(f => ({ ...f, status: '', onlyPendingPayment: !f.onlyPendingPayment }));
            } else {
              setFilters(f => ({ ...f, status: f.status === status ? '' : status, onlyPendingPayment: false }));
            }
          }}
        />

        {/* Period Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar">
          {[
            { id: '', label: 'Todos', icon: 'select_all' },
            { id: 'Manhã', label: 'Manhã', icon: 'wb_sunny' },
            { id: 'Tarde', label: 'Tarde', icon: 'wb_twilight' },
            { id: 'Noite', label: 'Noite', icon: 'nightlight' }
          ].map(p => {
            const isActive = filters.period === p.id;
            const count = p.id ? students.filter(s => s.period === p.id).length : students.length;
            
            return (
              <button
                key={p.id}
                onClick={() => setFilters(f => ({ ...f, period: p.id }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all active:scale-95 border ${
                  isActive 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                <span className="material-icons text-lg">{p.icon}</span>
                {p.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        
        <SearchBar 
          value={filters.search} 
          onChange={(val) => setFilters(f => ({ ...f, search: val }))}
          onToggleFilters={() => setShowFilters(!showFilters)}
          showFilters={showFilters}
        />

        {showFilters && (
          <Filters 
            options={filters} 
            onChange={setFilters} 
            schools={schools}
            studentCounts={students.reduce((acc, s) => {
              acc[s.school] = (acc[s.school] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)}
            onReset={() => setFilters({ search: '', school: '', period: '', status: '', onlyPendingPayment: false })}
            onOpenSchoolManagement={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Active Filters Display */}
        {(filters.period || filters.school || filters.status || filters.onlyPendingPayment) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Filtros ativos:</span>
            
            {filters.period && (
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border border-blue-100">
                <span className="material-icons text-sm">schedule</span>
                {filters.period}
                <button onClick={() => setFilters(f => ({ ...f, period: '' }))} className="material-icons text-sm hover:text-blue-800">close</button>
              </div>
            )}

            {filters.school && (
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border border-blue-100">
                <span className="material-icons text-sm">school</span>
                {Array.isArray(filters.school) ? `Escolas (${filters.school.length})` : filters.school}
                <button onClick={() => setFilters(f => ({ ...f, school: '' }))} className="material-icons text-sm hover:text-blue-800">close</button>
              </div>
            )}

            {filters.status && (
              <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border border-blue-100">
                <span className="material-icons text-sm">info</span>
                {filters.status === 'present' ? 'Presentes' : filters.status === 'absent' ? 'Ausentes' : 'Pendentes'}
                <button onClick={() => setFilters(f => ({ ...f, status: '' }))} className="material-icons text-sm hover:text-blue-800">close</button>
              </div>
            )}

            {filters.onlyPendingPayment && (
              <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border border-amber-100">
                <span className="material-icons text-sm">payments</span>
                Mensalidade Pendente
                <button onClick={() => setFilters(f => ({ ...f, onlyPendingPayment: false }))} className="material-icons text-sm hover:text-amber-800">close</button>
              </div>
            )}

            <button 
              onClick={() => setFilters({ search: '', school: '', period: '', status: '', onlyPendingPayment: false })}
              className="text-[10px] font-bold text-slate-400 hover:text-rose-500 underline underline-offset-2 ml-1"
            >
              Limpar tudo
            </button>
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">
              LISTA DE ALUNOS ({filteredStudents.length})
            </h2>
            {students.length > 0 && (
              <button 
                onClick={handleResetAttendance}
                className={`text-[10px] md:text-[11px] font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 border shadow-sm ${
                  isConfirmingReset 
                    ? 'bg-rose-600 border-rose-600 text-white animate-pulse' 
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <span className="material-icons text-sm">{isConfirmingReset ? 'warning' : 'restart_alt'}</span>
                {isConfirmingReset ? 'CONFIRMAR?' : 'ZERAR HOJE'}
              </button>
            )}
          </div>

          <div className="space-y-1">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteStudent}
                  onTogglePayment={handleTogglePayment}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                <span className="material-icons text-5xl mb-3 text-slate-200">
                  {students.length === 0 ? 'person_add_alt' : 'sentiment_dissatisfied'}
                </span>
                <p className="font-bold text-slate-500">
                  {students.length === 0 ? 'Comece sua lista' : 'Nada encontrado'}
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-bold text-sm"
                >
                  Adicionar Aluno
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal / Bottom Sheet de Cadastro */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-lg bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
            <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800 tracking-tight">CADASTRAR ALUNO</h3>
                <button onClick={() => setShowAddForm(false)} className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                  <span className="material-icons">close</span>
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Nome do Aluno</label>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Ex: João da Silva"
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-900"
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Escola</label>
                  <SchoolAutocomplete 
                    value={newStudent.school}
                    onChange={(val) => setNewStudent({...newStudent, school: val})}
                    schools={schools}
                    studentCounts={students.reduce((acc, s) => {
                      acc[s.school] = (acc[s.school] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Período</label>
                    <select
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-900"
                      value={newStudent.period}
                      onChange={e => setNewStudent({...newStudent, period: e.target.value as Period})}
                    >
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noite">Noite</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2">Mensalidade</label>
                    <button
                      type="button"
                      onClick={() => setNewStudent({...newStudent, isPendingPayment: !newStudent.isPendingPayment})}
                      className={`w-full p-4 border rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${
                        newStudent.isPendingPayment 
                          ? 'bg-amber-50 border-amber-200 text-amber-600' 
                          : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}
                    >
                      <span className="material-icons">{newStudent.isPendingPayment ? 'warning' : 'check_circle'}</span>
                      {newStudent.isPendingPayment ? 'PENDENTE' : 'EM DIA'}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-all uppercase tracking-widest mt-4"
                >
                  CRIAR REGISTRO
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Botão Flutuante 'Adicionar' (FAB) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center active:scale-90 transition-all shadow-blue-200 border-b-4 border-blue-800"
          title="Adicionar Aluno"
        >
          <span className="material-icons text-3xl">person_add</span>
        </button>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* School Management Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-icons text-slate-400">school</span>
                <h3 className="font-black text-slate-800 uppercase tracking-tight">Gerenciar Escolas</h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <span className="material-icons text-slate-500">close</span>
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
              {schools.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <span className="material-icons text-4xl mb-2">history_edu</span>
                  <p className="text-sm">Nenhuma escola cadastrada.</p>
                </div>
              ) : (
                schools.map(school => (
                  <div key={school} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{school}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-black">
                        {students.filter(s => s.school === school).length} Alunos
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteSchool(school)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideUpToast { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
};

export default App;
