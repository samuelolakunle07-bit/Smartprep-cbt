import React from 'react';
import { ExamBody, UserProfile } from '../../types';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Settings,
  Smartphone,
  Crown,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface Props {
  currentExam: ExamBody;
  onSelectExam: (exam: ExamBody) => void;
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenPricing: () => void;
  onOpenAndroidExport: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentExam,
  onSelectExam,
  currentUser,
  onOpenAuth,
  onOpenAdmin,
  onOpenPricing,
  onOpenAndroidExport,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl text-blue-900 tracking-tight leading-none">
                SmartPrep <span className="text-emerald-600">CBT</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                SS3 • 2026
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 leading-tight mt-0.5">
              Prepare Smart. Practise More. Pass with Confidence.
            </p>
          </div>
        </div>

        {/* Center Exam Body Pill Switcher */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          {(['WAEC', 'NECO', 'JAMB'] as ExamBody[]).map((exam) => (
            <button
              key={exam}
              onClick={() => onSelectExam(exam)}
              className={`px-3 py-1.5 rounded-xl transition ${
                currentExam === exam
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {exam}
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Connectivity Status Indicator */}
          <div
            className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title={isOnline ? 'Online - Real-time AI connected' : 'Offline - Local questions active'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Android Export & Project Files Button */}
          <button
            onClick={onOpenAndroidExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            title="Inspect Android Gradle Project & APK Instructions"
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span className="hidden lg:inline">Android APK</span>
          </button>

          {/* Install Button */}
          <PWAInstallButton />

          {/* Pricing Button */}
          <button
            onClick={onOpenPricing}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition"
          >
            <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{currentUser.isPremium ? 'Pro Member' : 'Upgrade'}</span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition"
            title="User Profile & Account"
          >
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {currentUser.fullName.charAt(0)}
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-slate-800 pr-1">
              {currentUser.fullName.split(' ')[0]}
            </span>
          </button>

          {/* Admin Portal Trigger */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Administrator Portal"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
