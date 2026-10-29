import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, X, CreditCard, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types';
import { StorageService } from '../../services/storageService';

interface Props {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: UserProfile) => void;
}

export const PricingModal: React.FC<Props> = ({
  currentUser,
  isOpen,
  onClose,
  onUserUpdated,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

  if (!isOpen) return null;

  const handleActivateByPin = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    // Demo scratch-card PIN format verification (e.g. SMART-PREP-2026 or PRO-SS3)
    if (activationCode.trim().toUpperCase() === 'SMART-2026' || activationCode.trim().toUpperCase() === 'PRO') {
      const updated = { ...currentUser, isPremium: true };
      StorageService.saveCurrentUser(updated);
      onUserUpdated(updated);
      setCodeSuccess('SmartPrep Pro successfully activated! Enjoy unlimited offline CBT & AI explanations.');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setCodeError('Invalid activation PIN code. Use voucher PIN "SMART-2026" or pay online.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-800 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Transparent Nigerian Naira (₦) Plans
            </div>
            <h3 className="text-xl font-extrabold text-white">
              SmartPrep CBT Plans & Pricing
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Affordable plans built to support every Nigerian student and school.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Free Tier Card */}
            <div className="p-5 rounded-3xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Free Practice Tier</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₦0 <span className="text-xs font-normal text-slate-500">/ forever</span></div>
                <p className="text-xs text-slate-600 mt-1 mb-4">
                  Essential CBT practice for students with zero financial barrier.
                </p>

                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Core subjects practice</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Timed CBT Engine with automatic submission</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Standard explanations for all questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>JAMB UTME Subject Advisor</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <span className="block text-center text-xs font-bold text-slate-500 bg-slate-200/60 py-2 rounded-xl">
                  Current Default Plan
                </span>
              </div>
            </div>

            {/* SmartPrep Pro Tier */}
            <div className="p-5 rounded-3xl border-2 border-blue-600 bg-blue-50/50 flex flex-col justify-between relative shadow-md">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white">
                  RECOMMENDED
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">SmartPrep Pro</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₦2,500 <span className="text-xs font-normal text-slate-500">/ exam season</span></div>
                <p className="text-xs text-slate-600 mt-1 mb-4">
                  Full 2005–2026 verified archive, unlimited AI tutor & downloadable offline question sets.
                </p>

                <ul className="space-y-2 text-xs text-slate-800">
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Full 2005–2026 WAEC, NECO & JAMB Question Bank</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Unlimited AI Step-by-Step Problem Solver</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Downloadable complete offline question series</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Unlimited 4-Subject JAMB UTME Mocks</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-200">
                {currentUser.isPremium ? (
                  <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 py-2.5 rounded-xl">
                    <ShieldCheck className="w-4 h-4" /> Pro Active on Account
                  </span>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] text-slate-500 leading-tight">
                      *Payment provider integration: Ready for Paystack / Flutterwave webhook verification.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* School Scratch Card / Voucher Activation PIN */}
          {!currentUser.isPremium && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Activate with School Scratch Card or Promo Voucher:</span>
              </div>

              {codeError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{codeError}</span>
                </div>
              )}

              {codeSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{codeSuccess}</span>
                </div>
              )}

              <form onSubmit={handleActivateByPin} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 10-digit Scratch Voucher PIN (e.g. SMART-2026)"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  className="flex-1 py-2 px-3 text-xs rounded-xl border border-slate-300 uppercase tracking-widest font-mono"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Activate Pro
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Official SmartPrep CBT Subscription System</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
