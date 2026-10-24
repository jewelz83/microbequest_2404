import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Microscope, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const LoginPage = () => {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/game-home-dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error?.message || 'Sign in failed. Please check your credentials.');
      } else {
        navigate('/game-home-dashboard', { replace: true });
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (password?.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email?.split('@')?.[0] }
        }
      });
      if (error) {
        setErrorMsg(error?.message || 'Sign up failed. Please try again.');
      } else if (data?.user) {
        navigate('/parent-setup-flow', { replace: true });
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-950 to-purple-950">
        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-purple-900 flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-6 pb-2">
        <Link
          to="/game-home-dashboard"
          className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200 font-semibold text-sm"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/50">
                <Microscope size={32} color="white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">MicrobeQuest</h1>
            <p className="text-purple-300 text-sm mt-1">Scientific Discovery for Young Explorers</p>
          </div>

          {/* Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            {/* Tab switcher */}
            <div className="flex">
              <button
                onClick={() => switchMode('signin')}
                className={`flex-1 py-4 text-sm font-bold transition-all duration-200 ${
                  mode === 'signin' ?'bg-yellow-400 text-purple-900' :'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode('signup')}
                className={`flex-1 py-4 text-sm font-bold transition-all duration-200 ${
                  mode === 'signup' ?'bg-yellow-400 text-purple-900' :'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-1">
                {mode === 'signin' ? 'Welcome back!' : 'Join MicrobeQuest'}
              </h2>
              <p className="text-purple-300 text-sm mb-6">
                {mode === 'signin' ?'Sign in to continue your microbiology adventure.' :'Create a free account and start exploring the microscopic world.'}
              </p>

              {/* Error / Success messages */}
              {errorMsg && (
                <div className="mb-4 px-4 py-3 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-sm">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 px-4 py-3 bg-green-500/20 border border-green-400/40 rounded-lg text-green-200 text-sm">
                  {successMsg}
                </div>
              )}

              <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                {/* Display name (sign up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-purple-200 text-sm font-semibold mb-1.5">
                      Display Name <span className="text-purple-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e?.target?.value)}
                      placeholder="Young Scientist"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60 transition-all duration-200 text-sm"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e?.target?.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60 transition-all duration-200 text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-purple-200 text-sm font-semibold mb-1.5">
                    Password
                    {mode === 'signup' && (
                      <span className="text-purple-400 font-normal ml-1">(min. 6 characters)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e?.target?.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/60 focus:border-yellow-400/60 transition-all duration-200 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-purple-900 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                    </>
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Create Free Account'
                  )}
                </button>
              </form>

              {/* Switch mode link */}
              <p className="text-center text-purple-300 text-sm mt-5">
                {mode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => switchMode('signup')}
                      className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                    >
                      Sign up free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => switchMode('signin')}
                      className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-purple-400 text-xs mt-6 leading-relaxed">
            By creating an account you agree to our{' '}
            <Link to="/terms" className="text-yellow-400/80 hover:text-yellow-400 underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-yellow-400/80 hover:text-yellow-400 underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
