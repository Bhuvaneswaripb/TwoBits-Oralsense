import {
  Appointment,
  ScreeningResult,
  NightlyTelemetry,
  PatientProfile,
  PracticePatient,
  SymptomLogEntry,
  FollowUpSubmission,
  ClinicalNote,
  PatientHealthUpdate,
} from '../types';
import { calculateAgeFromDOB, calculateUserMode } from './modeUtils';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_PATIENT_PROFILE,
  INITIAL_SCREENING_RESULT,
  MOCK_7DAY_SYMPTOMS,
  MOCK_FOLLOW_UP,
  MOCK_PRACTICE_PATIENTS,
  MOCK_DOCTORS,
  generate30DayTelemetry,
} from '../data/mockData';
import {
  saveApiScreening,
  createApiAppointment,
  saveApiHealthUpdate,
} from './api';

const STORAGE_KEYS = {
  PATIENT: 'bruxshield_patient',
  APPOINTMENTS: 'bruxshield_appointments',
  SCREENING_RESULT: 'bruxshield_screening_result',
  TELEMETRY: 'bruxshield_telemetry',
  SYMPTOM_LOGS: 'bruxshield_symptom_logs',
  FOLLOW_UP: 'bruxshield_follow_up',
  PRACTICE_PATIENTS: 'bruxshield_practice_patients',
  HEALTH_UPDATES: 'oralsense_health_updates',
};

const MOCK_INITIAL_HEALTH_UPDATES: PatientHealthUpdate[] = [
  {
    id: 'upd-1',
    date: '2026-09-18',
    type: 'New Symptom',
    concern: 'Gum Health',
    note: 'Noticed mild bleeding along upper right molar while flossing tonight.',
    shareWithProvider: true,
  },
  {
    id: 'upd-2',
    date: '2026-09-15',
    type: 'Improved',
    concern: 'Bruxism & Jaw Health',
    note: 'Jaw stiffness felt milder after practicing daytime relaxation techniques.',
    shareWithProvider: true,
  }
];

export const getStoredPatientHealthUpdates = (): PatientHealthUpdate[] => {
  if (typeof window === 'undefined') return MOCK_INITIAL_HEALTH_UPDATES;
  const data = localStorage.getItem(STORAGE_KEYS.HEALTH_UPDATES);
  return data ? JSON.parse(data) : MOCK_INITIAL_HEALTH_UPDATES;
};

export const addPatientHealthUpdate = (update: PatientHealthUpdate): PatientHealthUpdate[] => {
  if (typeof window === 'undefined') return MOCK_INITIAL_HEALTH_UPDATES;
  const current = getStoredPatientHealthUpdates();
  const updated = [update, ...current];
  localStorage.setItem(STORAGE_KEYS.HEALTH_UPDATES, JSON.stringify(updated));

  // Async API sync to Express backend
  saveApiHealthUpdate(update).catch((err) => {
    console.warn('[OralSense Storage API Sync]', err.message);
  });

  // Also sync with practice patient record if user opted to share
  if (update.shareWithProvider) {
    const patients = getStoredPracticePatients();
    const synced = patients.map((p) => {
      const existingUpdates = p.patientHealthUpdates || [];
      return {
        ...p,
        patientHealthUpdates: [update, ...existingUpdates],
      };
    });
    localStorage.setItem(STORAGE_KEYS.PRACTICE_PATIENTS, JSON.stringify(synced));
  }

  return updated;
};


export const getStoredPatientProfile = (): PatientProfile => {
  if (typeof window === 'undefined') return INITIAL_PATIENT_PROFILE;
  const data = localStorage.getItem(STORAGE_KEYS.PATIENT);
  const profile: PatientProfile = data ? JSON.parse(data) : INITIAL_PATIENT_PROFILE;
  
  if (profile.dateOfBirth) {
    profile.age = calculateAgeFromDOB(profile.dateOfBirth);
  }
  profile.mode = calculateUserMode(profile.age);
  return profile;
};

export const savePatientProfile = (profile: PatientProfile): void => {
  if (typeof window === 'undefined') return;
  if (profile.dateOfBirth) {
    profile.age = calculateAgeFromDOB(profile.dateOfBirth);
  }
  profile.mode = calculateUserMode(profile.age);
  localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify(profile));
};

export const getStoredAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return INITIAL_APPOINTMENTS;
  const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return data ? JSON.parse(data) : INITIAL_APPOINTMENTS;
};

export const addAppointment = (apt: Appointment): void => {
  if (typeof window === 'undefined') return;
  const list = getStoredAppointments();
  const updated = [apt, ...list];
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
};

export const cancelAppointment = (id: string): Appointment[] => {
  if (typeof window === 'undefined') return INITIAL_APPOINTMENTS;
  const list = getStoredAppointments();
  const updated = list.map((a) => (a.id === id ? { ...a, status: 'Cancelled' as const } : a));
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
  return updated;
};

export const getStoredScreeningResult = (): ScreeningResult => {
  if (typeof window === 'undefined') return INITIAL_SCREENING_RESULT;
  const data = localStorage.getItem(STORAGE_KEYS.SCREENING_RESULT);
  return data ? JSON.parse(data) : INITIAL_SCREENING_RESULT;
};

export const saveScreeningResult = (result: ScreeningResult): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SCREENING_RESULT, JSON.stringify(result));

  // Async API sync to Express backend
  saveApiScreening(result).catch((err) => {
    console.warn('[OralSense Storage API Sync]', err.message);
  });
};

export const getStoredSymptomLogs = (): SymptomLogEntry[] => {
  if (typeof window === 'undefined') return MOCK_7DAY_SYMPTOMS;
  const data = localStorage.getItem(STORAGE_KEYS.SYMPTOM_LOGS);
  return data ? JSON.parse(data) : MOCK_7DAY_SYMPTOMS;
};

export const addSymptomLog = (entry: SymptomLogEntry): SymptomLogEntry[] => {
  if (typeof window === 'undefined') return MOCK_7DAY_SYMPTOMS;
  const logs = getStoredSymptomLogs();
  const updated = [entry, ...logs.filter((l) => l.date !== entry.date)];
  localStorage.setItem(STORAGE_KEYS.SYMPTOM_LOGS, JSON.stringify(updated));
  return updated;
};

export const getStoredFollowUp = (): FollowUpSubmission => {
  if (typeof window === 'undefined') return MOCK_FOLLOW_UP;
  const data = localStorage.getItem(STORAGE_KEYS.FOLLOW_UP);
  return data ? JSON.parse(data) : MOCK_FOLLOW_UP;
};

export const saveFollowUpSubmission = (submission: FollowUpSubmission): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.FOLLOW_UP, JSON.stringify(submission));
};

export const getStoredPracticePatients = (): PracticePatient[] => {
  if (typeof window === 'undefined') return MOCK_PRACTICE_PATIENTS;
  const data = localStorage.getItem(STORAGE_KEYS.PRACTICE_PATIENTS);
  return data ? JSON.parse(data) : MOCK_PRACTICE_PATIENTS;
};

export const addClinicalNoteToPatient = (patientId: string, note: ClinicalNote): PracticePatient[] => {
  if (typeof window === 'undefined') return MOCK_PRACTICE_PATIENTS;
  const patients = getStoredPracticePatients();
  const updated = patients.map((p) => {
    if (p.id === patientId) {
      return {
        ...p,
        clinicalNotes: [note, ...p.clinicalNotes],
      };
    }
    return p;
  });
  localStorage.setItem(STORAGE_KEYS.PRACTICE_PATIENTS, JSON.stringify(updated));
  return updated;
};

export const getStoredTelemetry = (): NightlyTelemetry[] => {
  if (typeof window === 'undefined') return generate30DayTelemetry();
  const data = localStorage.getItem(STORAGE_KEYS.TELEMETRY);
  if (data) return JSON.parse(data);
  const initial = generate30DayTelemetry();
  localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(initial));
  return initial;
};

export const simulateNewNightTelemetry = (): NightlyTelemetry => {
  const current = getStoredTelemetry();
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  const randomEvents = Math.floor(15 + Math.random() * 20);
  const randomAvgPress = Math.floor(30 + Math.random() * 25);
  const randomPeakPress = Math.floor(randomAvgPress + 20 + Math.random() * 25);
  const durationSec = Number((1.1 + Math.random() * 1.5).toFixed(1));

  const newSession: NightlyTelemetry = {
    date: dateStr,
    sleepDurationMinutes: 440 + Math.floor(Math.random() * 40),
    biteEventsCount: randomEvents,
    avgPressurePercent: randomAvgPress,
    peakPressurePercent: randomPeakPress,
    avgEventDurationSec: durationSec,
    restlessnessIndex: Math.floor(25 + randomAvgPress * 0.5),
    pressureTrend: [
      { time: '23:30', pressure: Math.floor(Math.random() * 20) },
      { time: '00:45', pressure: 20 + Math.floor(Math.random() * 30) },
      { time: '02:15', pressure: randomAvgPress + 15 },
      { time: '03:40', pressure: randomPeakPress },
      { time: '05:00', pressure: randomAvgPress },
      { time: '06:20', pressure: 12 },
    ],
  };

  const updated = [newSession, ...current.slice(0, 29)];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(updated));
  }
  return newSession;
};

export const runFullDemoSimulation = (): void => {
  if (typeof window === 'undefined') return;

  const demoResult: ScreeningResult = {
    id: `scr-demo-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    concern: 'Bruxism & Jaw Health',
    overallScore: 68,
    indicationLevel: 'MODERATE CONCERN',
    riskLevel: 'Moderate',
    symptomsScore: 64,
    hasVisualInput: true,
    visualInputType: 'video',
    whyHighlighted: [
      'Morning jaw stiffness reported consistently',
      'Daytime tension noted during focus',
      'Jaw movement video submitted for clinician review',
    ],
    recommendedNextStep: 'Consider scheduling a consultation with a dental clinician.',
    recommendations: [
      'Schedule an in-person dental evaluation.',
      'Log daily jaw stiffness using BruxShield symptom monitoring.',
      'Practice daytime jaw relaxation techniques.',
    ],
  };

  saveScreeningResult(demoResult);

  const doc = MOCK_DOCTORS[0];
  const demoApt: Appointment = {
    id: `apt-demo-${Date.now().toString().slice(-4)}`,
    doctorId: doc.id,
    doctorName: doc.name,
    doctorSpecialty: doc.specialty,
    doctorImage: doc.image,
    clinicName: doc.clinic,
    clinicAddress: doc.clinicAddress,
    date: 'Tomorrow',
    time: '10:30 AM',
    type: 'In-Person',
    status: 'Upcoming',
    patientNotes: 'Automated Demo Simulation: Screening follow-up for Bruxism & Jaw Health.',
    fee: doc.consultationFee,
    createdAt: new Date().toISOString().split('T')[0],
  };

  addAppointment(demoApt);
  simulateNewNightTelemetry();
};

// ----------------------------------------------------
// DENTAL HABITS STORAGE & CALCULATIONS
// ----------------------------------------------------
import { ChildProfile, DentalHabitLog, BrushReplacement, WeeklyHabitReport, DentalProduct, AchievementBadge } from '../types';
import { getApiChildProfile, saveApiChildProfile, getApiTodayHabitLog, saveApiHabitLog, getApiWeeklyHabitLogs, saveApiBrushReplacement } from './api';

const HABIT_STORAGE_KEYS = {
  CHILD_PROFILE: 'oralsense_child_profile',
  HABIT_LOGS: 'oralsense_dental_habit_logs',
  BRUSH_REPLACEMENT: 'oralsense_brush_replacement',
};

const DEFAULT_CHILD_PROFILE: ChildProfile = {
  id: 'child-default-1',
  userId: 'pat-default',
  name: 'Leo',
  age: 6,
  avatar: 'star',
  morningReminderTime: '08:00',
  eveningReminderTime: '20:00',
  createdAt: new Date().toISOString().split('T')[0],
};

export const getStoredChildProfile = (): ChildProfile => {
  if (typeof window === 'undefined') return DEFAULT_CHILD_PROFILE;
  const data = localStorage.getItem(HABIT_STORAGE_KEYS.CHILD_PROFILE);
  const childProfile: ChildProfile = data ? JSON.parse(data) : DEFAULT_CHILD_PROFILE;
  const patient = getStoredPatientProfile();
  if (patient && patient.name && patient.name.trim() !== '') {
    childProfile.name = patient.name;
  }
  return childProfile;
};

export const saveChildProfile = (profile: ChildProfile): ChildProfile => {
  if (typeof window === 'undefined') return profile;
  localStorage.setItem(HABIT_STORAGE_KEYS.CHILD_PROFILE, JSON.stringify(profile));
  saveApiChildProfile(profile).catch((err) => console.warn('[Dental Habits API Sync]', err.message));
  return profile;
};

export const getTodayStr = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const getStoredDentalHabitLogs = (childId: string = 'child-default-1'): DentalHabitLog[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(HABIT_STORAGE_KEYS.HABIT_LOGS);
  const logs: DentalHabitLog[] = data ? JSON.parse(data) : [];
  return logs.filter((l) => l.childId === childId);
};

export const getTodayHabitLog = (childId: string = 'child-default-1'): DentalHabitLog => {
  const today = getTodayStr();
  const logs = getStoredDentalHabitLogs(childId);
  const existing = logs.find((l) => l.date === today);

  if (existing) return existing;

  const newLog: DentalHabitLog = {
    id: `log-${Date.now()}`,
    userId: 'pat-default',
    childId,
    date: today,
    morningBrushing: false,
    morningTongue: false,
    eveningBrushing: false,
    eveningFloss: false,
    totalBrushingSeconds: 0,
    completedSessions: 0,
  };

  return newLog;
};

export const saveDentalHabitLog = (log: DentalHabitLog): DentalHabitLog => {
  if (typeof window === 'undefined') return log;
  const data = localStorage.getItem(HABIT_STORAGE_KEYS.HABIT_LOGS);
  const allLogs: DentalHabitLog[] = data ? JSON.parse(data) : [];

  const existingIndex = allLogs.findIndex((l) => l.childId === log.childId && l.date === log.date);
  let updatedLogs: DentalHabitLog[];
  if (existingIndex >= 0) {
    updatedLogs = [...allLogs];
    updatedLogs[existingIndex] = log;
  } else {
    updatedLogs = [log, ...allLogs];
  }

  localStorage.setItem(HABIT_STORAGE_KEYS.HABIT_LOGS, JSON.stringify(updatedLogs));
  saveApiHabitLog(log).catch((err) => console.warn('[Dental Habits API Sync]', err.message));
  return log;
};

export const calculateStreak = (childId: string = 'child-default-1'): { currentStreak: number; bestStreak: number } => {
  const logs = getStoredDentalHabitLogs(childId);
  if (logs.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const today = getTodayStr();

  // Filter logs for childId and only past or present dates (ignore future dates)
  const validLogs = logs.filter((l) => l.date <= today && (l.morningBrushing || l.eveningBrushing));
  if (validLogs.length === 0) return { currentStreak: 0, bestStreak: 0 };

  // Sort unique dates descending
  const uniqueDates = Array.from(new Set(validLogs.map((l) => l.date))).sort((a, b) => b.localeCompare(a));

  const parseUTCDate = (dateStr: string): number => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };

  const getDiffDays = (date1Str: string, date2Str: string): number => {
    return Math.round((parseUTCDate(date1Str) - parseUTCDate(date2Str)) / (1000 * 60 * 60 * 24));
  };

  // Best streak calculation
  const ascDates = [...uniqueDates].reverse();
  let bestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < ascDates.length; i++) {
    const diff = getDiffDays(ascDates[i], ascDates[i - 1]);
    if (diff === 1) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 1;
    }
  }

  // Current streak calculation
  // Check if today or yesterday is completed
  const daysFromTodayToLatest = getDiffDays(today, uniqueDates[0]);
  if (daysFromTodayToLatest > 1) {
    // Latest completed day was before yesterday -> current streak is broken
    return { currentStreak: 0, bestStreak };
  }

  let currentStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = getDiffDays(uniqueDates[i - 1], uniqueDates[i]);
    if (diff === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
};

export const calculateAchievements = (childId: string = 'child-default-1'): AchievementBadge[] => {
  const logs = getStoredDentalHabitLogs(childId);
  const { currentStreak, bestStreak } = calculateStreak(childId);

  // 1. First Brush: Completed at least 1 valid session or log with brushing
  const completedSessionsCount = logs.reduce((acc, l) => {
    let count = l.completedSessions || 0;
    if (count === 0 && (l.morningBrushing || l.eveningBrushing)) {
      count = (l.morningBrushing ? 1 : 0) + (l.eveningBrushing ? 1 : 0);
    }
    return acc + count;
  }, 0);

  const hasFirstBrush = completedSessionsCount > 0 || logs.some((l) => l.morningBrushing || l.eveningBrushing || (l.totalBrushingSeconds && l.totalBrushingSeconds > 0));

  // 2. 3-Day Streak: Unlocked if max streak >= 3
  const maxStreak = Math.max(currentStreak, bestStreak);
  const has3DayStreak = maxStreak >= 3;

  // 3. 7-Day Streak: Unlocked if max streak >= 7
  const has7DayStreak = maxStreak >= 7;

  // 4. 2-Minute Pro: Completed 10 full 2-minute sessions
  const full2MinSessions = logs.reduce((acc, l) => {
    if (l.totalBrushingSeconds && l.totalBrushingSeconds >= 120) {
      return acc + Math.max(1, l.completedSessions || 1);
    }
    return acc + (l.completedSessions || 0);
  }, 0);
  const has2MinPro = full2MinSessions >= 10;

  // 5. Perfect Week: 100% routine consistency across a full 7-day period
  const weeklyReport = calculateWeeklyReport(childId);
  const hasPerfectWeek = weeklyReport.weeklyConsistencyPercent === 100 && maxStreak >= 7;

  return [
    {
      id: 'ach-1',
      title: 'First Brush',
      description: 'Completed your first 2-minute brushing session',
      icon: '⭐',
      unlocked: hasFirstBrush,
      points: 20,
    },
    {
      id: 'ach-2',
      title: '3-Day Streak',
      description: 'Brushed morning and night for 3 consecutive days',
      icon: '🔥',
      unlocked: has3DayStreak,
      points: 50,
    },
    {
      id: 'ach-3',
      title: '7-Day Streak',
      description: 'Completed a full 7-day daily brushing routine',
      icon: '🏆',
      unlocked: has7DayStreak,
      points: 100,
    },
    {
      id: 'ach-4',
      title: '2-Minute Pro',
      description: 'Completed 10 full 2-minute guided timer sessions',
      icon: '⏱️',
      unlocked: has2MinPro,
      points: 40,
    },
    {
      id: 'ach-5',
      title: 'Perfect Week',
      description: '100% routine consistency across a full week',
      icon: '✨',
      unlocked: hasPerfectWeek,
      points: 150,
    },
  ];
};

export const calculateWeeklyReport = (childId: string = 'child-default-1'): WeeklyHabitReport => {
  const profile = getStoredChildProfile();
  const logs = getStoredDentalHabitLogs(childId);
  const today = getTodayStr();
  const { currentStreak, bestStreak } = calculateStreak(childId);

  // Generate 7 days date strings
  const last7Days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    last7Days.push(`${y}-${m}-${day}`);
  }

  const weekLogs = logs.filter((l) => last7Days.includes(l.date));

  let morningCount = 0;
  let eveningCount = 0;
  let flossCount = 0;
  let tongueCount = 0;
  let totalSecs = 0;
  let loggedDaysCount = weekLogs.length;

  weekLogs.forEach((l) => {
    if (l.morningBrushing) morningCount++;
    if (l.eveningBrushing) eveningCount++;
    if (l.eveningFloss) flossCount++;
    if (l.morningTongue) tongueCount++;
    totalSecs += l.totalBrushingSeconds || 0;
  });

  const morningBrushingPercent = Math.round((morningCount / 7) * 100);
  const eveningBrushingPercent = Math.round((eveningCount / 7) * 100);
  const flossingPercent = Math.round((flossCount / 7) * 100);
  const tongueCleaningPercent = Math.round((tongueCount / 7) * 100);
  const avgBrushingSeconds = loggedDaysCount > 0 ? Math.round(totalSecs / loggedDaysCount) || 120 : 0;
  const weeklyConsistencyPercent = Math.round(((morningCount + eveningCount) / 14) * 100);

  // Generate rule-based insights
  const insights: string[] = [];
  if (morningBrushingPercent >= 80) {
    insights.push('Morning routine is strong and consistent this week.');
  } else {
    insights.push('Morning brushing was completed on ' + morningCount + ' of 7 days.');
  }

  if (eveningBrushingPercent < 70) {
    insights.push('Bedtime brushing was less consistent than morning brushing.');
  } else {
    insights.push('Evening routine completed consistently across most days.');
  }

  if (flossingPercent < 50) {
    insights.push('Flossing was recorded less consistently than brushing.');
  } else {
    insights.push('Flossing habit is progressing well alongside daily brushing.');
  }

  if (weekLogs.length === 0) {
    insights.length = 0;
    insights.push('Keep logging daily routines to unlock detailed weekly insights.');
  }

  return {
    childName: profile.name || 'Leo',
    childAge: profile.age || 6,
    startDate: last7Days[6],
    endDate: last7Days[0],
    totalDays: 7,
    morningBrushingPercent,
    eveningBrushingPercent,
    flossingPercent,
    tongueCleaningPercent,
    avgBrushingSeconds,
    currentStreak,
    bestStreak,
    weeklyConsistencyPercent,
    insights,
  };
};

export const getStoredBrushReplacement = (childId: string = 'child-default-1'): BrushReplacement => {
  const today = getTodayStr();
  if (typeof window === 'undefined') {
    return {
      userId: 'pat-default',
      childId,
      lastReplacementDate: today,
      nextReminderDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Suggested 3-month brush head replacement interval.',
    };
  }

  const data = localStorage.getItem(HABIT_STORAGE_KEYS.BRUSH_REPLACEMENT);
  if (data) {
    const list: BrushReplacement[] = JSON.parse(data);
    const existing = list.find((b) => b.childId === childId);
    if (existing) return existing;
  }

  const dNext = new Date();
  dNext.setMonth(dNext.getMonth() + 3);
  const initial: BrushReplacement = {
    userId: 'pat-default',
    childId,
    lastReplacementDate: today,
    nextReminderDate: dNext.toISOString().split('T')[0],
    notes: 'Suggested 3-month brush head replacement interval.',
  };
  return initial;
};

export const saveBrushReplacement = (childId: string, lastReplacementDate: string): BrushReplacement => {
  const dNext = new Date(lastReplacementDate);
  dNext.setMonth(dNext.getMonth() + 3);
  const nextReminderDate = dNext.toISOString().split('T')[0];

  const record: BrushReplacement = {
    userId: 'pat-default',
    childId,
    lastReplacementDate,
    nextReminderDate,
    notes: 'Suggested 3-month brush head replacement interval.',
  };

  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(HABIT_STORAGE_KEYS.BRUSH_REPLACEMENT);
    const list: BrushReplacement[] = data ? JSON.parse(data) : [];
    const updated = [record, ...list.filter((b) => b.childId !== childId)];
    localStorage.setItem(HABIT_STORAGE_KEYS.BRUSH_REPLACEMENT, JSON.stringify(updated));
  }

  saveApiBrushReplacement(childId, lastReplacementDate).catch((err) => console.warn('[Brush Replacement API Sync]', err.message));
  return record;
};

