import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Users,
  Plus,
  Search,
  RefreshCw,
  Calendar,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  Briefcase,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchEmployees,
  addEmployee,
  fetchLeaves,
  addLeaveRequest,
  reviewLeaveRequest,
} from '../../store/hrSlice';
import { PageTitle } from '../../components/common/PageTitle';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Skeleton } from '../../components/ui/SkeletonLoader';
import { formatDate } from '../../utils/formatters';

export const HRPage = () => {
  const dispatch = useDispatch();
  const { employees, leaves, isLoading } = useSelector((state) => state.hr);

  const [activeTab, setActiveTab] = useState('employees'); // 'employees' or 'leaves'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // New Employee State
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: 'Warehouse Operations',
    designation: 'Inventory Coordinator',
    branch: 'Main Distribution Hub',
    employmentType: 'Full-Time',
    shift: 'Morning Shift (08:00 - 16:30)',
    monthlySalary: '6500',
  });

  // New Leave Application State
  const [newLeave, setNewLeave] = useState({
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    totalDays: '2',
    reason: '',
  });

  const loadData = () => {
    dispatch(
      fetchEmployees({
        search: searchTerm || undefined,
        department: selectedDept || undefined,
      })
    );
    dispatch(fetchLeaves());
  };

  useEffect(() => {
    loadData();
  }, [selectedDept]);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addEmployee({
          ...newEmployee,
          monthlySalary: parseFloat(newEmployee.monthlySalary) || 5000,
        })
      ).unwrap();

      toast.success(`Personnel record for ${newEmployee.firstName} ${newEmployee.lastName} created!`);
      setIsEmployeeModalOpen(false);
      setNewEmployee({
        firstName: '',
        lastName: '',
        email: '',
        department: 'Warehouse Operations',
        designation: 'Inventory Coordinator',
        branch: 'Main Distribution Hub',
        employmentType: 'Full-Time',
        shift: 'Morning Shift (08:00 - 16:30)',
        monthlySalary: '6500',
      });
      loadData();
    } catch (err) {
      toast.error(err || 'Failed to provision employee');
    }
  };

  const handleCreateLeave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addLeaveRequest({
          ...newLeave,
          totalDays: parseInt(newLeave.totalDays, 10) || 1,
        })
      ).unwrap();

      toast.success('Leave application submitted for managerial approval.');
      setIsLeaveModalOpen(false);
      setNewLeave({
        leaveType: 'Annual Leave',
        startDate: '',
        endDate: '',
        totalDays: '2',
        reason: '',
      });
      dispatch(fetchLeaves());
    } catch (err) {
      toast.error(err || 'Failed to submit leave application');
    }
  };

  const handleReviewLeave = async (leaveId, status) => {
    try {
      await dispatch(
        reviewLeaveRequest({
          id: leaveId,
          statusData: { status },
        })
      ).unwrap();
      toast.success(`Leave request marked as ${status}.`);
    } catch (err) {
      toast.error(err || 'Failed to review leave application');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageTitle
        title="Human Resources & Department Staffing"
        subtitle="Manage personnel records, department rosters, and employee leave requests."
        breadcrumbs={['Nexus', 'Operations', 'HR & Personnel']}
        action={
          <div className="flex gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={Calendar}
              onClick={() => setIsLeaveModalOpen(true)}
            >
              Request Leave
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={() => setIsEmployeeModalOpen(true)}
            >
              Onboard Employee
            </Button>
          </div>
        }
      />

      {/* Tabs and Department Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'employees'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff Roster ({employees.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leaves')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'leaves'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Leave Applications ({leaves.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 w-full sm:w-56"
          >
            <option value="">All Departments</option>
            <option value="Executive Management">Executive Management</option>
            <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
            <option value="Warehouse Operations">Warehouse Operations</option>
            <option value="Wholesale Sales & CRM">Wholesale Sales & CRM</option>
            <option value="Human Resources">Human Resources</option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={RefreshCw}
            isLoading={isLoading}
            onClick={loadData}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Tab 1: Staff Roster Data Table */}
      {activeTab === 'employees' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-800/40">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : employees.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No personnel records found</p>
              <p className="text-xs">Add employee records using the 'Onboard Employee' button.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 bg-slate-950/40 border-b border-slate-800/80">
                    <th className="py-3 px-6 font-semibold">Employee</th>
                    <th className="py-3 px-6 font-semibold">Department & Role</th>
                    <th className="py-3 px-6 font-semibold">Shift Schedule</th>
                    <th className="py-3 px-6 font-semibold">Branch</th>
                    <th className="py-3 px-6 font-semibold">Tenure</th>
                    <th className="py-3 px-6 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-200">
                  {employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${emp.firstName} ${emp.lastName}`} size="sm" />
                          <div>
                            <div className="font-bold text-white">
                              {emp.firstName} {emp.lastName}
                            </div>
                            <div className="text-[10px] text-brand-300 font-mono">
                              {emp.employeeId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="font-semibold text-slate-200">{emp.designation}</div>
                        <div className="text-[10px] text-slate-400">{emp.department}</div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-300">
                        <span className="text-[11px] font-mono">{emp.shift}</span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-400">{emp.branch}</td>
                      <td className="py-3.5 px-6 font-mono text-slate-400">
                        {formatDate(emp.dateOfJoining)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Badge variant={emp.status === 'Active' ? 'success' : 'warning'} size="sm">
                          {emp.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Leave Applications Board */}
      {activeTab === 'leaves' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          {leaves.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <FileCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No active leave applications</p>
              <p className="text-xs">Leave requests submitted by staff will appear here for review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 bg-slate-950/40 border-b border-slate-800/80">
                    <th className="py-3 px-6 font-semibold">Employee</th>
                    <th className="py-3 px-6 font-semibold">Leave Type</th>
                    <th className="py-3 px-6 font-semibold">Duration</th>
                    <th className="py-3 px-6 font-semibold">Reason</th>
                    <th className="py-3 px-6 font-semibold">Status</th>
                    <th className="py-3 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-200">
                  {leaves.map((l) => (
                    <tr key={l._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-bold text-white">{l.employeeName}</div>
                        <div className="text-[10px] text-slate-400">{l.department}</div>
                      </td>
                      <td className="py-3.5 px-6 font-medium text-slate-300">{l.leaveType}</td>
                      <td className="py-3.5 px-6 font-mono">
                        <span className="text-brand-300 font-bold">{l.totalDays} Days</span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-400 max-w-xs truncate">{l.reason}</td>
                      <td className="py-3.5 px-6">
                        <Badge
                          variant={
                            l.status === 'Approved'
                              ? 'success'
                              : l.status === 'Rejected'
                              ? 'danger'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {l.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {l.status === 'Pending' ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleReviewLeave(l._id, 'Approved')}
                              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReviewLeave(l._id, 'Rejected')}
                              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">Decided</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Onboard Employee */}
      <Modal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        title="Onboard Enterprise Staff Member"
        subtitle="Provision employee identification, department allocations, and shift parameters."
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="First Name"
              placeholder="e.g. Sarah"
              value={newEmployee.firstName}
              onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              placeholder="e.g. Chen"
              value={newEmployee.lastName}
              onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Corporate Email Address"
            type="email"
            placeholder="sarah.chen@enterprise.com"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Department
              </label>
              <select
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              >
                <option value="Warehouse Operations">Warehouse Operations</option>
                <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                <option value="Wholesale Sales & CRM">Wholesale Sales & CRM</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Executive Management">Executive Management</option>
              </select>
            </div>

            <Input
              label="Designation / Role"
              placeholder="e.g. Senior Logistics Lead"
              value={newEmployee.designation}
              onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Shift Schedule
              </label>
              <select
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100"
                value={newEmployee.shift}
                onChange={(e) => setNewEmployee({ ...newEmployee, shift: e.target.value })}
              >
                <option value="Morning Shift (08:00 - 16:30)">Morning Shift (08:00 - 16:30)</option>
                <option value="Evening Shift (16:00 - 00:30)">Evening Shift (16:00 - 00:30)</option>
                <option value="Night Shift (00:00 - 08:30)">Night Shift (00:00 - 08:30)</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <Input
              label="Monthly Base Salary ($ USD)"
              type="number"
              placeholder="e.g. 7500"
              value={newEmployee.monthlySalary}
              onChange={(e) => setNewEmployee({ ...newEmployee, monthlySalary: e.target.value })}
            />
          </div>

          <div className="pt-3 flex justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setIsEmployeeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Commit & Provision Staff
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Request Leave */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Submit Leave Application"
        subtitle="Apply for scheduled time-off with HR and branch management."
      >
        <form onSubmit={handleCreateLeave} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Leave Category
            </label>
            <select
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100"
              value={newLeave.leaveType}
              onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
            >
              <option value="Annual Leave">Annual Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Maternity/Paternity">Maternity/Paternity</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="Start Date"
              type="date"
              value={newLeave.startDate}
              onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={newLeave.endDate}
              onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
              required
            />
          </div>

          <Input
            label="Total Days"
            type="number"
            min="1"
            value={newLeave.totalDays}
            onChange={(e) => setNewLeave({ ...newLeave, totalDays: e.target.value })}
            required
          />

          <Input
            label="Reason / Notes for Approval"
            placeholder="Family travel / Medical checkup..."
            value={newLeave.reason}
            onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
            required
          />

          <div className="pt-3 flex justify-end gap-2.5">
            <Button variant="secondary" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HRPage;
