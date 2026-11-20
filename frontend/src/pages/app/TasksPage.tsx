import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Search, Filter, AlertOctagon, 
  Clock, Award, Tag, Check, X, ShieldAlert, Sparkles 
} from 'lucide-react';
import { TaskItem } from '../../types';
import { ApiService } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge, BadgeColor } from '../../components/ui/Badge';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  useEffect(() => { loadTasks(); }, []);
  const loadTasks = async () => setTasks(await ApiService.getTasks());

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Rohan Sharma');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('P1 - High');
  const [newTaskDeadline, setNewTaskDeadline] = useState('2026-09-30');

  const getPriorityColor = (priority: string): BadgeColor => {
    switch (priority) {
      case 'P0 - Blocker': return 'rose';
      case 'P1 - High': return 'orange';
      case 'P2 - Medium': return 'yellow';
      default: return 'zinc';
    }
  };

  const getStatusColor = (status: string): BadgeColor => {
    switch (status) {
      case 'Done': return 'emerald';
      case 'In Progress': return 'blue';
      case 'Blocked': return 'rose';
      case 'In Review': return 'purple';
      default: return 'zinc';
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskItem['status']) => {
    await ApiService.updateTaskStatus(taskId, newStatus);
    await loadTasks();
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask: TaskItem = {
      taskId: 'QST-' + Math.floor(1008 + Math.random() * 8000),
      title: newTaskTitle,
      description: newTaskDesc,
      assignee: newTaskAssignee,
      assigneeEmail: newTaskAssignee.toLowerCase().replace(' ', '.') + '@company.com',
      priority: newTaskPriority,
      status: 'Open',
      xpBounty: newTaskPriority === 'P0 - Blocker' ? 100 : newTaskPriority === 'P1 - High' ? 60 : 30,
      createdAt: new Date().toISOString().substring(0, 19).replace('T', ' '),
      deadline: newTaskDeadline + ' 18:00:00',
      tags: ['feature']
    };

    await ApiService.saveTask(newTask);
    await loadTasks();
    setShowCreateModal(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const counts = {
    open: tasks.filter(t => t.status === 'Open').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    blocked: tasks.filter(t => t.status === 'Blocked').length,
    done: tasks.filter(t => t.status === 'Done').length,
  };

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.taskId.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Tasks & Quests"
        subtitle="Manage engineering milestones, P0 blocker dependencies, and XP bounties."
        action={
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quest</span>
          </button>
        }
      />

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Open Quests</span>
          <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-1">{counts.open}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">In Progress</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{counts.inProgress}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">Blocked</span>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{counts.blocked}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">Completed</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{counts.done}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Open', 'In Progress', 'Blocked', 'In Review', 'Done'].map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="P0 - Blocker">P0 - Blocker</option>
            <option value="P1 - High">P1 - High</option>
            <option value="P2 - Medium">P2 - Medium</option>
            <option value="P3 - Low">P3 - Low</option>
          </select>

          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs w-full outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const isSelected = selectedTask?.taskId === task.taskId;
          return (
            <div
              key={task.taskId}
              className={`bg-white dark:bg-zinc-900 rounded-2xl border transition-all p-5 shadow-sm space-y-3 ${
                task.status === 'Blocked' 
                  ? 'border-rose-200 dark:border-rose-500/30 bg-rose-50/20 dark:bg-rose-500/5' 
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    {task.taskId}
                  </span>
                  <Badge color={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge color={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-amber-500">
                    +{task.xpBounty} XP
                  </span>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.taskId, e.target.value as any)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Blocked">Blocked</option>
                    <option value="In Review">In Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                  {task.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  {task.description}
                </p>
              </div>

              {/* Blocker alert box if blocked */}
              {task.status === 'Blocked' && task.blockerDetails && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-start gap-2 text-rose-800 dark:text-rose-300 text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Active Blocker: </span>
                    <span>{task.blockerDetails}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Assignee: {task.assignee}
                  </span>
                  <span>Deadline: {task.deadline.substring(0, 10)}</span>
                </div>

                <div className="flex items-center gap-1">
                  {task.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">Create New Quest</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Implement resilient caching fallback"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Describe acceptance criteria and key objectives..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                  >
                    <option value="Rohan Sharma">Rohan Sharma</option>
                    <option value="Ananya Verma">Ananya Verma</option>
                    <option value="Devansh Kulkarni">Devansh Kulkarni</option>
                    <option value="Priya Patel">Priya Patel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                  >
                    <option value="P0 - Blocker">P0 - Blocker (100 XP)</option>
                    <option value="P1 - High">P1 - High (60 XP)</option>
                    <option value="P2 - Medium">P2 - Medium (30 XP)</option>
                    <option value="P3 - Low">P3 - Low (15 XP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Deadline</label>
                <input
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90"
                >
                  Create Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

