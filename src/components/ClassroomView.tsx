import { useState, FormEvent } from 'react';
import { UserPlus, Search, Filter, ShieldCheck, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { Classroom, Language, Student, UnderstandingLevel } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface ClassroomViewProps {
  language: Language;
  classroom: Classroom;
  students: Student[];
  onAddStudent: (firstName: string, code?: string) => void;
  onSelectStudent: (studentId: string) => void;
  onOpenQuickObservation: (studentId?: string) => void;
}

export const ClassroomView = ({
  language,
  classroom,
  students,
  onAddStudent,
  onSelectStudent,
  onOpenQuickObservation,
}: ClassroomViewProps) => {
  const t = TRANSLATIONS[language];

  const [filter, setFilter] = useState<UnderstandingLevel | 'all' | 'missed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newCode, setNewCode] = useState('');

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || (s.studentCode && s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'missed') return s.missedSessions && s.missedSessions.length > 0;
    return s.status === filter;
  });

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim()) return;
    onAddStudent(newFirstName.trim(), newCode.trim() || undefined);
    setNewFirstName('');
    setNewCode('');
    setShowAddModal(false);
  };

  const getStatusBadge = (status: UnderstandingLevel) => {
    switch (status) {
      case 'strong':
        return <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-md font-semibold">Demonstrated 🟢</span>;
      case 'developing':
        return <span className="text-xs bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-md font-semibold">Developing 🟡</span>;
      case 'struggling':
        return <span className="text-xs bg-red-50 text-red-800 border border-red-300 px-2.5 py-0.5 rounded-md font-semibold">Needs Support 🔴</span>;
      default:
        return <span className="text-xs bg-slate-100 text-slate-600 border border-slate-300 px-2.5 py-0.5 rounded-md font-semibold">Unclear ⚪</span>;
    }
  };

  const strongCount = students.filter((s) => s.status === 'strong').length;
  const developingCount = students.filter((s) => s.status === 'developing').length;
  const strugglingCount = students.filter((s) => s.status === 'struggling').length;

  return (
    <div className="space-y-6">
      {/* Header & Classroom Meta */}
      <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif font-bold text-slate-800">{classroom.name}</h2>
            <span className="bg-[#fcf8f2] text-slate-700 text-xs px-3 py-1 rounded-full font-semibold border border-[#d6c9b8]">
              {classroom.grade} • {classroom.subject}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Language: Marathi / English • Total Enrolled: {students.length} Students
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#5a634e] hover:bg-[#4a523f] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Classroom Learning Map Bar */}
      <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 space-y-4 shadow-2xs">
        <h3 className="text-base font-serif font-bold text-slate-800 flex items-center gap-2">
          <span>Classroom Learning Map (Fractions)</span>
          <span className="text-xs font-sans font-medium text-slate-500">({students.length} students total)</span>
        </h3>

        {/* Visual Progress Ratio Bar */}
        <div className="h-4 bg-[#f4efe6] rounded-full overflow-hidden flex p-0.5 border border-[#d6c9b8]">
          <div
            style={{ width: `${(strongCount / students.length) * 100}%` }}
            className="bg-[#5a634e] h-full rounded-l transition-all"
            title={`Demonstrated Understanding: ${strongCount}`}
          />
          <div
            style={{ width: `${(developingCount / students.length) * 100}%` }}
            className="bg-amber-500 h-full transition-all"
            title={`Developing: ${developingCount}`}
          />
          <div
            style={{ width: `${(strugglingCount / students.length) * 100}%` }}
            className="bg-[#c97b5d] h-full rounded-r transition-all"
            title={`Needs Support: ${strugglingCount}`}
          />
        </div>

        {/* Category breakdown filter tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <button
            onClick={() => setFilter('all')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              filter === 'all'
                ? 'bg-[#5a634e] text-white border-[#5a634e] font-bold shadow-2xs'
                : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5] hover:border-[#5a634e]/50'
            }`}
          >
            <div className={filter === 'all' ? 'text-amber-100' : 'text-slate-500'}>All Students</div>
            <div className="text-xl font-bold font-serif mt-0.5">{students.length}</div>
          </button>

          <button
            onClick={() => setFilter('strong')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              filter === 'strong'
                ? 'bg-emerald-800 text-white border-emerald-800 font-bold shadow-2xs'
                : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5] hover:border-emerald-500/50'
            }`}
          >
            <div className={filter === 'strong' ? 'text-emerald-100' : 'text-emerald-700 flex items-center gap-1 font-semibold'}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Demonstrated 🟢</span>
            </div>
            <div className="text-xl font-bold font-serif mt-0.5">{strongCount}</div>
          </button>

          <button
            onClick={() => setFilter('developing')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              filter === 'developing'
                ? 'bg-amber-700 text-white border-amber-700 font-bold shadow-2xs'
                : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5] hover:border-amber-500/50'
            }`}
          >
            <div className={filter === 'developing' ? 'text-amber-100' : 'text-amber-700 flex items-center gap-1 font-semibold'}>
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Developing 🟡</span>
            </div>
            <div className="text-xl font-bold font-serif mt-0.5">{developingCount}</div>
          </button>

          <button
            onClick={() => setFilter('struggling')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              filter === 'struggling'
                ? 'bg-[#c97b5d] text-white border-[#c97b5d] font-bold shadow-2xs'
                : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5] hover:border-[#c97b5d]/50'
            }`}
          >
            <div className={filter === 'struggling' ? 'text-amber-100' : 'text-[#c97b5d] flex items-center gap-1 font-semibold'}>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Needs Support 🔴</span>
            </div>
            <div className="text-xl font-bold font-serif mt-0.5">{strugglingCount}</div>
          </button>
        </div>
      </div>

      {/* Search Bar & Filter Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student name or ID..."
            className="w-full bg-white border border-[#e5e0d5] rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5a634e] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Showing {filteredStudents.length} of {students.length} students</span>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white hover:bg-[#fcf8f2] border border-[#e5e0d5] hover:border-[#5a634e]/50 rounded-2xl p-4 space-y-3 transition flex flex-col justify-between shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-base">{student.firstName}</span>
                <span className="text-[10px] bg-[#fdfcf8] border border-[#e5e0d5] text-slate-500 px-2 py-0.5 rounded font-mono font-medium">
                  {student.studentCode || 'S'}
                </span>
              </div>

              <div>{getStatusBadge(student.status)}</div>

              {student.notes && (
                <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed pt-0.5">
                  "{student.notes}"
                </p>
              )}

              {student.missedSessions && student.missedSessions.length > 0 && (
                <div className="text-[11px] text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded font-medium">
                  ⚠️ Missed Session Catch-up Needed
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#e5e0d5]">
              <button
                onClick={() => onOpenQuickObservation(student.id)}
                className="flex-1 bg-[#c97b5d] hover:bg-[#b86a4c] text-white text-xs font-semibold py-1.5 rounded-xl transition cursor-pointer text-center shadow-2xs"
              >
                + Observation
              </button>
              <button
                onClick={() => onSelectStudent(student.id)}
                className="flex-1 bg-white hover:bg-[#fdfcf8] text-slate-700 text-xs font-semibold py-1.5 rounded-xl border border-[#e5e0d5] transition cursor-pointer text-center shadow-2xs"
              >
                Profile & Tip
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#5a634e]" />
                <span>Add Student to Classroom</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#fcf8f2] border border-[#d6c9b8] p-3.5 rounded-2xl text-xs text-slate-700 space-y-1">
              <div className="font-bold text-[#c97b5d] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#c97b5d]" />
                <span>Privacy-by-Design Requirement</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Only use first name or nickname. Do NOT enter phone numbers, emails, or precise home location.
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  First Name or Nickname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="e.g. Aarav, Rahul, Meera"
                  className="w-full bg-[#fdfcf8] border border-[#e5e0d5] rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#5a634e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Optional Student Code / Roll Number
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. S21 or Roll 21"
                  className="w-full bg-[#fdfcf8] border border-[#e5e0d5] rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#5a634e]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#5a634e] hover:bg-[#4a523f] text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-2xs transition"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
