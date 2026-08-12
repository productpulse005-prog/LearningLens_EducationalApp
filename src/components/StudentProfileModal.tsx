import { useState } from 'react';
import { User, Copy, Check, Clock, X, HeartHandshake } from 'lucide-react';
import { Language, StudentProfile, Student } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface StudentProfileModalProps {
  language: Language;
  student: Student;
  profile: StudentProfile | null;
  onClose: () => void;
  onOpenQuickObservation: (studentId: string) => void;
}

export const StudentProfileModal = ({
  language,
  student,
  profile,
  onClose,
  onOpenQuickObservation,
}: StudentProfileModalProps) => {
  const t = TRANSLATIONS[language];
  const [parentLang, setParentLang] = useState<Language>(language);
  const [copied, setCopied] = useState(false);

  const parentText = profile?.parentSummary
    ? profile.parentSummary[parentLang] || profile.parentSummary.en
    : `Today ${student.firstName} worked on Mathematics. Try practicing simple equal sharing at home.`;

  const atHomeTip = profile?.parentSummary?.atHomeTip || 'Cut a roti or fruit into equal parts and compare 1/2 and 1/4.';

  const handleCopyParentText = () => {
    const fullShareText = `Learning Lens Update for ${student.firstName}:\n\n${parentText}\n\n🏡 At-Home Practice Tip:\n${atHomeTip}`;
    navigator.clipboard.writeText(fullShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 sm:p-7 max-w-xl w-full space-y-5 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e5e0d5]">
          <div className="flex items-center gap-3">
            <div className="bg-[#f4efe6] p-2.5 rounded-2xl border border-[#d6c9b8] text-[#5a634e]">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-bold text-slate-800">{student.firstName}</h3>
                <span className="text-xs bg-[#fdfcf8] text-slate-600 px-2.5 py-0.5 rounded font-mono border border-[#e5e0d5] font-medium">
                  {student.studentCode || 'S'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Grade 5 • Mathematics Learning Profile</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-[#fcf8f2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missed Session Catch-Up Banner if applicable */}
        {student.missedSessions && student.missedSessions.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-xs space-y-1">
            <div className="font-bold text-red-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-700" />
              <span>Learning Continuity: Missed Previous Session</span>
            </div>
            <p className="text-red-950 leading-relaxed font-medium">
              {student.firstName} missed the session on "Fractions Introduction". Before continuing to equivalent fractions, complete an 8-minute paper folding catch-up activity.
            </p>
          </div>
        )}

        {/* Concept Mastery Evolution */}
        <div className="space-y-2.5 text-xs">
          <h4 className="font-serif font-bold text-slate-800 flex items-center justify-between text-sm">
            <span>Demonstrated Mathematical Concepts</span>
            <span className="text-[11px] font-sans text-slate-500 font-normal">Non-Labeling Profile</span>
          </h4>

          {profile?.concepts && profile.concepts.length > 0 ? (
            <div className="space-y-2.5">
              {profile.concepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="bg-[#fdfcf8] border border-[#e5e0d5] p-3.5 rounded-2xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{concept.conceptName}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                        concept.status === 'strong'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : concept.status === 'developing'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-red-100 text-red-900 border-red-300'
                      }`}
                    >
                      {concept.status.toUpperCase()}
                    </span>
                  </div>

                  {concept.observedMisconception && (
                    <div className="text-amber-900 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] font-semibold">
                      ⚡ Observed Misconception: {concept.observedMisconception}
                    </div>
                  )}

                  <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                    Evidence: {concept.evidenceSummary}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#fdfcf8] border border-[#e5e0d5] p-4 rounded-2xl text-slate-500 text-xs italic">
              No concept observations recorded yet for {student.firstName}.
            </div>
          )}
        </div>

        {/* Parent Mode Summary (Prompt Section 20) */}
        <div className="bg-[#fcf8f2] border border-[#d6c9b8] rounded-2xl p-4.5 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#c97b5d]" />
              <h4 className="font-serif font-bold text-slate-800 text-sm">{t.parentSummary}</h4>
            </div>

            {/* Parent Language Switcher */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-[#e5e0d5] text-[10px]">
              <button
                onClick={() => setParentLang('mr')}
                className={`px-2 py-1 rounded font-bold transition cursor-pointer ${
                  parentLang === 'mr' ? 'bg-[#5a634e] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => setParentLang('hi')}
                className={`px-2 py-1 rounded font-bold transition cursor-pointer ${
                  parentLang === 'hi' ? 'bg-[#5a634e] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setParentLang('en')}
                className={`px-2 py-1 rounded font-bold transition cursor-pointer ${
                  parentLang === 'en' ? 'bg-[#5a634e] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e5e0d5] text-slate-700 leading-relaxed space-y-2 font-medium">
            <p>{parentText}</p>
            <div className="pt-2 border-t border-[#e5e0d5] text-[#5a634e] font-bold flex items-start gap-1.5">
              <span>🏡 {t.atHomeTip}:</span>
              <span>{atHomeTip}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCopyParentText}
              className="bg-white hover:bg-[#fdfcf8] text-slate-700 text-xs px-3.5 py-1.5 rounded-xl border border-[#e5e0d5] transition flex items-center gap-1.5 cursor-pointer shadow-2xs font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#5a634e]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Parent Message ✓' : 'Copy Parent Message'}</span>
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-[#e5e0d5] flex items-center justify-between">
          <button
            onClick={() => onOpenQuickObservation(student.id)}
            className="bg-[#c97b5d] hover:bg-[#b86a4c] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-2xs"
          >
            + Record New Observation
          </button>

          <button
            onClick={onClose}
            className="bg-white hover:bg-[#fdfcf8] text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-[#e5e0d5] transition cursor-pointer shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
