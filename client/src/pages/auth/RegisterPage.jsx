import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Building2,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser } from '../../store/authSlice';
import { ROUTES } from '../../constants/routes';
import { ROLES, ROLE_LABELS } from '../../constants/roles';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      companyName: '',
      branch: 'Main Distribution Hub',
      role: ROLES.SUPER_ADMIN,
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('Account created successfully! Welcome to BizCore Nexus.');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (errorMessage) {
      toast.error(errorMessage || 'Registration failed.');
    }
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
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>New Enterprise Workspace Setup</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Register Organization
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Provision your administrative access and configure your wholesale node.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="First Name"
            placeholder="Marcus"
            leftIcon={User}
            error={errors.firstName?.message}
            {...register('firstName', {
              required: 'First name is required',
              maxLength: { value: 50, message: 'Max 50 characters' },
            })}
          />
          <Input
            label="Last Name"
            placeholder="Vance"
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'Last name is required',
              maxLength: { value: 50, message: 'Max 50 characters' },
            })}
          />
        </div>

        {/* Email Field */}
        <Input
          label="Corporate Email"
          type="email"
          placeholder="m.vance@nexuswholesale.com"
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
          label="Secure Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Minimum 8 characters"
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
              value: 8,
              message: 'Password must be at least 8 characters long',
            },
          })}
        />

        {/* Company & Branch Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Company Name"
            placeholder="Apex Wholesale Corp"
            leftIcon={Building2}
            error={errors.companyName?.message}
            {...register('companyName', {
              required: 'Company name is required',
            })}
          />
          <Input
            label="Branch / Facility"
            placeholder="East Coast Hub"
            leftIcon={MapPin}
            error={errors.branch?.message}
            {...register('branch')}
          />
        </div>

        {/* Role Selection Dropdown */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Primary System Role</span>
            <span className="text-[10px] text-slate-500">RBAC Tier</span>
          </label>
          <div className="relative">
            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer"
              {...register('role', { required: 'Please select an enterprise role' })}
            >
              {Object.values(ROLES).map((roleKey) => (
                <option key={roleKey} value={roleKey} className="bg-white text-slate-900">
                  {ROLE_LABELS[roleKey]} {roleKey === ROLES.SUPER_ADMIN ? '(Full System Access)' : ''}
                </option>
              ))}
            </select>
          </div>
          {errors.role && (
            <p className="text-xs text-rose-600 mt-0.5">{errors.role.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          rightIcon={UserPlus}
          className="w-full mt-3"
        >
          Complete Enterprise Setup
        </Button>
      </form>

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Already have an existing terminal account?{' '}
          <Link to={ROUTES.LOGIN} className="text-brand-600 hover:text-brand-700 font-semibold underline">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
