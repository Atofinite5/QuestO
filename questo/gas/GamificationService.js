/**
 * Questo Platform - Gamification Engine
 * File: gas/GamificationService.js
 * 
 * Handles XP bounties, non-linear level curves, consecutive day streaks,
 * streak-freeze protection during approved leaves, and thread-safe leaderboard rankings.
 */

const GamificationService = {
  /**
   * Calculates level based on total XP using quadratic progression.
   * Formula: Level = Floor(Sqrt(XP / 50)) + 1
   */
  calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.sqrt(xp / 50)) + 1;
  },

  /**
   * Awards XP to an employee with concurrency locking.
   * Target Sheet: "🏆 Employees & Org Hierarchy"
   * Column F (6) = Total XP, G (7) = Level, H (8) = Streak, I (9) = Quests Closed, J (10) = Badges
   */
  awardXp(email, xpAmount, reason) {
    if (!email || !xpAmount) return null;
    const lock = LockService.getScriptLock();

    try {
      lock.waitLock(10000); // 10s wait for concurrency safety

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName('🏆 Employees & Org Hierarchy') || ss.getSheetByName('🏆 Employees & XP Leaderboard');
      if (!sheet) return null;

      const data = sheet.getDataRange().getValues();
      let targetRowIndex = -1;

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] && data[i][0].toString().trim().toLowerCase() === email.trim().toLowerCase()) {
          targetRowIndex = i + 1; // 1-indexed
          break;
        }
      }

      // If employee does not exist, append new profile
      if (targetRowIndex === -1) {
        const newRow = [
          email.trim().toLowerCase(),
          email.split('@')[0],
          'Junior Engineer',
          'General',
          'lead@company.com',
          xpAmount,
          `=FLOOR(SQRT(F${data.length + 1}/50))+1`,
          1,
          0,
          '🌱 Novice Quester',
          `=RANK(F${data.length + 1}, $F$2:$F$100)`
        ];
        sheet.appendRow(newRow);
        SpreadsheetApp.flush();
        return { oldXp: 0, newXp: xpAmount, oldLevel: 1, newLevel: 1, leveledUp: false };
      }

      // Column F = Total XP (Index 5 in 0-based array)
      const currentXp = Number(data[targetRowIndex - 1][5]) || 0;
      const oldLevel = this.calculateLevel(currentXp);
      const newXp = currentXp + xpAmount;
      const newLevel = this.calculateLevel(newXp);
      const leveledUp = newLevel > oldLevel;

      // Update Column F (Total XP = 6)
      sheet.getRange(targetRowIndex, 6).setValue(newXp);

      if (leveledUp) {
        SpreadsheetApp.getActive().toast(
          `🎉 LEVEL UP! ${email} reached Level ${newLevel}!`,
          'Questo Level Up',
          7
        );
      }

      SpreadsheetApp.flush();
      return { oldXp: currentXp, newXp, oldLevel, newLevel, leveledUp };

    } catch (e) {
      Logger.log(`Gamification lock error for ${email}: ${e.message}`);
      return null;
    } finally {
      lock.releaseLock();
    }
  },

  /**
   * Increments task completed count and awards milestone badges.
   */
  recordTaskCompleted(email, priority) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🏆 Employees & Org Hierarchy') || ss.getSheetByName('🏆 Employees & XP Leaderboard');
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim().toLowerCase() === email.trim().toLowerCase()) {
        const row = i + 1;
        // Column I (Index 8) = Quests Closed
        const currentCompleted = Number(data[i][8]) || 0;
        const newCompleted = currentCompleted + 1;
        sheet.getRange(row, 9).setValue(newCompleted);

        // Badge checks (Column J = Index 9)
        let currentBadges = data[i][9] ? data[i][9].toString() : '';
        const badgesToAdd = [];

        if (newCompleted >= 5 && !currentBadges.includes('⚡ Speed Demon')) {
          badgesToAdd.push('⚡ Speed Demon');
        }
        if (priority === 'P0 - Blocker' && !currentBadges.includes('🛡️ Blocker Buster')) {
          badgesToAdd.push('🛡️ Blocker Buster');
        }
        if (newCompleted >= 25 && !currentBadges.includes('⚔️ Master Quester')) {
          badgesToAdd.push('⚔️ Master Quester');
        }

        if (badgesToAdd.length > 0) {
          const updatedBadges = currentBadges ? `${currentBadges}, ${badgesToAdd.join(', ')}` : badgesToAdd.join(', ');
          sheet.getRange(row, 10).setValue(updatedBadges);
        }
        break;
      }
    }
  },

  /**
   * Updates standup streak count for an employee, respecting approved leave freezes.
   */
  recordStandupSubmission(email) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🏆 Employees & Org Hierarchy') || ss.getSheetByName('🏆 Employees & XP Leaderboard');
    if (!sheet) return;

    // Check if employee is on approved leave today
    if (LeaveService.isEmployeeOnApprovedLeave(email, new Date())) {
      SpreadsheetApp.getActive().toast(`Streak frozen for ${email} (On Approved Leave).`, 'Streak Protection', 5);
      return;
    }

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim().toLowerCase() === email.trim().toLowerCase()) {
        const row = i + 1;
        // Column H (Index 7) = Streak Days
        const currentStreak = Number(data[i][7]) || 0;
        const newStreak = currentStreak + 1;
        sheet.getRange(row, 8).setValue(newStreak);

        // Streak Badges (Column J = Index 9)
        let currentBadges = data[i][9] ? data[i][9].toString() : '';
        if (newStreak >= 7 && !currentBadges.includes('🔥 7-Day Streak')) {
          const updated = currentBadges ? `${currentBadges}, 🔥 7-Day Streak` : '🔥 7-Day Streak';
          sheet.getRange(row, 10).setValue(updated);
        }
        break;
      }
    }
  }
};
