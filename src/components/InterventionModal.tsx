import { useState } from 'react';
import { Clock, CheckCircle, HelpCircle, Lightbulb, Package, Target, X, Check } from 'lucide-react';
import { MicroIntervention, Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface InterventionModalProps {
  language: Language;
  intervention: MicroIntervention;
  studentName?: string;
  onClose: () => void;
  onMarkComplete?: () => void;
}

export const InterventionModal = ({
  language,
  intervention,
  studentName,
  onClose,
  onMarkComplete,
}: InterventionModalProps) => {
  const t = TRANSLATIONS[language];
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    if (onMarkComplete) onMarkComplete();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e5e0d5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#5a634e]/10 text-[#5a634e] border border-[#5a634e]/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Micro-Intervention
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#c97b5d]" />
                {intervention.timeRequiredMinutes || 7} Minutes
              </span>
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-800 mt-1">
              {intervention.concept} {studentName ? `for ${studentName}` : ''}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-[#fcf8f2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-3.5 text-xs">
          {/* Objective */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-2.5">
            <Target className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-900 text-xs">Objective</div>
              <p className="text-emerald-950 font-medium leading-relaxed mt-0.5">{intervention.objective}</p>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-[#fcf8f2] border border-[#d6c9b8] p-3.5 rounded-2xl flex items-start gap-2.5">
            <Package className="w-4 h-4 text-[#5a634e] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-800">{t.materials}</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {intervention.materialsRequired.map((mat, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-[#e5e0d5] text-slate-700 px-2.5 py-0.5 rounded-md font-medium text-[11px]"
                  >
                    • {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher Instructions */}
          <div className="bg-[#fdfcf8] border border-[#e5e0d5] p-4 rounded-2xl space-y-1">
            <div className="font-bold text-slate-800 font-serif text-sm">{t.teacherSteps}</div>
            <p className="text-slate-700 leading-relaxed font-normal">{intervention.teacherInstruction}</p>
          </div>

          {/* Questions to Ask & Expected Reasoning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#fdfcf8] border border-[#e5e0d5] p-3.5 rounded-2xl space-y-1">
              <div className="font-bold text-[#5a634e] flex items-center gap-1 font-serif">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.questionsToAsk}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                {intervention.questionsToAsk.map((q, idx) => (
                  <li key={idx} className="leading-snug">
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#fdfcf8] border border-[#e5e0d5] p-3.5 rounded-2xl space-y-1">
              <div className="font-bold text-emerald-800 flex items-center gap-1 font-serif">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t.expectedReasoning}</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">{intervention.expectedStudentReasoning}</p>
            </div>
          </div>

          {/* Teacher Hint */}
          {intervention.hint && (
            <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900">Teacher Hint</div>
                <p className="text-amber-950 leading-relaxed italic mt-0.5">"{intervention.hint}"</p>
              </div>
            </div>
          )}

          {/* Quick Check for Understanding */}
          <div className="bg-[#f4efe6] border border-[#d6c9b8] p-4 rounded-2xl space-y-1">
            <div className="font-bold text-[#5a634e] flex items-center justify-between font-serif text-sm">
              <span>{t.quickCheck} (10 Seconds)</span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">{intervention.quickCheck}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#e5e0d5] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleComplete}
            disabled={completed}
            className={`font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-2xs ${
              completed
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default'
                : 'bg-[#5a634e] hover:bg-[#4a523f] text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{completed ? 'Activity Conducted ✓' : 'Mark Activity Completed'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
