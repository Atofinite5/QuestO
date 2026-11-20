import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CalendarOff, Plus, Check, X, ShieldCheck, 
  Clock, Calendar, User, ArrowRight, AlertCircle 
} from 'lucide-react';
import { LeaveRequest } from '../../types';
import { ApiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

export const LeavesPage: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => { loadLeaves(); }, []);
  const loadLeaves = async () => setLeaves(await ApiService.getLeaves());

  // Form state
  const [leaveType, setLeaveType] = useState<LeaveRequest['leaveType']>('Exam / Study');
  const [startDate, setStartDate] = useState('2026-09-28');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [reason, setReason] = useState('');

  const handleApprove = async (leaveId: string) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    await ApiService.updateLeaveStatus(leaveId, 'Approved', user?.email || 'cto@questo.app');
    await loadLeaves();
  };

  const handleReject = async (leaveId: string) => {
    await ApiService.updateLeaveStatus(leaveId, 'Rejected', user?.email || 'cto@questo.app');
    await loadLeaves();
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    const newLeave: LeaveRequest = {
      leaveId: 'LVE-' + Math.floor(1004 + Math.random() * 8000),
      employeeEmail: user?.email || 'rohan.intern@company.com',
      employeeName: user?.name || 'Rohan Sharma',
      leaveType: leaveType,
      startDate: startDate,
      endDate: endDate,
      daysCount: 3,
      reason: reason,
      status: 'Pending',
      streakProtected: false,
      tasksRescheduled: 0,
      submittedAt: new Date().toISOString().substring(0, 19).replace('T', ' ')
    };

    await ApiService.submitLeave(newLeave);
    await loadLeaves();
    setShowRequestModal(false);
    setReason('');
  };

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Leave & PTO Management"
        subtitle="Submit student exam or employee leave with streak-freezing protection and automated task rescheduling."
        action={
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Leave Request</span>
          </button>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase text-zinc-400">Pending Requests</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase text-zinc-400">Approved Leaves</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <span className="text-[11px] font-semibold uppercase text-zinc-400">Streak Freeze Protocol</span>
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Streaks guaranteed against reset</span>
          </p>
        </div>
      </div>

      {/* Leave Requests Cards List */}
      <div className="space-y-4">
        {leaves.map((item) => (
          <div
            key={item.leaveId}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {item.employeeName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                    {item.employeeName}
                  </h4>
                  <span className="text-[10px] text-zinc-400">
                    {item.employeeEmail} • ID: {item.leaveId}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge color={item.leaveType === 'Exam / Study' ? 'purple' : 'blue'}>
                  {item.leaveType}
                </Badge>
                <Badge color={item.status === 'Approved' ? 'emerald' : item.status === 'Rejected' ? 'rose' : 'yellow'}>
                  {item.status}
                </Badge>
              </div>
            </div>

            <div className="text-xs text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                <span>📅 {item.startDate} to {item.endDate} ({item.daysCount} days)</span>
                <span>Submitted: {item.submittedAt.substring(0, 10)}</span>
              </div>
              <p className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300">
                "{item.reason}"
              </p>
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                {item.streakProtected ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Streak Frozen & Protected
                  </span>
                ) : (
                  <span>Pending streak freeze confirmation</span>
                )}
                {item.tasksRescheduled > 0 && (
                  <span className="text-indigo-600 dark:text-indigo-400">
                    • {item.tasksRescheduled} task deadlines auto-extended
                  </span>
                )}
              </div>

              {item.status === 'Pending' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(item.leaveId)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve (Freeze Streak)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(item.leaveId)}
                    className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Leave Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">Submit Leave / Exam PTO</h3>
              <button onClick={() => setShowRequestModal(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Leave Category</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                >
                  <option value="Exam / Study">Exam / Study Leave (Streak Protected)</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Personal">Personal Leave</option>
                  <option value="Conference">Conference / Hackathon</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Reason / Subject Details</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. End semester exams for Computer Networks & OS..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Upon approval, your standup streak is automatically frozen and active task deadlines will be pushed forward.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

