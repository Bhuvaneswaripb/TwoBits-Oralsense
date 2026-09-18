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
  return data ? JSON.parse(data) : INITIAL_PATIENT_PROFILE;
};

export const savePatientProfile = (profile: PatientProfile): void => {
  if (typeof window === 'undefined') return;
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
