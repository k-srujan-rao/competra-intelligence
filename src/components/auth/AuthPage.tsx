import React, { useState } from 'react';
import { authService, AuthUser } from '../../services/authService';
import {
  Brain,
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface AuthPageProps {
  onSuccess: (user: AuthUser) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegistering) {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid business email.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setIsLoading(true);
      try {
        const user = await authService.register(name, email, password, organization);
        onSuccess(user);
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed.');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }

      setIsLoading(true);
      try {
        const user = await authService.login(email, password);
        onSuccess(user);
      } catch (err: any) {
        setErrorMessage(err.message || 'Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await authService.demoLogin();
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      return;
    }
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen bg-[#060709] flex flex-col lg:flex-row text-stone-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* LEFT SECTION: Visual Brand Experience */}
      <div className="relative flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#23211a] bg-gradient-to-br from-[#0a0b10] via-[#08090d] to-[#060709]">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-yellow-600/10 blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-600 text-stone-950 shadow-xl shadow-amber-500/30 font-black text-xl tracking-tighter border border-amber-300/40">
              C
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">COMPETRA</span>
                <span className="rounded-md bg-amber-500/15 border border-amber-500/35 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                  AI PLATFORM
                </span>
              </div>
              <p className="text-xs text-amber-200/60 mt-0.5 tracking-wide">
                Enterprise Competitive Intelligence & Hindsight Memory
              </p>
            </div>
          </div>
        </div>

        {/* Center: Animated Intelligence Visual */}
        <div className="relative z-10 my-10 lg:my-auto space-y-8 max-w-xl">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Remember Every Move.{' '}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Understand Every Strategy.
              </span>
            </h1>
            <p className="mt-4 text-sm text-stone-300 leading-relaxed max-w-lg">
              Autonomous competitive intelligence that tracks rival pricing maneuvers, product launches, and strategic shifts across multiple industries with longitudinal Hindsight memory.
            </p>
          </div>

          {/* Interactive Intelligence Visual Widget */}
          <div className="rounded-2xl border border-[#23211a] bg-[#0b0c10]/90 p-5 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-[#23211a] pb-3">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Brain className="h-4 w-4 text-amber-400 animate-pulse" />
                Hindsight Cognitive Telemetry
              </span>
              <span className="text-amber-400 font-mono text-[11px]">ACTIVE MULTI-BANK</span>
            </div>

            {/* Simulated Live Flow Nodes */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl border border-amber-500/30 bg-[#12141c] p-2.5">
                <div className="text-[10px] font-bold text-amber-400 uppercase font-mono">Stage 01</div>
                <div className="font-bold text-white mt-1">TELEMETRY</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Verified URLs</div>
              </div>

              <div className="rounded-xl border border-yellow-500/30 bg-[#151722] p-2.5">
                <div className="text-[10px] font-bold text-yellow-400 uppercase font-mono">Stage 02</div>
                <div className="font-bold text-white mt-1">HINDSIGHT</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Retain & Recall</div>
              </div>

              <div className="rounded-xl border border-amber-400/30 bg-[#171a25] p-2.5">
                <div className="text-[10px] font-bold text-amber-300 uppercase font-mono">Stage 03</div>
                <div className="font-bold text-white mt-1">SYNTHESIS</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Executive Move</div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-[#23211a] bg-[#0b0c10] p-3 text-xs">
              <TrendingUp className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Price Intelligence</span>
                <span className="text-[10px] text-stone-400">SKU delta tracking</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-[#23211a] bg-[#0b0c10] p-3 text-xs">
              <Brain className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Longitudinal Memory</span>
                <span className="text-[10px] text-stone-400">Hindsight recall</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-[#23211a] bg-[#0b0c10] p-3 text-xs">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Wargame Simulator</span>
                <span className="text-[10px] text-stone-400">Rival reactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Assurance */}
        <div className="relative z-10 text-xs text-stone-500 flex items-center gap-2 pt-4">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>Enterprise End-to-End Encryption • PBKDF2 Security • Obsidian Memory Partitions</span>
        </div>
      </div>

      {/* RIGHT SECTION: Premium Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#060709]">
        <div className="w-full max-w-md space-y-6">
          {/* Form Header */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isRegistering ? 'Enterprise Registration' : 'Strategic Console Login'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {isRegistering ? 'Create your analyst profile' : 'Sign in to COMPETRA AI'}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5">
              {isRegistering
                ? 'Join your organization’s competitive intelligence workspace.'
                : 'Access live competitive telemetry, price delta tracking, and Hindsight memory.'}
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="rounded-xl border border-amber-500/35 bg-gradient-to-r from-amber-500/15 to-yellow-500/5 p-3.5 flex items-center justify-between gap-3 shadow-md shadow-amber-500/10">
            <div>
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Instant Evaluator / Demo Access</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Pre-configured Chief Strategy Officer role with verified telemetry
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="shrink-0 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1.5 text-xs font-bold text-stone-950 shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer disabled:opacity-50"
            >
              1-Click Demo
            </button>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Srujan Rao"
                      className="w-full rounded-xl border border-[#23211a] bg-[#0b0c10] pl-10 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                    Enterprise Organization
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Global Tech Strategy Unit"
                      className="w-full rounded-xl border border-[#23211a] bg-[#0b0c10] pl-10 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Work Email <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@organization.com"
                  className="w-full rounded-xl border border-[#23211a] bg-[#0b0c10] pl-10 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Password <span className="text-amber-400">*</span>
                </label>
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotSent(false);
                      setForgotEmail(email);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#23211a] bg-[#0b0c10] pl-10 pr-10 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Confirm Password <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-[#23211a] bg-[#0b0c10] pl-10 pr-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>
            )}

            {!isRegistering && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#23211a] bg-[#0b0c10] text-amber-500 focus:ring-amber-400 cursor-pointer accent-amber-500"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-stone-400 cursor-pointer">
                  Remember this workstation session
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 py-3 text-xs font-bold text-stone-950 shadow-xl shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : isRegistering ? 'Register Analyst Profile' : 'Sign In to Workspace'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Toggle between Login and Registration */}
          <div className="pt-2 text-center text-xs text-stone-400">
            {isRegistering ? (
              <span>
                Already have an enterprise account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setErrorMessage('');
                  }}
                  className="font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Need access for your intelligence unit?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMessage('');
                  }}
                  className="font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForgotPassword(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#23211a] bg-[#0b0c10] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Reset Password Credentials</h3>
            <p className="text-xs text-stone-400">
              Enter your registered business email and we will dispatch a secure credential reset link.
            </p>

            {forgotSent ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Password reset token dispatched to <strong>{forgotEmail}</strong>.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="analyst@organization.com"
                  className="w-full rounded-xl border border-[#23211a] bg-[#060709] px-3.5 py-2.5 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-2.5 text-xs font-bold text-stone-950 hover:from-amber-300 hover:to-amber-400 transition-colors cursor-pointer"
                >
                  Dispatch Reset Link
                </button>
              </form>
            )}

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-xs text-stone-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
