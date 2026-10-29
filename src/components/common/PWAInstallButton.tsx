import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  className?: string;
  variant?: 'button' | 'compact' | 'card';
  onOpenAndroidExport?: () => void;
}

export const PWAInstallButton: React.FC<Props> = ({
  className = '',
  variant = 'button',
  onOpenAndroidExport,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running inside standalone app, show a small active badge
  if (isInstalled) {
    if (variant === 'compact') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Android App Active
        </span>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  if (variant === 'card') {
    return (
      <div className={`p-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md relative overflow-hidden ${className}`}>
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
          <Smartphone className="w-40 h-40" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Offline CBT Ready
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">Install SmartPrep on Your Phone</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-md mt-1">
              Practise without consuming your mobile data! Fast loading, full screen, works completely offline.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              Install on Android
            </button>
            {onOpenAndroidExport && (
              <button
                onClick={onOpenAndroidExport}
                className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition"
                title="View Android Studio Gradle Project"
              >
                Project Files
              </button>
            )}
          </div>
        </div>

        {/* Instructions Modal if prompt is blocked or on other devices */}
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 text-slate-800 shadow-2xl relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setShowGuideModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">How to Install SmartPrep CBT</h4>
                  <p className="text-xs text-slate-500">Android & Mobile Browser Guide</p>
                </div>
              </div>

              {isIOS ? (
                <div className="space-y-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="font-medium text-slate-800">For Apple Safari Users:</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Tap the <strong>Share</strong> icon (box with upward arrow) in the Safari bar.</li>
                    <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
                    <li>Tap <strong>Add</strong> to launch SmartPrep CBT directly from your home screen.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="font-medium text-slate-800">For Android (Chrome / Brave / Edge / Opera):</p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600">
                    <li>Tap the <strong>three dots menu (⋮)</strong> at the top right of your browser.</li>
                    <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                    <li>Confirm installation. The SmartPrep CBT APK icon will appear in your app drawer!</li>
                  </ol>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {onOpenAndroidExport && (
                  <button
                    onClick={() => {
                      setShowGuideModal(false);
                      onOpenAndroidExport();
                    }}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    View Android Studio Code & Gradle
                  </button>
                )}
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition active:scale-95 ${className}`}
        title="Install SmartPrep CBT on your phone"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 text-slate-800 shadow-2xl relative">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-base text-slate-900 mb-2">Install SmartPrep CBT</h4>
            <p className="text-xs text-slate-600 mb-3">
              Tap browser menu (<strong>⋮</strong>) and click <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong> to enjoy offline CBT practice on your Android device!
            </p>
            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
