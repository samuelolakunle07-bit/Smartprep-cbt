import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff, Database } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside aria-label="Connectivity Status" className="fixed bottom-16 sm:bottom-4 left-4 z-40 flex items-center gap-2 rounded-xl bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-2 text-xs font-medium shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
      <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Offline Mode — SmartPrep local CBT questions loaded</span>
      <div className="flex items-center gap-1 text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
        <Database className="w-3 h-3 text-emerald-400" />
        IndexedDB Active
      </div>
    </aside>
  );
};
