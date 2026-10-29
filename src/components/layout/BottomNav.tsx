import React from 'react';
import { Home, BookOpen, Sparkles, FileText, BarChart2 } from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: 'dashboard' | 'practice' | 'topic' | 'jamb_advisor' | 'history') => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'practice', label: 'Past Qs', icon: BookOpen },
    { id: 'topic', label: 'Topics', icon: Sparkles },
    { id: 'jamb_advisor', label: 'JAMB', icon: FileText },
    { id: 'history', label: 'Results', icon: BarChart2 },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id as any)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              isActive
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
