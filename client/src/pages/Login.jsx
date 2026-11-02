import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, User, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const loggedUser = await login(data.email, data.password);
      toast.success(`Welcome back, ${loggedUser.username}!`);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err || 'Failed to authenticate');
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoAccount = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-w-md mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
          <ShieldCheck size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
          Sign In to Proctor AI
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access proctored coding assessments and analytics
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Pill Bar */}
      <div className="mb-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
          Quick Demo Credentials
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDemoAccount('alex@example.com', 'password123')}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition"
          >
            <User size={13} />
            Candidate Demo
          </button>
          <button
            type="button"
            onClick={() => setDemoAccount('admin@proctorai.com', 'password123')}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition"
          >
            <ShieldAlert size={13} />
            Admin Demo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email or Username */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
            Email or Username
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Mail size={16} />
            </span>
            <input
              type="text"
              placeholder="alex@example.com or alex_coder"
              {...register('email', {
                required: 'Email or username is required',
              })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white transition duration-200 outline-none text-sm"
              disabled={submitting}
              autoComplete="username"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white transition duration-200 outline-none text-sm"
              disabled={submitting}
              autoComplete="current-password"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md hover:shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-70 disabled:pointer-events-none mt-2 text-sm"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          New to Proctor AI?{' '}
          <Link
            to="/register"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
