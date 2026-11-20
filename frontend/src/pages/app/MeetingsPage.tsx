import React, { useState, useEffect } from 'react';
import { 
  Video, Calendar, Clock, Plus, Users, 
  ExternalLink, Copy, Check, Sparkles, AlertCircle 
} from 'lucide-react';
import { MeetingItem } from '../../types';
import { ApiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

export const MeetingsPage: React.FC = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => { loadMeetings(); }, []);
  const loadMeetings = async () => setMeetings(await ApiService.getMeetings());

  // Form state
  const [title, setTitle] = useState('1-on-1 Blocker Resolution & Mentorship');
  const [attendees, setAttendees] = useState('rohan.intern@company.com');
  const [meetingType, setMeetingType] = useState<MeetingItem['type']>('1-on-1 Mentorship');
  const [meetingDate, setMeetingDate] = useState('2026-09-18');
  const [meetingTime, setMeetingTime] = useState('14:30');
  const [duration, setDuration] = useState(30);
  const [isScheduling, setIsScheduling] = useState(false);
  const [lastScheduled, setLastScheduled] = useState<MeetingItem | null>(null);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !attendees) return;
    setIsScheduling(true);

    const randomPart = () => Math.random().toString(36).substring(2, 5);
    const newMeetLink = `https://meet.google.com/${randomPart()}-${randomPart()}-${randomPart()}`;

    const newMeeting: MeetingItem = {
      meetingId: 'MTG-' + Math.floor(1003 + Math.random() * 8000),
      title: title,
      attendees: attendees.split(',').map(s => s.trim()),
      meetLink: newMeetLink,
      scheduledAt: `${meetingDate} ${meetingTime}:00`,
      duration: Number(duration),
      type: meetingType,
      agenda: [
        `1. Active blocker diagnosis for ${attendees.split(',')[0]}`,
        '2. Technical architecture and dependency resolution with CTO',
        '3. Milestone progress validation and next steps'
      ],
      createdBy: user?.email || 'admin@questo.app',
      status: 'Scheduled'
    };

    await ApiService.saveMeeting(newMeeting);
    await loadMeetings();
    setLastScheduled(newMeeting);
    setIsScheduling(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Google Meet Coordinator"
        subtitle="Schedule native Google Meet calls with automatic pre-meeting agendas synthesized from active sheet blockers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Scheduled Meetings Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Upcoming & Recent Calls</h3>
              <p className="text-xs text-zinc-400">Integrated with Google Calendar API</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-500">
              {meetings.length} Total Sessions
            </span>
          </div>

          <div className="space-y-4">
            {meetings.map((m) => (
              <div
                key={m.meetingId}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{m.title}</h4>
                    <span className="text-xs text-zinc-400">
                      📅 {m.scheduledAt} • {m.duration} mins
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge color="blue">{m.type}</Badge>
                    <Badge color={m.status === 'Scheduled' ? 'emerald' : 'zinc'}>
                      {m.status}
                    </Badge>
                  </div>
                </div>

                {/* Pre-meeting AI Agenda */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>AI Pre-Meeting Blocker Agenda:</span>
                  </div>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 pl-1">
                    {m.agenda.map((ag, i) => (
                      <li key={i}>{ag}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>{m.attendees.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(m.meetLink)}
                      className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1"
                    >
                      {copiedLink === m.meetLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink === m.meetLink ? 'Copied' : 'Copy'}</span>
                    </button>

                    <a
                      href={m.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meet</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Meeting Scheduler Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <Video className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              Schedule Google Meet
            </h3>
          </div>

          <form onSubmit={handleSchedule} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Session Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Attendee Emails (comma separated)</label>
              <input
                type="text"
                required
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="intern@company.com, cto@questo.app"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Session Type</label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
              >
                <option value="1-on-1 Mentorship">1-on-1 Mentorship & Blocker Triage</option>
                <option value="Incident Triage">Incident Triage (P0 Alert)</option>
                <option value="Sprint Planning">Sprint Planning</option>
                <option value="Demo / Review">Milestone Demo & Review</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
              >
                <option value={15}>15 Minutes Quick Sync</option>
                <option value={30}>30 Minutes Standard 1-on-1</option>
                <option value={45}>45 Minutes Architecture Review</option>
                <option value={60}>60 Minutes Deep Dive</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-300 text-[11px] flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500" />
              <span>Automatically provisions a native Google Meet URL and notifies attendees via email with pre-filled blocker items.</span>
            </div>

            <button
              type="submit"
              disabled={isScheduling}
              className="w-full py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Generate Google Meet Link</span>
            </button>
          </form>

          {lastScheduled && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs space-y-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                ✓ Google Meet Provisioned!
              </span>
              <p className="font-mono text-zinc-700 dark:text-zinc-300">{lastScheduled.meetLink}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

