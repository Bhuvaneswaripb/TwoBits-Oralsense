export type UserMode = 'kid' | 'adult';

/**
 * Reliably calculates user age from a Date of Birth string (YYYY-MM-DD).
 */
export function calculateAgeFromDOB(dobStr: string): number {
  if (!dobStr) return 25;
  const birthDate = new Date(dobStr);
  if (isNaN(birthDate.getTime())) {
    const parsedAge = parseInt(dobStr, 10);
    return isNaN(parsedAge) ? 25 : parsedAge;
  }
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Centralized mode calculation rule:
 * Age < 16 => 'kid' (KID MODE)
 * Age >= 16 => 'adult' (ADULT MODE)
 */
export function calculateUserMode(ageOrDob: number | string): UserMode {
  let age: number;
  if (typeof ageOrDob === 'string') {
    if (ageOrDob.includes('-') || ageOrDob.includes('/')) {
      age = calculateAgeFromDOB(ageOrDob);
    } else {
      age = parseInt(ageOrDob, 10);
      if (isNaN(age)) age = 25;
    }
  } else {
    age = ageOrDob;
  }

  return age < 16 ? 'kid' : 'adult';
}
