import React from 'react';
import { X, GraduationCap, ShieldCheck, Heart, Sparkles, Smartphone, Globe, Code } from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenAndroidExport: () => void;
}

export const AboutSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenAndroidExport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 border border-white/20">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">SmartPrep CBT</h3>
              <p className="text-xs text-blue-200">
                Prepare Smart. Practise More. Pass with Confidence.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
          {/* Mission */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 leading-relaxed">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Empowering Nigerian SS3 Candidates
            </h4>
            <p className="text-xs text-slate-600">
              SmartPrep CBT is purpose-built for Senior Secondary School 3 (SS3) students and private candidates preparing for the West African Senior School Certificate Examination (WAEC SSCE), National Examinations Council (NECO SSCE), and Joint Admissions and Matriculation Board (JAMB UTME) in Nigeria.
            </p>
          </div>

          {/* Key Features */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Core Capabilities:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                ✅ 2005 – 2026 Question Archive
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                ✅ 45+ SS3 Secondary Subjects
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                ✅ 100% Offline Practice Support
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                ✅ Gemini-Powered AI Step-by-Step Tutor
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                ✅ JAMB 4-Subject Combination Advisor
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                ✅ On-Screen CBT Exam Calculator
              </div>
            </div>
          </div>

          {/* Install and Android packaging */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
            <div>
              <h5 className="font-bold text-blue-950 text-xs sm:text-sm">Install on Android Device</h5>
              <p className="text-[11px] text-blue-800">Launch with zero latency without browser bars.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenAndroidExport();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white text-blue-800 text-xs font-semibold border border-blue-300 hover:bg-blue-100"
              >
                Project Code
              </button>
              <PWAInstallButton />
            </div>
          </div>

          {/* Legal and Copyright Information (Strictly as requested) */}
          <div className="pt-4 border-t border-slate-200 text-center space-y-1">
            <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
              SmartPrep CBT Version 2.5.0
            </div>
            <div className="text-xs font-bold text-slate-700">
              Copyright © 2026 Olakunle Olalekan. All rights reserved.
            </div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              All official past questions, syllabuses, and trademarks belong to their respective examination bodies (WAEC, NECO, and JAMB).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
