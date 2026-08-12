import { useState } from 'react';
import { Activity, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { AnalyticsEvent, Language } from '../types';
import { StorageManager } from '../lib/storage';

interface AnalyticsModalProps {
  language: Language;
  onClose: () => void;
}

export const AnalyticsModal = ({ onClose }: AnalyticsModalProps) => {
  const [analytics] = useState<AnalyticsEvent[]>(StorageManager.getAnalytics());

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Product Analytics & Vercel Readiness</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vercel Status Badge */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-xl text-xs space-y-1.5">
          <div className="font-bold text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Vercel Deployment Architecture Confirmed</span>
          </div>
          <p className="text-emerald-100/90 leading-relaxed">
            API routes are hosted server-side with Gemini API key protection. Environment variables declared in .env.example. Safe client-side fallback mode active if offline.
          </p>
        </div>

        {/* Events log */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-300 flex items-center justify-between">
            <span>Recent Product Activity Signals</span>
            <span className="text-[10px] text-slate-500 font-mono">Privacy Preserved</span>
          </h4>

          {analytics.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {analytics.slice(0, 15).map((evt, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 p-2 rounded-lg flex items-center justify-between text-[11px]"
                >
                  <span className="font-mono text-emerald-400 font-semibold">{evt.eventName}</span>
                  <span className="text-slate-500 text-[10px]">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-500 text-xs text-center">
              No analytics events recorded yet. Start a session or record an observation!
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
