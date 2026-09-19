import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../services/authService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success('Password recovery instructions dispatched.');
    } catch (err) {
      toast.error(err.customMessage || 'Failed to dispatch reset request.');
    } finally {
      setIsLoading(false);
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
          <KeyRound className="w-3.5 h-3.5 text-brand-600" />
          <span>Credential Recovery</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Reset Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your corporate email address to receive secure password restoration instructions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Recovery Link Sent</h3>
          <p className="text-xs text-slate-600">
            If an active enterprise account corresponds to this address, a secured token link has been generated.
          </p>
          <Link to={ROUTES.LOGIN} className="inline-block mt-2">
            <Button variant="secondary" size="sm" leftIcon={ArrowLeft}>
              Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Corporate Email Address"
            type="email"
            placeholder="john.doe@enterprise.com"
            leftIcon={Mail}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Please provide a valid email',
              },
            })}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            rightIcon={Send}
            className="w-full mt-2"
          >
            Dispatch Recovery Token
          </Button>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default ForgotPasswordPage;
