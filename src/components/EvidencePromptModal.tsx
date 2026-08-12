import { useState, FormEvent } from 'react';
import { HelpCircle, Sparkles, X } from 'lucide-react';

interface EvidencePromptModalProps {
  studentName: string;
  question: string;
  options: string[];
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

export const EvidencePromptModal = ({
  studentName,
  question,
  options,
  onClose,
  onSelectOption,
}: EvidencePromptModalProps) => {
  const [customText, setCustomText] = useState('');

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (customText.trim()) {
      onSelectOption(customText.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Observation Evidence Needed</h3>
              <p className="text-xs text-slate-400">AI requires specific evidence to detect misconceptions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
          <p className="text-xs text-amber-200 font-bold leading-relaxed">
            "{question}"
          </p>
          <p className="text-[11px] text-amber-300/80">
            Please tap the specific behavior or error observed for <span className="underline">{studentName}</span>:
          </p>
        </div>

        <div className="space-y-2 text-xs">
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onSelectOption(opt)}
              className="w-full text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 p-3 rounded-xl transition cursor-pointer text-slate-200 font-medium flex items-center justify-between group"
            >
              <span>□ {opt}</span>
              <span className="text-emerald-400 text-[11px] opacity-0 group-hover:opacity-100 transition font-bold">Select ✦</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-800 space-y-2 text-xs">
          <label className="block text-slate-400 font-medium">Or type specific custom observation:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Wrote 3/1 instead of 1/3"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
