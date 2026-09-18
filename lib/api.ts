import { Appointment, ScreeningResult, PatientHealthUpdate, Doctor } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Generic API Fetch helper with timeout and fallback support
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[OralSense API Warning] Endpoint ${endpoint} returned status ${response.status}`);
      return null;
    }

    const json = await response.json();
    return json.data !== undefined ? json.data : (json as T);
  } catch (error: any) {
    console.warn(`[OralSense API Note] Backend connection (${endpoint}) unavailable, fallback active:`, error.message);
    return null;
  }
}

// 1. Providers / Find Care API
export async function getApiProviders(filters?: { service?: string; country?: string }): Promise<Doctor[] | null> {
  const params = new URLSearchParams();
  if (filters?.service) params.append('service', filters.service);
  if (filters?.country) params.append('country', filters.country);
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  
  return fetchAPI<Doctor[]>(`/providers${queryStr}`);
}

// 2. Screening API
export async function saveApiScreening(screening: ScreeningResult): Promise<ScreeningResult | null> {
  return fetchAPI<ScreeningResult>('/screenings', {
    method: 'POST',
    body: JSON.stringify({
      patientId: 'pat-default',
      concern: screening.concern,
      score: screening.overallScore,
      indicationLevel: screening.indicationLevel,
      summary: screening.recommendedNextStep || 'AI-assisted screening summary',
      recommendedNextStep: screening.recommendedNextStep,
    }),
  });
}

export async function getApiScreening(patientId: string = 'pat-default'): Promise<ScreeningResult | null> {
  return fetchAPI<ScreeningResult>(`/screenings/${patientId}`);
}

// 3. Appointment API
export async function createApiAppointment(apt: Appointment): Promise<Appointment | null> {
  return fetchAPI<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify({
      patientId: 'pat-default',
      providerId: apt.doctorId,
      doctorName: apt.doctorName,
      doctorSpecialty: apt.doctorSpecialty,
      doctorImage: apt.doctorImage,
      clinicName: apt.clinicName,
      clinicAddress: apt.clinicAddress,
      service: apt.doctorSpecialty,
      concern: apt.patientNotes || 'General Care',
      date: apt.date,
      time: apt.time,
      consultationType: apt.type,
      bookingSource: apt.screeningContext?.startsWith('Direct Service:') ? 'direct-service' : 'screening',
      fee: apt.fee,
      estimatedCoverage: apt.fee ? Math.round(apt.fee * 0.65) : 120,
      patientNotes: apt.patientNotes,
    }),
  });
}

export async function getApiAppointments(patientId: string = 'pat-default'): Promise<Appointment[] | null> {
  return fetchAPI<Appointment[]>(`/appointments/${patientId}`);
}

// 4. Demo Payment API
export async function processApiDemoPayment(appointmentId: string, paymentMethod: string = 'demo-card'): Promise<{ success: boolean; paymentStatus: string; amount: number } | null> {
  return fetchAPI<{ success: boolean; paymentStatus: string; amount: number }>(`/appointments/${appointmentId}/payment`, {
    method: 'POST',
    body: JSON.stringify({ paymentMethod }),
  });
}

// 5. Health Updates API
export async function saveApiHealthUpdate(update: PatientHealthUpdate): Promise<PatientHealthUpdate | null> {
  return fetchAPI<PatientHealthUpdate>('/health-updates', {
    method: 'POST',
    body: JSON.stringify({
      patientId: 'pat-default',
      type: update.type,
      concern: update.concern,
      note: update.note,
      shareWithProvider: update.shareWithProvider,
    }),
  });
}

export async function getApiHealthUpdates(patientId: string = 'pat-default'): Promise<PatientHealthUpdate[] | null> {
  return fetchAPI<PatientHealthUpdate[]>(`/health-updates/${patientId}`);
}
