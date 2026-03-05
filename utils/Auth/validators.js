// root/utils/validators.js

// ---------- helpers ----------
export const toUpperTrim = (v) => String(v ?? "").trim().toUpperCase();

export const isAlphanumeric = (value) => /^[a-zA-Z0-9]+$/.test(value);

export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());

// keep digits and + only (like you were doing)
export const normalizePhoneNumber = (value) =>
  String(value ?? "").replace(/[^\d+]/g, "");

// simple E.164-ish check: + optional then digits 10-15
export const isValidPhoneNumber = (value) => {
  const v = String(value ?? "").trim();
  if (!v) return false;

  // allow + at start only
  if (v.includes("+") && !v.startsWith("+")) return false;

  const digits = v.replace(/[^0-9]/g, "");
  return digits.length >= 10 && digits.length <= 15;
};

// DOB must be YYYY-MM-DD and valid past date
export const isValidDateOfBirth = (value) => {
  const v = String(value ?? "").trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return false;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);

  const date = new Date(y, mo - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== d
  ) return false;

  // must be before now (not in future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date < today || date.getTime() === today.getTime(); // allow today if backend allows "before now"; change if needed
};

// compute age from YYYY-MM-DD
export const computeAgeFromDob = (dob) => {
  if (!isValidDateOfBirth(dob)) return "";

  const [y, m, d] = String(dob).split("-").map(Number);
  const birth = new Date(y, m - 1, d);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const mm = today.getMonth() - birth.getMonth();
  if (mm < 0 || (mm === 0 && today.getDate() < birth.getDate())) age--;

  return age >= 0 ? String(age) : "";
};

// ---- PASSWORD RULE ----
// Backend says "generalRules.password" (unknown exact).
// Default strong password rule (change easily if backend differs):
export const isStrongPassword = (value) => {
  const v = String(value ?? "");
  const hasMin = v.length >= 8;
  const hasUpper = /[A-Z]/.test(v);
  const hasLower = /[a-z]/.test(v);
  const hasNumber = /[0-9]/.test(v);
  const hasSymbol = /[^A-Za-z0-9]/.test(v);
  return hasMin && hasUpper && hasLower && hasNumber && hasSymbol;
};

// GenderEnum (adjust if backend supports more)
export const GENDER_ENUM = ["MALE", "FEMALE"];
export const isValidGender = (value) => {
  const v = toUpperTrim(value);
  // gender optional in docs, but your UI makes it required
  return GENDER_ENUM.includes(v);
};