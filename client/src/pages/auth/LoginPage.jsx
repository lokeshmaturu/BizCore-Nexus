import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

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
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success('Welcome back to BizCore Nexus!');
      navigate(from, { replace: true });
    } catch (errorMessage) {
      toast.error(errorMessage || 'Failed to authenticate.');
    }
  };

  // Quick Demo Account Helpers for testing
  const fillDemoAccount = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6"
    >
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-[11px] font-semibold text-brand-700 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>Enterprise Secure Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sign In to Nexus
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your enterprise credentials to access your operating dashboard.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <Input
          label="Enterprise Email"
          type="email"
          placeholder="admin@enterprise.com"
          leftIcon={Mail}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Please provide a valid corporate email',
            },
          })}
        />

        {/* Password Field */}
        <Input
          label="Security Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          leftIcon={Lock}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        {/* Remember / Forgot Row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900">
            <input
              type="checkbox"
              className="rounded bg-slate-50 border-slate-300 text-brand-600 focus:ring-brand-500/20"
            />
            <span>Remember terminal</span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-brand-600 hover:text-brand-700 font-semibold transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          rightIcon={ArrowRight}
          className="w-full mt-2"
        >
          Authenticate & Enter
        </Button>
      </form>

      {/* Quick Testing Hint */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-[11px] text-slate-500 text-center mb-2">
          New to the enterprise?{' '}
          <Link to={ROUTES.REGISTER} className="text-brand-600 hover:text-brand-700 font-semibold underline">
            Create an Enterprise Account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
