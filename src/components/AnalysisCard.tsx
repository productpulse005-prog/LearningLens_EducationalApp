import { useState } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { AnalysisResult, Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface AnalysisCardProps {
  key?: string;
  language: Language;
  analysis: AnalysisResult;
  onOpenIntervention: (analysis: AnalysisResult) => void;
  onRecordFeedback: (rating: 'very_useful' | 'somewhat_useful' | 'not_useful', reasons: string[]) => void;
}

export const AnalysisCard = ({
  language,
  analysis,
  onOpenIntervention,
  onRecordFeedback,
}: AnalysisCardProps) => {
  const t = TRANSLATIONS[language];
  const [feedbackGiven, setFeedbackGiven] = useState<'very_useful' | 'somewhat_useful' | 'not_useful' | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const handleFeedbackClick = (rating: 'very_useful' | 'somewhat_useful' | 'not_useful') => {
    setFeedbackGiven(rating);
    if (rating === 'not_useful') {
      setShowFeedbackModal(true);
    } else {
      onRecordFeedback(rating, []);
    }
  };

  const handleReasonSubmit = () => {
    onRecordFeedback('not_useful', selectedReasons);
    setShowFeedbackModal(false);
  };

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const reasonOptions = [
    'Too difficult for grade level',
    'Too simple / already mastered',
    'Not practical with available classroom materials',
    'Language / terminology issue',
    'Incorrect misconception hypothesis',
  ];

  return (
    <div className="bg-white border border-[#e5e0d5] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#e5e0d5]">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#f4efe6] p-2 rounded-xl border border-[#d6c9b8] text-[#5a634e]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-serif font-bold text-slate-800">
              AI Learning Analysis for <span className="text-[#c97b5d]">{analysis.studentName}</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">{analysis.concept}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-[#fcf8f2] text-slate-700 border border-[#d6c9b8] px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold">
            Confidence: {analysis.confidence.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="space-y-3.5 text-xs">
        {/* Section A: Observed Evidence */}
        <div className="bg-[#fcf8f2] border border-[#d6c9b8] p-3.5 rounded-2xl space-y-1">
          <div className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <span>{t.observedEvidence}</span>
            <span className="text-[10px] text-slate-400 font-normal lowercase">(recorded note)</span>
          </div>
          <p className="text-slate-800 leading-relaxed font-medium">"{analysis.observedEvidence}"</p>
        </div>

        {/* Section B: AI Inferred Hypothesis */}
        <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl space-y-1">
          <div className="font-bold text-emerald-900 flex items-center justify-between">
            <span>{t.inferredHypothesis}</span>
            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              Hypothesis (Not Confirmed Fact)
            </span>
          </div>
          <p className="text-emerald-950 leading-relaxed font-medium">{analysis.inferredHypothesis}</p>
        </div>

        {/* Section C: Potential Misconception if present */}
        {analysis.possibleMisconception && (
          <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl space-y-1">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <span>{t.misconceptionDetected}</span>
            </div>
            <p className="text-amber-950 font-semibold">{analysis.possibleMisconception}</p>
          </div>
        )}

        {/* Section D: Recommended Intervention */}
        <div className="bg-[#fdfcf8] border border-[#e5e0d5] p-4 rounded-2xl space-y-3">
          <div className="font-bold text-[#5a634e] flex items-center justify-between text-sm">
            <span className="font-serif">{t.recommendedIntervention}</span>
            <span className="text-[10px] bg-[#f4efe6] text-[#5a634e] border border-[#d6c9b8] px-2.5 py-0.5 rounded-full font-semibold">
              7-Min Classroom Activity
            </span>
          </div>
          <p className="text-slate-700 font-medium leading-relaxed">
            {analysis.recommendedInterventionSummary}
          </p>

          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={() => onOpenIntervention(analysis)}
              className="bg-[#5a634e] hover:bg-[#4a523f] text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>{t.viewMicroIntervention}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Validation / Feedback Mode */}
      <div className="pt-3 border-t border-[#e5e0d5] flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Was this recommendation useful?</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFeedbackClick('very_useful')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer font-semibold ${
              feedbackGiven === 'very_useful'
                ? 'bg-[#5a634e] text-white border-[#5a634e] shadow-2xs'
                : 'bg-[#fcf8f2] hover:bg-[#f4efe6] text-slate-700 border-[#e5e0d5]'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Yes</span>
          </button>
          <button
            onClick={() => handleFeedbackClick('not_useful')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer font-semibold ${
              feedbackGiven === 'not_useful'
                ? 'bg-red-700 text-white border-red-700 shadow-2xs'
                : 'bg-[#fcf8f2] hover:bg-[#f4efe6] text-slate-700 border-[#e5e0d5]'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>No</span>
          </button>
        </div>
      </div>

      {/* Negative feedback reason modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h4 className="text-base font-serif font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#c97b5d]" />
              <span>What was wrong with this AI output?</span>
            </h4>
            <p className="text-xs text-slate-500">Your feedback helps improve future classroom recommendations.</p>

            <div className="space-y-1.5 pt-1">
              {reasonOptions.map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleReason(reason)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs border transition cursor-pointer font-medium ${
                    selectedReasons.includes(reason)
                      ? 'bg-[#fcf8f2] text-[#c97b5d] border-[#c97b5d] font-bold'
                      : 'bg-white text-slate-700 border-[#e5e0d5] hover:border-slate-400'
                  }`}
                >
                  {selectedReasons.includes(reason) ? '✓ ' : '□ '} {reason}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleReasonSubmit}
                className="bg-[#5a634e] hover:bg-[#4a523f] text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-2xs"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
