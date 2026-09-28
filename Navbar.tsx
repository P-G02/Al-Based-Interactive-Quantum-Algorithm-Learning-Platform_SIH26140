import React from 'react';
import type { NavigationPage, UserProgress } from '../types';
import { 
  Atom, 
  LayoutDashboard, 
  BookOpen, 
  FlaskConical, 
  Bot, 
  Trophy, 
  BarChart3, 
  Users, 
  Flame, 
  Zap, 
  Sparkles,
  Key,
  Home,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  progress: UserProgress;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onOpenAPIModal: () => void;
  currentRole: 'student' | 'instructor';
  onToggleRole: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  progress,
  isDemoMode,
  onToggleDemoMode,
  onOpenAPIModal,
  currentRole,
  onToggleRole
}) => {

  const navItems: { id: NavigationPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'lab', label: 'Quantum Lab', icon: FlaskConical },
    { id: 'tutor', label: 'AI Tutor', icon: Bot },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'instructor', label: 'Instructor', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#090d16]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 transition-all group-hover:scale-105 group-hover:shadow-cyan-500/40">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0b1120]">
              <Atom className="h-6 w-6 text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                Q<span className="text-cyan-400">Nova</span>
              </span>
              <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                SIH-26140
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
              AI Quantum Learning Lab
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-slate-900/60 p-1 border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Stats & Controls */}
        <div className="flex items-center gap-3">
          
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/30 px-2.5 py-1 text-xs text-amber-400 font-semibold" title="Learning Streak">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500/20 animate-pulse" />
              <span>{progress.streak}d Streak</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 px-2.5 py-1 text-xs text-purple-300 font-semibold" title="Level & XP">
              <Zap className="h-4 w-4 text-purple-400" />
              <span>Lvl {progress.level} ({progress.xp} XP)</span>
            </div>
          </div>

          {/* Role Switcher (Student vs Instructor) */}
          <button
            onClick={onToggleRole}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
            title="Switch User Role"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="capitalize">{currentRole}</span>
          </button>

          {/* Demo Mode Switch */}
          <button
            onClick={onToggleDemoMode}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
              isDemoMode
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Demo Mode with seeded student data"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Demo Mode</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenAPIModal}
            className="flex items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
            title="Configure AI Provider & Keys"
          >
            <Key className="h-4 w-4" />
          </button>
        </div>

      </div>

      <div className="flex md:hidden overflow-x-auto border-t border-slate-800 bg-[#090d16] px-2 py-1.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
                isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
