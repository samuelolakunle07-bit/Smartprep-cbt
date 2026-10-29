import React, { useState } from 'react';
import { UserProfile, ExamBody } from '../../types';
import { StorageService, DEFAULT_GUEST_USER } from '../../services/storageService';
import { User, Lock, Mail, BookOpen, GraduationCap, X, Check, AlertCircle } from 'lucide-react';

interface Props {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUserChange: (user: UserProfile) => void;
}

export const AuthModal: React.FC<Props> = ({
  currentUser,
  isOpen,
  onClose,
  onUserChange,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>('profile');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [classLevel, setClassLevel] = useState<'SS1' | 'SS2' | 'SS3' | 'Remedial/External'>('SS3');
  const [preferredExam, setPreferredExam] = useState<ExamBody>('JAMB');
  const [intendedCourse, setIntendedCourse] = useState('Medicine and Surgery');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Simple client-side pseudo-hash simulation for educational demo (never plain text)
  const hashPassword = (pwd: string) => {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      hash = (hash << 5) - hash + pwd.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(16);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!fullName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const allUsers = StorageService.getAllUsers();
    if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setErrorMessage('An account with this email address already exists. Please log in.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName,
      email,
      classLevel,
      preferredExam,
      intendedCourse,
      isPremium: false,
      avatarSeed: fullName.replace(/\s+/g, '').toLowerCase(),
      registeredDate: new Date().toISOString(),
    };

    allUsers.push({ ...newUser, passwordHash: hashPassword(password) });
    StorageService.saveAllUsers(allUsers);
    StorageService.saveCurrentUser(newUser);
    onUserChange(newUser);
    setSuccessMessage('Registration successful! Welcome to SmartPrep CBT.');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const allUsers = StorageService.getAllUsers();
    const targetHash = hashPassword(password);
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === targetHash
    );

    if (found) {
      const userProfile: UserProfile = {
        id: found.id,
        fullName: found.fullName,
        email: found.email,
        classLevel: found.classLevel,
        preferredExam: found.preferredExam,
        intendedCourse: found.intendedCourse,
        isPremium: found.isPremium,
        avatarSeed: found.avatarSeed,
        registeredDate: found.registeredDate,
      };
      StorageService.saveCurrentUser(userProfile);
      onUserChange(userProfile);
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMessage('Invalid email or password. Please verify your credentials.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      fullName: fullName || currentUser.fullName,
      classLevel,
      preferredExam,
      intendedCourse,
    };
    StorageService.saveCurrentUser(updated);
    onUserChange(updated);
    setSuccessMessage('Profile settings updated successfully!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleLogout = () => {
    StorageService.saveCurrentUser(DEFAULT_GUEST_USER);
    onUserChange(DEFAULT_GUEST_USER);
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
              Student Account System
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {mode === 'login' ? 'Candidate Login' : mode === 'register' ? 'Register Free Account' : 'Student Profile Settings'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* REGISTER MODE */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ibrahim Adebayo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Class / Level</label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="SS3">SS3 (Senior Secondary 3)</option>
                    <option value="SS2">SS2</option>
                    <option value="SS1">SS1</option>
                    <option value="Remedial/External">Remedial / External Candidate</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Exam</label>
                  <select
                    value={preferredExam}
                    onChange={(e) => setPreferredExam(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="JAMB">JAMB UTME</option>
                    <option value="WAEC">WAEC SSCE</option>
                    <option value="NECO">NECO SSCE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Intended Tertiary Course</label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Engineering"
                  value={intendedCourse}
                  onChange={(e) => setIntendedCourse(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                Create Account & Start Practising
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Already have an account? Log In
                </button>
              </div>
            </form>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                Log In to SmartPrep CBT
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Create New Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    StorageService.saveCurrentUser(DEFAULT_GUEST_USER);
                    onUserChange(DEFAULT_GUEST_USER);
                    onClose();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Continue as Guest
                </button>
              </div>
            </form>
          )}

          {/* PROFILE SETTINGS MODE */}
          {mode === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{currentUser.fullName}</h4>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Examination Body</label>
                <select
                  value={preferredExam}
                  onChange={(e) => setPreferredExam(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="JAMB">JAMB UTME</option>
                  <option value="WAEC">WAEC SSCE</option>
                  <option value="NECO">NECO SSCE</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Degree / Course</label>
                <input
                  type="text"
                  value={intendedCourse}
                  onChange={(e) => setIntendedCourse(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
              >
                Save Changes
              </button>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Switch User
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Log Out
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
