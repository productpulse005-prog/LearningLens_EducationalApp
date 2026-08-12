import { useState, FormEvent } from 'react';
import { Mic, Sparkles, X, FastForward } from 'lucide-react';
import { Language, ParticipationLevel, ReasoningLevel, Student, UnderstandingLevel } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface ObservationModalProps {
  language: Language;
  students: Student[];
  initialStudentId?: string;
  onClose: () => void;
  onSubmitObservation: (data: {
    studentId: string;
    studentName: string;
    understanding: UnderstandingLevel;
    participation: ParticipationLevel;
    reasoning: ReasoningLevel;
    note: string;
  }) => void;
}

export const ObservationModal = ({
  language,
  students,
  initialStudentId,
  onClose,
  onSubmitObservation,
}: ObservationModalProps) => {
  const t = TRANSLATIONS[language];

  const defaultStudent = students.find((s) => s.id === initialStudentId) || students[0];
  const [selectedStudentId, setSelectedStudentId] = useState(defaultStudent?.id || '');
  const [understanding, setUnderstanding] = useState<UnderstandingLevel>('struggling');
  const [participation, setParticipation] = useState<ParticipationLevel>('active');
  const [reasoning, setReasoning] = useState<ReasoningLevel>('misconception_detected');
  const [note, setNote] = useState('Thinks 1/4 is larger than 1/2 because 4 is bigger than 2.');
  const [isListening, setIsListening] = useState(false);

  const [speechError, setSpeechError] = useState<string | null>(null);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const presets = [
    'Thinks 1/4 is larger than 1/2 because 4 is bigger than 2.',
    'Confuses numerator (top number) and denominator (bottom number).',
    'Folded paper strip correctly into 4 equal parts and explained 1/4.',
    'Can solve fraction comparison visually but stumbles on written symbols.',
    'Missed yesterday session; needs foundational paper folding check.',
  ];

  const handleVoiceInput = () => {
    setSpeechError(null);
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechError('Voice recognition is not supported in this browser environment. You can select preset observation shortcuts below or type manually.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNote(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (err) {
      console.warn('Voice recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    onSubmitObservation({
      studentId: selectedStudent.id,
      studentName: selectedStudent.firstName,
      understanding,
      participation,
      reasoning,
      note,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e5e0d5]">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#5a634e]" />
              <span>Record Learning Observation (&lt;15s)</span>
            </h3>
            <p className="text-xs text-slate-500">Quick structured input for instant AI analysis</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-[#fcf8f2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Student */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-[#fdfcf8] border border-[#e5e0d5] rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#5a634e] cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} ({s.studentCode || 'S'}) • {s.status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Understanding Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Understanding Signal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUnderstanding('struggling')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                  understanding === 'struggling'
                    ? 'bg-red-100 text-red-900 border-red-400 shadow-2xs'
                    : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5] hover:border-slate-400'
                }`}
              >
                Struggling 🔴
              </button>
              <button
                type="button"
                onClick={() => setUnderstanding('developing')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                  understanding === 'developing'
                    ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-2xs'
                    : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5] hover:border-slate-400'
                }`}
              >
                Developing 🟡
              </button>
              <button
                type="button"
                onClick={() => setUnderstanding('strong')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                  understanding === 'strong'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 shadow-2xs'
                    : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5] hover:border-slate-400'
                }`}
              >
                Strong 🟢
              </button>
              <button
                type="button"
                onClick={() => setUnderstanding('unclear')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                  understanding === 'unclear'
                    ? 'bg-slate-200 text-slate-800 border-slate-400 shadow-2xs'
                    : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5] hover:border-slate-400'
                }`}
              >
                Unclear ⚪
              </button>
            </div>
          </div>

          {/* Reasoning Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reasoning Signal
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setReasoning('misconception_detected')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer font-semibold ${
                  reasoning === 'misconception_detected'
                    ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                    : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5]'
                }`}
              >
                ⚡ Misconception Detected
              </button>
              <button
                type="button"
                onClick={() => setReasoning('needs_prompting')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer font-semibold ${
                  reasoning === 'needs_prompting'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                    : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5]'
                }`}
              >
                💬 Needs Prompting
              </button>
              <button
                type="button"
                onClick={() => setReasoning('correct_no_explanation')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer font-semibold ${
                  reasoning === 'correct_no_explanation'
                    ? 'bg-teal-100 text-teal-900 border-teal-400 font-bold'
                    : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5]'
                }`}
              >
                ✓ Solves (Cannot Explain)
              </button>
              <button
                type="button"
                onClick={() => setReasoning('explains')}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer font-semibold ${
                  reasoning === 'explains'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                    : 'bg-[#fdfcf8] text-slate-600 border-[#e5e0d5]'
                }`}
              >
                ★ Explains Reasoning Clearly
              </button>
            </div>
          </div>

          {/* Short Teacher Note & Voice Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                {t.teacherNote}
              </label>
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition cursor-pointer font-semibold ${
                  isListening
                    ? 'bg-red-100 text-red-800 border-red-400 animate-pulse'
                    : 'bg-[#fcf8f2] text-slate-700 border-[#e5e0d5] hover:bg-[#f4efe6]'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-[#5a634e]" />
                <span>{isListening ? 'Listening...' : t.voiceInput}</span>
              </button>
            </div>

            {speechError && (
              <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-xl mb-2">
                {speechError}
              </p>
            )}

            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.notePlaceholder}
              className="w-full bg-[#fdfcf8] border border-[#e5e0d5] rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#5a634e]"
            />

            {/* Quick Presets */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <FastForward className="w-3 h-3 text-[#5a634e]" />
                <span>Tap 1-click observation shortcut:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNote(p)}
                    className="text-[11px] bg-[#fcf8f2] hover:bg-[#f4efe6] text-slate-700 border border-[#d6c9b8] px-2.5 py-1 rounded-lg text-left transition cursor-pointer"
                  >
                    "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5e0d5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#5a634e] hover:bg-[#4a523f] text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-2xs transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.saveObservation}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
