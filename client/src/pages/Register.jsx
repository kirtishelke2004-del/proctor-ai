import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, ArrowRight, Loader2, ShieldCheck, UserCheck, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('candidate');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const newUser = await registerAuth(data.username, data.email, data.password, selectedRole);
      toast.success(`Account created as ${selectedRole}!`);
      if (newUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-w-md mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
          <ShieldCheck size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
          Join Proctor AI
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select your role and start your testing or monitoring experience
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
          Account Role
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedRole('candidate')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedRole === 'candidate'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <UserCheck size={14} />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedRole === 'admin'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Shield size={14} />
            Administrator
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Username */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <User size={16} />
            </span>
            <input
              type="text"
              placeholder="johndoe_dev"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white transition duration-200 outline-none text-sm"
              disabled={submitting}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-500 font-medium">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="candidate@company.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Enter a valid email address',
                },
              })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white transition duration-200 outline-none text-sm"
              disabled={submitting}
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
                  message: 'Minimum 6 characters',
                },
              })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white transition duration-200 outline-none text-sm"
              disabled={submitting}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider block">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', {
                validate: (value) => value === passwordValue || 'Passwords do not match',
              })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white transition duration-200 outline-none text-sm"
              disabled={submitting}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md hover:shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-98 disabled:opacity-70 disabled:pointer-events-none mt-3 text-sm"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Register as {selectedRole === 'admin' ? 'Admin' : 'Candidate'}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
