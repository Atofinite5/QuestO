/**
 * Questo Platform - Security & Input Sanitization Service (Unified 2.0)
 * File: gas/SecurityService.js
 * 
 * Protects against:
 * 1. Spreadsheet Formula Injection (CWE-1236 / CSV Injection)
 *    Neutralizes '=', '+', '-', '@', '\t', '\r' prefixes that could execute arbitrary commands.
 * 2. Input Boundary Assertions & Type Defenses
 * 3. Timing-attack resistant token comparisons
 */

const SecurityService = {
  /**
   * Sanitizes any user-supplied string before writing to Google Sheets.
   * Prepends a single quote "'" to neutralise formula prefixes: =, +, -, @, \t, \r
   *
   * @param {*} input Raw string or value
   * @return {*} Sanitized value safe for spreadsheet insertion
   */
  sanitizeFormula(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') return input;

    const trimmed = input.trim();
    if (trimmed.length === 0) return input;

    // Characters that Excel / Google Sheets interpret as formulas or executable DDE
    const formulaPrefixes = ['=', '+', '-', '@', '\t', '\r', '|'];
    const firstChar = trimmed.charAt(0);

    if (formulaPrefixes.indexOf(firstChar) !== -1) {
      // Prepend apostrophe so Sheets renders it as a literal string
      return "'" + input;
    }

    return input;
  },

  /**
   * Sanitizes an array of row values recursively or flatly.
   *
   * @param {Array} row Array of values to sanitize
   * @return {Array} Safe row array
   */
  sanitizeRow(row) {
    if (!Array.isArray(row)) return row;
    return row.map(val => this.sanitizeFormula(val));
  },

  /**
   * Validates standard email address format defensively.
   *
   * @param {string} email
   * @return {boolean}
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  },

  /**
   * Timing-safe token comparison to prevent timing attacks.
   *
   * @param {string} a
   * @param {string} b
   * @return {boolean}
   */
  safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
};
