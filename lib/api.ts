import { Appointment, ScreeningResult, PatientHealthUpdate, Doctor } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Generic API Fetch helper with timeout and fallback support
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
    console.warn(`[OralSense API Note] Backend connection (${endpoint}) unavailable:`, error.message);
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
export async function saveApiScreening(screeningPayload: any): Promise<ScreeningResult | null> {
  return fetchAPI<ScreeningResult>('/screenings', {
    method: 'POST',
    body: JSON.stringify({
      patientId: 'pat-default',
      ...screeningPayload,
    }),
  });
}

export async function getApiScreening(patientId: string = 'pat-default'): Promise<ScreeningResult | null> {
  return fetchAPI<ScreeningResult>(`/screenings/${patientId}`);
}

// 3. Appointment API
export async function createApiAppointment(apt: Appointment & { insuranceProfileId?: string }): Promise<Appointment | null> {
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
      insuranceProfileId: apt.insuranceProfileId || null,
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

// 6. Insurance Profile API
export async function getApiInsuranceProfile(patientId: string = 'pat-default'): Promise<any | null> {
  return fetchAPI<any>(`/insurance/${patientId}`);
}

export async function saveApiInsuranceProfile(profile: any): Promise<any | null> {
  return fetchAPI<any>('/insurance', {
    method: 'POST',
    body: JSON.stringify({
      patientId: 'pat-default',
      ...profile,
    }),
  });
}

// 7. Insurance Claims API
export async function getApiClaims(patientId: string = 'pat-default'): Promise<any[] | null> {
  return fetchAPI<any[]>(`/claims/${patientId}`);
}

export async function createApiClaim(claim: any): Promise<any | null> {
  return fetchAPI<any>('/claims', {
    method: 'POST',
    body: JSON.stringify({
      patientId: 'pat-default',
      ...claim,
    }),
  });
}

export async function updateApiClaim(id: string, updates: any): Promise<any | null> {
  return fetchAPI<any>(`/claims/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// 8. Dental Habits API
export async function getApiChildProfile(userId: string = 'pat-default'): Promise<any | null> {
  return fetchAPI<any>(`/dental-habits/profile/${userId}`);
}

export async function saveApiChildProfile(profile: any): Promise<any | null> {
  return fetchAPI<any>('/dental-habits/profile', {
    method: 'POST',
    body: JSON.stringify({
      userId: 'pat-default',
      ...profile,
    }),
  });
}

export async function getApiTodayHabitLog(childId: string): Promise<any | null> {
  return fetchAPI<any>(`/dental-habits/today/${childId}`);
}

export async function saveApiHabitLog(log: any): Promise<any | null> {
  return fetchAPI<any>('/dental-habits/log', {
    method: 'POST',
    body: JSON.stringify({
      userId: 'pat-default',
      ...log,
    }),
  });
}

export async function getApiWeeklyHabitLogs(childId: string): Promise<any[] | null> {
  return fetchAPI<any[]>(`/dental-habits/weekly/${childId}`);
}

export async function getApiDentalProducts(): Promise<any[] | null> {
  return fetchAPI<any[]>('/dental-habits/products');
}

export async function getApiBrushReplacement(childId: string): Promise<any | null> {
  return fetchAPI<any>(`/dental-habits/replacement/${childId}`);
}

export async function saveApiBrushReplacement(childId: string, lastReplacementDate: string): Promise<any | null> {
  return fetchAPI<any>('/dental-habits/replacement', {
    method: 'POST',
    body: JSON.stringify({
      userId: 'pat-default',
      childId,
      lastReplacementDate,
    }),
  });
}

export async function saveApiPatientProfile(profile: any): Promise<any | null> {
  return fetchAPI<any>('/patients', {
    method: 'POST',
    body: JSON.stringify(profile),
  });
}


