import { useState, ChangeEvent, FormEvent } from 'react';
import { Camera, Compass, Sparkles, Upload, X } from 'lucide-react';
import { Language, RealWorldContextAnalysis } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface RealWorldContextModalProps {
  language: Language;
  onClose: () => void;
  onAnalyzeContext: (objectsText: string, imageBase64?: string) => Promise<RealWorldContextAnalysis>;
}

export const RealWorldContextModal = ({
  language,
  onClose,
  onAnalyzeContext,
}: RealWorldContextModalProps) => {
  const t = TRANSLATIONS[language];
  const [objectsText, setObjectsText] = useState('bicycle, bucket, rope, measuring cup, paper');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<RealWorldContextAnalysis | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await onAnalyzeContext(objectsText, selectedImage);
      setAnalysisResult(res);
    } catch (err: any) {
      console.error('Error analyzing context objects:', err);
      setError(err?.message || "You've reached the demo usage limit. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#e5e0d5] rounded-3xl p-6 sm:p-7 max-w-xl w-full space-y-5 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e5e0d5]">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#f4efe6] p-2.5 rounded-2xl border border-[#d6c9b8] text-[#c97b5d]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-800">{t.realWorldContext}</h3>
              <p className="text-xs text-slate-500 font-medium">Contextual learning engine using everyday objects</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-[#fcf8f2] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo upload option */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              {t.objectUpload} (Optional Photo)
            </label>
            {/* Privacy Warning Banner */}
            <div className="bg-[#fcf8f2] border border-[#e5e0d5] rounded-xl p-2.5 text-[11px] text-slate-600 flex items-start gap-2">
              <span className="text-[#c97b5d] font-bold shrink-0">🔒 Privacy Notice:</span>
              <span>Please snap or upload photos of classroom objects, blackboards, books, or learning materials only. Avoid capturing identifiable faces of children.</span>
            </div>

            {error && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs flex items-center gap-2">
                <span>⚠️ {error}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="bg-[#fdfcf8] hover:bg-[#fcf8f2] text-slate-700 border border-[#e5e0d5] hover:border-[#5a634e] px-3.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition flex items-center gap-2 shadow-2xs">
                <Camera className="w-4 h-4 text-[#c97b5d]" />
                <span>Choose Photo / Snap</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {selectedImage && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#c97b5d]">
                  <img src={selectedImage} alt="Uploaded classroom context" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(undefined)}
                    className="absolute top-0 right-0 bg-slate-900/80 text-white text-[10px] p-0.5 rounded-bl cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Type objects */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              {t.enterObjects}
            </label>
            <input
              type="text"
              value={objectsText}
              onChange={(e) => setObjectsText(e.target.value)}
              placeholder={t.objectsPlaceholder}
              className="w-full bg-[#fdfcf8] border border-[#e5e0d5] rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#5a634e]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5a634e] hover:bg-[#4a523f] text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-2xs transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Gemini AI is analyzing objects...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.analyzeObjects}</span>
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {analysisResult && (
          <div className="space-y-3.5 pt-3.5 border-t border-[#e5e0d5] text-xs">
            <div className="font-bold text-slate-800 font-serif flex items-center justify-between text-sm">
              <span>Educational Curriculum Connections</span>
              <span className="text-[10px] text-[#c97b5d] bg-[#fcf8f2] border border-[#d6c9b8] px-2.5 py-0.5 rounded-full font-sans font-semibold">
                Genuine Defensible Connections
              </span>
            </div>

            <div className="space-y-3">
              {analysisResult.educationalConnections.map((conn, idx) => (
                <div
                  key={idx}
                  className="bg-[#fdfcf8] border border-[#e5e0d5] p-4 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#c97b5d] font-serif text-sm">{conn.objectName}</span>
                    <span className="text-[10px] bg-[#fcf8f2] text-slate-700 border border-[#d6c9b8] px-2.5 py-0.5 rounded-full font-mono font-medium">
                      {conn.subject} • {conn.concept}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-normal">{conn.explanation}</p>

                  <div className="bg-[#fcf8f2] border border-[#d6c9b8] p-3 rounded-xl text-slate-800">
                    <span className="font-bold block text-[11px] text-[#5a634e]">5-Minute Classroom Activity:</span>
                    <p className="text-slate-700 mt-0.5 font-medium">{conn.classroomActivity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
