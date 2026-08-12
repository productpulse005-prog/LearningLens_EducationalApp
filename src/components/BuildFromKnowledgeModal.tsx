import { useState, FormEvent } from 'react';
import { Lightbulb, Sparkles, X, MessageSquareQuote } from 'lucide-react';
import { BuildFromKnowledgeRecommendation, Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface BuildFromKnowledgeModalProps {
  language: Language;
  onClose: () => void;
  onGenerateBridge: (childExperience: string, formalConcept: string) => Promise<BuildFromKnowledgeRecommendation>;
}

export const BuildFromKnowledgeModal = ({
  language,
  onClose,
  onGenerateBridge,
}: BuildFromKnowledgeModalProps) => {
  const t = TRANSLATIONS[language];
  const [childExperience, setChildExperience] = useState('Farming & dividing land among harvest workers');
  const [formalConcept, setFormalConcept] = useState('Fractions & Equal Divisions');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BuildFromKnowledgeRecommendation | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await onGenerateBridge(childExperience, formalConcept);
      setResult(res);
    } catch (err: any) {
      console.error('Error generating bridge:', err);
      setError(err?.message || "You've reached the demo usage limit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const experiencePresets = [
    'Farming & dividing land among harvest workers',
    'Sharing rotis / sweets with siblings at home',
    'Counting coins at local weekly market stall',
    'Measuring rope & timber for hut construction',
    'Playing gilli-danda / marbles distance scoring',
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e5e0d5]">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#f4efe6] p-2.5 rounded-2xl border border-[#d6c9b8] text-[#5a634e]">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-800">{t.buildKnowledge}</h3>
              <p className="text-xs text-slate-500 font-medium">Bridge lived experience into formal concepts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-[#fcf8f2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Child's Out-of-School Life Experience
            </label>
            <input
              type="text"
              required
              value={childExperience}
              onChange={(e) => setChildExperience(e.target.value)}
              className="w-full bg-[#fdfcf8] border border-[#e5e0d5] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#5a634e]"
            />

            <div className="flex flex-wrap gap-1.5 mt-2">
              {experiencePresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setChildExperience(p)}
                  className="text-[10px] bg-[#fcf8f2] hover:bg-[#f4efe6] text-slate-700 border border-[#d6c9b8] px-2.5 py-1 rounded-lg transition cursor-pointer font-medium"
                >
                  • {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Formal Curriculum Concept
            </label>
            <input
              type="text"
              required
              value={formalConcept}
              onChange={(e) => setFormalConcept(e.target.value)}
              className="w-full bg-[#fdfcf8] border border-[#e5e0d5] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#5a634e]"
            />
          </div>

          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs flex items-center gap-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5a634e] hover:bg-[#4a523f] text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-2xs transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Gemini AI is building learning bridge...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Learning Bridge ✦</span>
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="space-y-3.5 pt-3.5 border-t border-[#e5e0d5] text-xs">
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
              <div className="font-bold text-emerald-950 font-serif text-sm">Learning Bridge</div>
              <p className="text-emerald-900 leading-relaxed font-medium">{result.learningBridge}</p>
            </div>

            <div className="bg-[#fdfcf8] border border-[#e5e0d5] p-4 rounded-2xl space-y-2">
              <div className="font-bold text-[#5a634e] flex items-center gap-1.5 font-serif text-sm">
                <MessageSquareQuote className="w-4 h-4 text-[#c97b5d]" />
                <span>Sample Classroom Dialogue</span>
              </div>
              <pre className="text-slate-800 whitespace-pre-wrap font-sans text-xs leading-relaxed bg-[#fcf8f2] p-3 rounded-xl border border-[#d6c9b8] font-medium">
                {result.sampleDialogue}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
