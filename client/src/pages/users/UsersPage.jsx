import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Users as UsersIcon,
  Search,
  Filter,
  Shield,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchUsers } from '../../store/userSlice';
import { PageTitle } from '../../components/common/PageTitle';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/SkeletonLoader';
import { formatDate } from '../../utils/formatters';
import { ROLES, ROLE_LABELS } from '../../constants/roles';

export const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, meta, isLoading, error } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const loadUsers = () => {
    dispatch(
      fetchUsers({
        search: searchTerm || undefined,
        role: selectedRole || undefined,
      })
    );
  };

  useEffect(() => {
    loadUsers();
  }, [selectedRole]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        title="Enterprise Directory & Staff"
        subtitle="Manage user provisioning, branch assignments, and role-based permissions."
        breadcrumbs={['Nexus', 'Operations', 'Team']}
        action={
          <Button
            variant="primary"
            size="sm"
            leftIcon={Plus}
            onClick={() => toast.info('User creation is enabled via self-registration or admin invites.')}
          >
            Add New Staff
          </Button>
        }
      />

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-600 focus:bg-white focus:ring-1 focus:ring-brand-600 transition-all"
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Role Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-brand-600 focus:bg-white transition-colors"
            >
              <option value="">All Security Roles</option>
              {Object.values(ROLES).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={RefreshCw}
            isLoading={isLoading}
            onClick={loadUsers}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Users Table / Directory */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <p className="text-rose-600 font-medium">{error}</p>
            <Button variant="secondary" size="sm" onClick={loadUsers}>
              Retry Query
            </Button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <UsersIcon className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-800">No matching personnel located</p>
            <p className="text-xs text-slate-400">Adjust your search parameters or role filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-6">User Details</th>
                  <th className="py-3.5 px-6">Security Role</th>
                  <th className="py-3.5 px-6">Branch / Node</th>
                  <th className="py-3.5 px-6">Joined Date</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={`${item.firstName} ${item.lastName}`} size="sm" />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.firstName} {item.lastName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <Badge role={item.role} size="sm" />
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="text-slate-900 font-medium">{item.branch || 'Headquarters'}</div>
                      <div className="text-[10px] text-slate-500">{item.companyName}</div>
                    </td>
                    <td className="py-3.5 px-6 font-mono text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
