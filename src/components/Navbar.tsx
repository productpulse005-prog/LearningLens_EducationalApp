import { Sparkles, Languages, RotateCcw, ShieldCheck, School, BarChart3 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../lib/translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onResetDemo: () => void;
  onOpenAnalytics: () => void;
}

export const Navbar = ({ language, onLanguageChange, onResetDemo, onOpenAnalytics }: NavbarProps) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="bg-white text-slate-800 border-b border-[#e5e0d5] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#5a634e] rounded-xl flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-[#5a634e] font-serif italic">{t.appName}</h1>
              <span className="bg-[#5a634e]/10 text-[#5a634e] border border-[#5a634e]/20 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5a634e]" />
                Teacher-First AI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Demo Badge & Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Demo Tag */}
          <div className="bg-[#fcf8f2] border border-[#d6c9b8] text-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium shadow-2xs">
            <School className="w-3.5 h-3.5 text-[#c97b5d]" />
            <span>Grade 5 Math (Marathi/English)</span>
          </div>

          {/* Reset Demo */}
          <button
            onClick={onResetDemo}
            className="bg-white hover:bg-[#f8f6f0] text-slate-700 px-3 py-1.5 rounded-xl border border-[#e5e0d5] transition flex items-center gap-1.5 font-medium cursor-pointer shadow-2xs"
            title="Reset to initial demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{t.resetDemo}</span>
          </button>

          {/* Analytics button */}
          <button
            onClick={onOpenAnalytics}
            className="bg-white hover:bg-[#f8f6f0] text-slate-700 px-3 py-1.5 rounded-xl border border-[#e5e0d5] transition flex items-center gap-1.5 font-medium cursor-pointer shadow-2xs"
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#5a634e]" />
            <span>Analytics & Feedback</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#fdfcf8] p-1 rounded-xl border border-[#e5e0d5]">
            <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => onLanguageChange('mr')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                language === 'mr' ? 'bg-[#5a634e] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                language === 'hi' ? 'bg-[#5a634e] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                language === 'en' ? 'bg-[#5a634e] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

