import { PlusCircle, BookOpen, Clock, Package } from 'lucide-react';
import { AnalysisResult, Language, LearningSession, Observation, Student } from '../types';
import { TRANSLATIONS } from '../lib/translations';
import { AnalysisCard } from './AnalysisCard';

interface SessionViewProps {
  language: Language;
  session: LearningSession;
  students: Student[];
  observations: Observation[];
  analyses: AnalysisResult[];
  onOpenQuickObservation: (studentId?: string) => void;
  onOpenIntervention: (analysis: AnalysisResult) => void;
  onRecordFeedback: (rating: 'very_useful' | 'somewhat_useful' | 'not_useful', reasons: string[]) => void;
}

export const SessionView = ({
  language,
  session,
  students,
  observations,
  analyses,
  onOpenQuickObservation,
  onOpenIntervention,
  onRecordFeedback,
}: SessionViewProps) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6">
      {/* Session Active Header */}
      <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e5e0d5]">
          <div className="flex items-center gap-3">
            <div className="bg-[#f4efe6] p-2.5 rounded-2xl border border-[#d6c9b8] text-[#5a634e]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-slate-800">{session.topic}</h2>
                <span className="bg-[#5a634e]/10 text-[#5a634e] border border-[#5a634e]/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Active Session
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {session.subject} • Duration: {session.durationMinutes} Minutes • Language: Marathi
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenQuickObservation()}
            className="bg-[#c97b5d] hover:bg-[#b86a4c] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-2xs transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.quickObservation}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#fcf8f2] p-3.5 rounded-2xl border border-[#d6c9b8] space-y-1">
            <div className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#c97b5d]" />
              <span>Learning Objective</span>
            </div>
            <p className="text-slate-800 leading-relaxed font-medium">"{session.objective}"</p>
          </div>

          <div className="bg-[#fcf8f2] p-3.5 rounded-2xl border border-[#d6c9b8] space-y-1">
            <div className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-[#5a634e]" />
              <span>Available Classroom Objects</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {session.availableObjects.map((obj, idx) => (
                <span
                  key={idx}
                  className="bg-white text-slate-700 border border-[#e5e0d5] px-2.5 py-0.5 rounded-md text-[11px] font-medium"
                >
                  • {obj}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roster Quick-Tap Observation Grid */}
      <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-bold text-slate-800 flex items-center gap-2">
            <span>Classroom Roster ({students.length} Students)</span>
            <span className="text-xs font-sans font-normal text-slate-500">- Tap any student to log observation</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => onOpenQuickObservation(student.id)}
              className="bg-[#fdfcf8] hover:bg-[#fcf8f2] border border-[#e5e0d5] hover:border-[#5a634e] p-3 rounded-2xl text-left transition cursor-pointer flex flex-col justify-between h-20 group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs group-hover:text-[#5a634e] transition">
                  {student.firstName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{student.studentCode || 'S'}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    student.status === 'strong'
                      ? 'bg-emerald-100 text-emerald-800'
                      : student.status === 'developing'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {student.status.toUpperCase()}
                </span>
                <span className="text-[#5a634e] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition">
                  + Log
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time AI Analyses & Observations Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
          <span>Real-Time AI Learning Intelligence Stream</span>
          <span className="text-xs font-sans font-normal text-slate-500">({analyses.length} analyses)</span>
        </h3>

        {analyses.length > 0 ? (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <AnalysisCard
                key={analysis.id}
                language={language}
                analysis={analysis}
                onOpenIntervention={onOpenIntervention}
                onRecordFeedback={onRecordFeedback}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e5e0d5] rounded-3xl p-8 text-center space-y-3 shadow-2xs">
            <p className="text-base font-serif font-bold text-slate-800">No observations recorded for this active session yet.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Tap any student above or click "Record Quick Observation" to capture a 10-second learning signal. Gemini AI will analyze misconceptions and recommend 7-minute interventions instantly.
            </p>
            <button
              onClick={() => onOpenQuickObservation('s1')}
              className="bg-[#5a634e] hover:bg-[#4a523f] text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer shadow-2xs transition mt-2 inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Try Demo Observation (Aarav - Fraction Misconception)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
