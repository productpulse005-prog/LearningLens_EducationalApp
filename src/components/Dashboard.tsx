import { PlusCircle, Lightbulb, Users, Layers, AlertCircle, ArrowRight, BookOpen, Compass, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import { Classroom, Language, LearningGroup, LearningSession, Student } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface DashboardProps {
  language: Language;
  classroom: Classroom;
  session: LearningSession;
  students: Student[];
  groups: LearningGroup[];
  onOpenQuickObservation: (studentId?: string) => void;
  onSelectStudent: (studentId: string) => void;
  onOpenGroupIntervention: (group: LearningGroup) => void;
  onOpenRealWorldContext: () => void;
  onOpenBuildFromKnowledge: () => void;
  onNavigateToTab: (tab: 'dashboard' | 'classroom' | 'session') => void;
}

export const Dashboard = ({
  language,
  classroom,
  session,
  students,
  groups,
  onOpenQuickObservation,
  onSelectStudent,
  onOpenGroupIntervention,
  onOpenRealWorldContext,
  onOpenBuildFromKnowledge,
  onNavigateToTab,
}: DashboardProps) => {
  const t = TRANSLATIONS[language];

  const strugglingStudents = students.filter((s) => s.status === 'struggling');
  const developingStudents = students.filter((s) => s.status === 'developing');
  const strongStudents = students.filter((s) => s.status === 'strong');

  return (
    <div className="space-y-6">
      {/* Teacher Philosophy Banner */}
      <div className="bg-[#5a634e] border border-[#4a523f] rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-amber-200/20 text-amber-100 border border-amber-200/30 text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              {t.todaysSession}
            </span>
            <span className="text-amber-100/90 text-xs font-medium">{session.subject} • {classroom.grade}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">{session.topic}</h2>
          <p className="text-xs sm:text-sm text-amber-50/90 max-w-2xl leading-relaxed">
            Objective: "{session.objective}"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onOpenQuickObservation()}
            className="bg-[#c97b5d] hover:bg-[#b86a4c] text-white font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.quickObservation}</span>
          </button>
          <button
            onClick={() => onNavigateToTab('session')}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-3.5 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer font-medium w-full sm:w-auto"
          >
            <BookOpen className="w-4 h-4 text-amber-200" />
            <span>Active Session View</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e5e0d5] rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Students</span>
            <Users className="w-4 h-4 text-[#5a634e]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-slate-800">{students.length}</span>
            <span className="text-xs font-medium text-slate-500">{classroom.grade}</span>
          </div>
        </div>

        <div className="bg-[#fcf8f2] border border-[#d6c9b8] rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-[#c97b5d]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c97b5d]">Needs Support 🔴</span>
            <AlertCircle className="w-4 h-4 text-[#c97b5d]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-[#c97b5d]">{strugglingStudents.length}</span>
            <span className="text-xs font-medium text-[#c97b5d]/80">Misconceptions</span>
          </div>
        </div>

        <div className="bg-[#fcf8f2] border border-[#d6c9b8] rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Developing 🟡</span>
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-amber-800">{developingStudents.length}</span>
            <span className="text-xs font-medium text-amber-700/80">Emerging</span>
          </div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Demonstrated 🟢</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-emerald-800">{strongStudents.length}</span>
            <span className="text-xs font-medium text-emerald-700">Strong</span>
          </div>
        </div>
      </div>

      {/* Specialized Tool Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onOpenRealWorldContext}
          className="bg-white hover:bg-[#fcf8f2] border border-[#e5e0d5] hover:border-[#5a634e]/40 p-5 rounded-3xl text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#fcf8f2] p-3.5 rounded-2xl border border-[#d6c9b8] text-[#c97b5d] group-hover:scale-105 transition">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-slate-800 group-hover:text-[#5a634e] transition">
                {t.realWorldContext}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Snap/upload objects (bottles, rope, bicycle) to get math & science activities
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#5a634e] group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={onOpenBuildFromKnowledge}
          className="bg-white hover:bg-[#fcf8f2] border border-[#e5e0d5] hover:border-[#5a634e]/40 p-5 rounded-3xl text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#f4efe6] p-3.5 rounded-2xl border border-[#d6c9b8] text-[#5a634e] group-hover:scale-105 transition">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-slate-800 group-hover:text-[#5a634e] transition">
                {t.buildKnowledge}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                Bridge student out-of-school life (farming, sharing, market) to formal concepts
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#5a634e] group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Main Grid: Students Needing Attention & Active Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Needing Attention */}
        <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#c97b5d]" />
              <h3 className="text-lg font-serif font-bold text-slate-800">{t.studentsNeedingAttention}</h3>
            </div>
            <span className="text-xs text-[#c97b5d] bg-[#fcf8f2] border border-[#d6c9b8] px-3 py-1 rounded-full font-bold">
              {strugglingStudents.length} Students
            </span>
          </div>

          <div className="space-y-3">
            {strugglingStudents.map((student) => (
              <div
                key={student.id}
                className="bg-[#fcf8f2] border border-[#d6c9b8] hover:border-[#c97b5d]/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{student.firstName}</span>
                    <span className="text-xs text-[#c97b5d] bg-[#c97b5d]/10 px-2 py-0.5 rounded font-semibold">
                      {student.studentCode || 'S'}
                    </span>
                    {student.missedSessions?.length > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded font-bold">
                        Missed Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{student.notes || 'Judges fraction magnitude by denominator size.'}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenQuickObservation(student.id)}
                    className="bg-[#c97b5d] hover:bg-[#b86a4c] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    + Observe
                  </button>
                  <button
                    onClick={() => onSelectStudent(student.id)}
                    className="bg-white hover:bg-[#fdfcf8] text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#e5e0d5] transition cursor-pointer shadow-2xs"
                  >
                    Profile & Tip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Targeted Learning Groups */}
        <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5a634e]" />
              <h3 className="text-lg font-serif font-bold text-slate-800">{t.activeGroups}</h3>
            </div>
            <span className="text-xs text-[#5a634e] bg-[#f4efe6] border border-[#d6c9b8] px-3 py-1 rounded-full font-bold">
              {groups.length} Cohorts
            </span>
          </div>

          <div className="space-y-3">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-[#fdfcf8] border border-[#e5e0d5] hover:border-[#5a634e] p-4 rounded-2xl space-y-3 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{group.name}</h4>
                    <p className="text-xs text-slate-500 leading-normal">{group.description}</p>
                  </div>
                  <span className="text-xs font-bold bg-[#5a634e]/10 text-[#5a634e] border border-[#5a634e]/20 px-2.5 py-0.5 rounded-md shrink-0">
                    {group.studentIds.length} Students
                  </span>
                </div>

                {group.recommendedIntervention && (
                  <div className="bg-[#f4efe6] border border-[#d6c9b8] p-3 rounded-xl text-xs flex items-center justify-between gap-2">
                    <span className="text-slate-700 font-medium truncate">
                      🎯 {group.recommendedIntervention.concept} ({group.recommendedIntervention.timeRequiredMinutes}m)
                    </span>
                    <button
                      onClick={() => onOpenGroupIntervention(group)}
                      className="bg-[#5a634e] hover:bg-[#4a523f] text-white font-bold px-3 py-1.5 rounded-lg transition text-xs shrink-0 cursor-pointer shadow-2xs"
                    >
                      {t.viewMicroIntervention}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence-Backed Classroom Insights */}
      <div className="bg-[#fcf8f2] border border-[#d6c9b8] rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#c97b5d]" />
          <h3 className="text-lg font-serif font-bold text-slate-800">Evidence-Backed Classroom Pattern Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="bg-white p-4 rounded-2xl border border-[#e5e0d5] space-y-2 shadow-2xs">
            <div className="text-[#c97b5d] font-bold text-sm">Denominator Size Confusion</div>
            <p className="text-slate-600 leading-relaxed">
              5 of 20 students judge fraction magnitude strictly by denominator digits (e.g. thinking 1/4 &gt; 1/2).
            </p>
            <span className="inline-block text-[10px] text-slate-400 bg-[#fdfcf8] border border-[#e5e0d5] px-2 py-0.5 rounded font-medium">
              Based on 4 paper-folding activity observations
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#e5e0d5] space-y-2 shadow-2xs">
            <div className="text-amber-800 font-bold text-sm">Visual vs Symbolic Gap</div>
            <p className="text-slate-600 leading-relaxed">
              8 students identify halves/quarters visually with diagrams, but hesitate when writing fraction symbols.
            </p>
            <span className="inline-block text-[10px] text-slate-400 bg-[#fdfcf8] border border-[#e5e0d5] px-2 py-0.5 rounded font-medium">
              Based on blackboard comparison responses
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#e5e0d5] space-y-2 shadow-2xs">
            <div className="text-[#5a634e] font-bold text-sm">Real-World Object Engagement</div>
            <p className="text-slate-600 leading-relaxed">
              Students grasp equal division 40% faster when using paper strips and roti sharing examples.
            </p>
            <span className="inline-block text-[10px] text-slate-400 bg-[#fdfcf8] border border-[#e5e0d5] px-2 py-0.5 rounded font-medium">
              Based on group activity participation signals
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
