import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  MapPin,
  Mail,
  Shield,
  Calendar,
  Save,
  CheckCircle2,
  Camera,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../store/userSlice';
import { setAuthenticatedUser } from '../../store/authSlice';
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from '../../constants/roles';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PageTitle } from '../../components/common/PageTitle';
import { formatDate } from '../../utils/formatters';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, fullName, role, companyName, branch, email } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      companyName: user?.companyName || '',
      branch: user?.branch || 'Headquarters',
      profileImage: user?.profileImage || '',
    },
  });

  const onSubmit = async (data) => {
    if (!user?._id && !user?.id) {
      toast.error('User ID missing.');
      return;
    }

    const userId = user._id || user.id;
    setIsSaving(true);

    try {
      const updatedUser = await dispatch(
        updateUserProfile({ id: userId, data })
      ).unwrap();

      // Sync updated user into authSlice
      dispatch(setAuthenticatedUser(updatedUser));
      toast.success('Profile details updated successfully!');
    } catch (err) {
      toast.error(err || 'Failed to update profile details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <PageTitle
        title="Enterprise Profile Settings"
        subtitle="Manage your identity credentials, branch alignment, and workspace parameters."
        breadcrumbs={['Nexus', 'Settings', 'Profile']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Identity Snapshot Card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-6 text-center lg:text-left h-fit">
          <div className="flex flex-col items-center lg:items-start gap-4">
            <div className="relative">
              <Avatar
                name={fullName}
                src={user?.profileImage}
                size="2xl"
                status="online"
                className="w-24 h-24 text-2xl shadow-md border-2 border-white"
              />
            </div>

            <div className="space-y-1 text-center lg:text-left">
              <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-500 font-mono">{email}</p>
              <div className="pt-2">
                <Badge role={role} size="md" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Company</span>
              </span>
              <span className="font-semibold text-slate-900">{companyName}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Assigned Node</span>
              </span>
              <span className="font-semibold text-slate-900">{branch || 'HQ'}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                <span>Joined Date</span>
              </span>
              <span className="font-mono text-slate-700">
                {formatDate(user?.createdAt || new Date())}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Status</span>
              </span>
              <span className="text-emerald-700 font-semibold uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-900 mb-1">RBAC Tier Authority</p>
            <p className="text-[11px]">
              {ROLE_DESCRIPTIONS[role] || 'Standard enterprise operational access.'}
            </p>
          </div>
        </div>

        {/* Right Column: Editable Parameters Form */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Personal & Branch Information</span>
            </h3>
            <p className="text-xs text-slate-500">
              Update your corporate identity variables synced across the cluster.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Marcus"
                leftIcon={User}
                error={errors.firstName?.message}
                {...register('firstName', { required: 'First name is required' })}
              />

              <Input
                label="Last Name"
                placeholder="Vance"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Last name is required' })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company / Enterprise Name"
                placeholder="Apex Wholesale Corp"
                leftIcon={Building2}
                error={errors.companyName?.message}
                {...register('companyName', { required: 'Company name is required' })}
              />

              <Input
                label="Primary Facility / Branch"
                placeholder="East Coast Distribution Hub"
                leftIcon={MapPin}
                error={errors.branch?.message}
                {...register('branch')}
              />
            </div>

            <Input
              label="Avatar Image URL (Optional)"
              placeholder="https://images.unsplash.com/photo-..."
              leftIcon={Camera}
              helperText="Provide a direct CDN or image link to customize your workspace avatar."
              error={errors.profileImage?.message}
              {...register('profileImage')}
            />

            {/* Readonly Security Credentials */}
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Immutable Security Parameters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Registered Email (Account Key)"
                  value={email}
                  disabled
                  leftIcon={Mail}
                  className="opacity-75 cursor-not-allowed bg-slate-50 text-slate-700"
                  helperText="Contact SuperAdmin to alter verified corporate email."
                />

                <Input
                  label="Assigned System Role"
                  value={ROLE_LABELS[role] || role}
                  disabled
                  leftIcon={Shield}
                  className="opacity-75 cursor-not-allowed bg-slate-50 text-brand-700 font-semibold"
                  helperText="RBAC privilege managed by security policies."
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={Save}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
