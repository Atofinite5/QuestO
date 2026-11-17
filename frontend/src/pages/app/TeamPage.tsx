import React from 'react';
import { 
  Users, Award, Flame, CheckCircle2, TrendingUp, 
  Crown, ShieldCheck, Mail, ArrowUpRight 
} from 'lucide-react';
import { TeamMember } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

const MOCK_TEAM: TeamMember[] = [
  { email: 'cto@questo.app', name: 'Aditya Kumar', role: 'CTO', title: 'Chief Technology Officer', department: 'Engineering', reportsTo: 'founder@questo.app', totalXp: 15200, level: 17, streakDays: 42, tasksCompleted: 183, deliveryReliability: 97, avatarColor: 'from-indigo-500 to-violet-600', initials: 'AK', joinedAt: '2026-01-01', status: 'Active' },
  { email: 'lead@questo.app', name: 'Priya Patel', role: 'TEAM_LEAD', title: 'Engineering Lead', department: 'Engineering', reportsTo: 'cto@questo.app', totalXp: 8600, level: 13, streakDays: 28, tasksCompleted: 94, deliveryReliability: 94, avatarColor: 'from-cyan-500 to-blue-600', initials: 'PP', joinedAt: '2026-02-15', status: 'Active' },
  { email: 'ananya.dev@company.com', name: 'Ananya Verma', role: 'ENGINEER', title: 'Software Engineer', department: 'Engineering', reportsTo: 'lead@questo.app', totalXp: 4200, level: 9, streakDays: 21, tasksCompleted: 47, deliveryReliability: 92, avatarColor: 'from-purple-500 to-pink-600', initials: 'AV', joinedAt: '2026-03-01', status: 'Active' },
  { email: 'rohan.intern@company.com', name: 'Rohan Sharma', role: 'INTERN', title: 'AI Systems Engineering Intern', department: 'AI Research', reportsTo: 'lead@questo.app', totalXp: 1420, level: 4, streakDays: 14, tasksCompleted: 12, deliveryReliability: 86, avatarColor: 'from-blue-500 to-indigo-600', initials: 'RS', joinedAt: '2026-09-01', status: 'Active' },
  { email: 'dev.intern@company.com', name: 'Devansh Kulkarni', role: 'INTERN', title: 'Infrastructure & Data Intern', department: 'Platform', reportsTo: 'lead@questo.app', totalXp: 980, level: 3, streakDays: 11, tasksCompleted: 8, deliveryReliability: 90, avatarColor: 'from-emerald-500 to-teal-600', initials: 'DK', joinedAt: '2026-09-01', status: 'Active' },
];

export const TeamPage: React.FC = () => {
  const top3 = [...MOCK_TEAM].sort((a, b) => b.totalXp - a.totalXp).slice(0, 3);
  const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Team & Org Hierarchy"
        subtitle="Track engineer streaks, XP progression, and delivery reliability."
        action={
          <button className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity">
            + Invite Teammate
          </button>
        }
      />

      {/* Leaderboard Podium (Top 3) */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Current Sprint Leaderboard Podium
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* #2 Rank */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-center space-y-3 order-2 md:order-1">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs mb-1">
              🥈 2nd
            </div>
            <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${podiumOrder[0].avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-md`}>
              {podiumOrder[0].initials}
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{podiumOrder[0].name}</h4>
              <p className="text-xs text-zinc-400">{podiumOrder[0].title}</p>
            </div>
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-around text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Total XP</span>
                <span className="font-mono font-bold text-amber-500">{podiumOrder[0].totalXp.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Level</span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{podiumOrder[0].level}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Streak</span>
                <span className="font-bold text-rose-500">{podiumOrder[0].streakDays}d 🔥</span>
              </div>
            </div>
          </div>

          {/* #1 Rank (Champion, taller card) */}
          <div className="p-7 rounded-3xl bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-zinc-900 dark:to-zinc-900 border-2 border-indigo-500/30 dark:border-indigo-500/30 shadow-lg text-center space-y-3 order-1 md:order-2 scale-105">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-sm mb-1">
              👑 1st
            </div>
            <div className={`w-18 h-18 mx-auto rounded-full bg-gradient-to-br ${podiumOrder[1].avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-indigo-500/20`}>
              {podiumOrder[1].initials}
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-950 dark:text-white">{podiumOrder[1].name}</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{podiumOrder[1].title}</p>
            </div>
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-around text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Total XP</span>
                <span className="font-mono font-bold text-amber-500 text-sm">{podiumOrder[1].totalXp.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Level</span>
                <span className="font-bold text-zinc-900 dark:text-white text-sm">{podiumOrder[1].level}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Streak</span>
                <span className="font-bold text-rose-500 text-sm">{podiumOrder[1].streakDays}d 🔥</span>
              </div>
            </div>
          </div>

          {/* #3 Rank */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-center space-y-3 order-3">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs mb-1">
              🥉 3rd
            </div>
            <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${podiumOrder[2].avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-md`}>
              {podiumOrder[2].initials}
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white">{podiumOrder[2].name}</h4>
              <p className="text-xs text-zinc-400">{podiumOrder[2].title}</p>
            </div>
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-around text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Total XP</span>
                <span className="font-mono font-bold text-amber-500">{podiumOrder[2].totalXp.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Level</span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{podiumOrder[2].level}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Streak</span>
                <span className="font-bold text-rose-500">{podiumOrder[2].streakDays}d 🔥</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Engineering Roster & RPG Rankings
          </h3>
          <p className="text-xs text-zinc-400">Level formula: ⌊√(XP / 50)⌋ + 1</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Team Member</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Total XP</th>
                <th className="px-6 py-3">Daily Streak</th>
                <th className="px-6 py-3">Quests Done</th>
                <th className="px-6 py-3">Reliability %</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {MOCK_TEAM.map((member, idx) => (
                <tr key={member.email} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-zinc-400">
                    #{idx + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                        {member.initials}
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-950 dark:text-white block">{member.name}</span>
                        <span className="text-[10px] text-zinc-400">{member.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{member.role.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                    Lvl {member.level}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-amber-500">
                    {member.totalXp.toLocaleString()} XP
                  </td>
                  <td className="px-6 py-4 font-bold text-rose-500">
                    {member.streakDays} days 🔥
                  </td>
                  <td className="px-6 py-4">
                    {member.tasksCompleted}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{member.deliveryReliability}%</span>
                      <div className="w-12 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${member.deliveryReliability}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={member.status === 'Active' ? 'emerald' : 'zinc'}>
                      {member.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

