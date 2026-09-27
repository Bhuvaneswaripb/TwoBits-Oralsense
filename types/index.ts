export type FeaturedConcernType =
  | 'Bruxism & Jaw Health'
  | 'Tooth Pain & Cavity Concerns'
  | 'Gum Health'
  | 'Tooth Sensitivity'
  | 'Tooth Wear'
  | 'Cracked / Chipped Tooth';

export type SecondaryConcernType =
  | 'Oral Ulcer Concerns'
  | 'Bad Breath'
  | 'Dry Mouth'
  | 'Wisdom Tooth Concerns'
  | 'Jaw / TMJ Symptoms'
  | 'Enamel Damage'
  | 'Swollen / Painful Gums'
  | 'Other Dental Concern';

export type ConcernType = FeaturedConcernType | SecondaryConcernType;

export type ServiceType =
  | 'Teeth Cleaning & Scaling'
  | 'Teeth Cleaning'
  | 'Routine Dental Check-up'
  | 'Teeth Whitening'
  | 'Dental Veneers'
  | 'Dental Bonding'
  | 'Tooth & Gum Contouring'
  | 'Dental Implants'
  | 'Fillings'
  | 'Root Canal Consultation'
  | 'Crown Consultation'
  | 'Braces Consultation'
  | 'Clear Aligners Consultation'
  | 'Night Guard / Bruxism Care'
  | 'Tooth Restoration'
  | 'Gum Care'
  | 'Dental Consultation';

export type NeutralIndication = 'LOWER CONCERN' | 'MODERATE CONCERN' | 'HIGHER CONCERN';

export interface QuestionOption {
  label: string;
  value: number; // 0 to 4 score scale
}

export interface Question {
  id: number;
  concern: ConcernType;
  text: string;
  category: 'symptom' | 'behavior' | 'physical';
  options: QuestionOption[];
}

export interface VisualInputConfig {
  mediaType: 'photo' | 'video' | 'none';
  title: string;
  description: string;
  instructions: string[];
}

export interface ScreeningAnswers {
  [questionId: number]: number;
}

export interface AttachedVisualInput {
  type: 'photo' | 'video';
  fileUrl: string;
  fileName: string;
  timestamp: string;
}

export interface ScreeningResult {
  id: string;
  date: string;
  concern: ConcernType;
  overallScore: number; // 0-100
  indicationLevel: NeutralIndication;
  riskLevel?: string; // Optional alias for indicationLevel
  symptomsScore: number;
  whyHighlighted: string[];
  recommendedNextStep: string;
  hasVisualInput: boolean;
  visualInputType?: 'photo' | 'video';
  attachedVisualInput?: AttachedVisualInput;
  recommendations: string[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  clinicId?: string;
  clinic: string;
  clinicAddress: string;
  experienceYears: number;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  availableToday: boolean;
  consultationType: ('In-Person' | 'Video Consultation')[];
  image: string;
  about: string;
  education: string[];
  areasOfCare: string[];
  relevantConcerns?: ConcernType[];
  relevantServices?: ServiceType[];
  availableSlots: {
    date: string;
    slots: string[];
  }[];
}

export interface DentalClinic {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Dental Hub';
  location: string;
  address: string;
  image: string;
  rating: number;
  reviewCount: number;
  phone: string;
  openingHours: string;
  departments: string[];
  services: ServiceType[];
  consultationTypes: ('In-Person' | 'Video Consultation')[];
  about: string;
  doctors: Doctor[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  clinicName: string;
  clinicAddress: string;
  date: string; // e.g. "2026-09-20"
  time: string; // e.g. "10:30 AM"
  type: 'In-Person' | 'Video Consultation';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  patientNotes?: string;
  screeningContext?: string;
  fee: number;
  createdAt: string;
}

export interface NightlyTelemetry {
  date: string; // YYYY-MM-DD
  sleepDurationMinutes: number;
  biteEventsCount: number;
  avgPressurePercent: number;
  peakPressurePercent: number;
  avgEventDurationSec: number;
  restlessnessIndex: number;
  pressureTrend: { time: string; pressure: number }[];
}

export interface PatientProfile {
  name: string;
  email: string;
  phone: string;
  age: number;
  dateOfBirth?: string;
  mode?: 'kid' | 'adult';
  gender: string;
  location: string;
  mouthguardConnected: boolean;
  mouthguardBatteryPercent: number;
  mouthguardLastSynced: string;
}

export interface SymptomLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Mon", "Tue"
  concernCategory: ConcernType;
  primaryValue: number; // 0-10
  secondaryValue: number; // 0-10
  tertiaryValue: number; // 0-10
  notes?: string;
}

export interface FollowUpSubmission {
  id: string;
  date: string;
  appointmentId?: string;
  painLevel: number; // 0-10
  sensitivityLevel: number; // 0-10
  hasNewSymptoms: boolean;
  notes?: string;
  nextFollowUpDate: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  author: string;
  observation: string;
  recommendation: string;
  followUpDate: string;
}

export interface PatientHealthUpdate {
  id: string;
  date: string;
  type: 'New Symptom' | 'Worsened' | 'Improved' | 'Routine Note';
  concern: string;
  note: string;
  mediaUrl?: string;
  shareWithProvider: boolean;
}

export type InsuranceRegion = 'US' | 'UK' | 'Australia';

export interface InsuranceEstimate {
  region: InsuranceRegion;
  providerName: string;
  tierOrPlan: string;
  coveragePercent: number;
  estimatedOutofPocket: number;
  isDemoEstimate: true;
  notes: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  clinicName: string;
  clinicAddress: string;
  date: string; // e.g. "2026-09-20"
  time: string; // e.g. "10:30 AM"
  type: 'In-Person' | 'Video Consultation';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  patientNotes?: string;
  screeningContext?: string;
  fee: number;
  insuranceEstimate?: InsuranceEstimate;
  consentToShare?: boolean;
  createdAt: string;
}

export interface PracticePatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  concern: ConcernType;
  screeningDate: string;
  screeningIndication: NeutralIndication;
  screeningScore: number;
  hasVisualInput: boolean;
  visualInputType?: 'photo' | 'video';
  screeningAnswers: { question: string; answer: string }[];
  whyHighlighted: string[];
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentStatus?: 'Scheduled' | 'Completed' | 'Pending';
  monitoringStatus: 'Active' | 'Pending' | 'Completed';
  followUpStatus: 'Due' | 'Completed' | 'Pending';
  timelineStage: 'Screening' | 'Appointment' | 'Clinical Assessment' | 'Monitoring' | 'Follow-Up';
  clinicalNotes: ClinicalNote[];
  patientHealthUpdates?: PatientHealthUpdate[];
  symptomHistory?: SymptomLogEntry[];
}

export interface InsuranceProfile {
  id?: string;
  _id?: string;
  patientId?: string;
  country: string;
  provider: string;
  planName: string;
  memberId: string;
  policyNumber: string;
  coverageType: string;
  policyStartDate: string;
  policyEndDate: string;
  dentalCoverage: string[];
  annualLimit: number;
  remainingBenefit: number;
  deductible?: number;
  copayment?: number;
  waitingPeriod: string;
  preAuthorizationRequired: 'Yes' | 'No' | 'Unknown';
  isUserProvided?: boolean;
}

export interface ClaimDocument {
  id?: string;
  name: string;
  type: string;
  status: 'Uploaded' | 'Missing' | 'Not Required';
  fileUrl?: string;
  uploadedAt?: string;
}

export interface DentalClaim {
  id?: string;
  _id?: string;
  patientId?: string;
  insuranceProfileId?: string;
  insuranceProvider: string;
  planName?: string;
  memberId?: string;
  policyNumber?: string;
  providerName: string;
  clinicName: string;
  dentistName?: string;
  treatmentDate: string;
  serviceName: string;
  description?: string;
  amountCharged: number;
  amountPaid: number;
  paymentMethod?: string;
  claimReference: string;
  preAuthNumber?: string;
  status:
    | 'DRAFT'
    | 'DOCUMENTS NEEDED'
    | 'READY TO SUBMIT'
    | 'SUBMITTED'
    | 'UNDER REVIEW'
    | 'APPROVED'
    | 'PARTIALLY REIMBURSED'
    | 'REJECTED'
    | 'PAID';
  documents: ClaimDocument[];
  submittedAt?: string;
  createdAt?: string;
}

export interface ChildProfile {
  id?: string;
  _id?: string;
  userId: string;
  name: string;
  age: number;
  avatar: string;
  morningReminderTime?: string;
  eveningReminderTime?: string;
  createdAt?: string;
}

export interface DentalHabitLog {
  id?: string;
  _id?: string;
  userId: string;
  childId: string;
  date: string; // YYYY-MM-DD
  morningBrushing: boolean;
  morningTongue: boolean;
  eveningBrushing: boolean;
  eveningFloss: boolean;
  totalBrushingSeconds?: number;
  completedSessions?: number;
}

export interface BrushReplacement {
  id?: string;
  _id?: string;
  userId: string;
  childId: string;
  lastReplacementDate: string; // YYYY-MM-DD
  nextReminderDate: string; // YYYY-MM-DD (calculated 3 months out)
  notes?: string;
}

export interface DentalProduct {
  id: string;
  name: string;
  category: "Children's Toothbrushes" | "Electric Toothbrushes" | "Toothpaste" | "Flossers" | "Replacement Brush Heads";
  ageRange: string;
  description: string;
  price: number;
  image?: string;
  recommendedFor: string;
  learnMoreUrl?: string;
  isDemoItem?: boolean;
  features?: string[];
  inStock?: boolean;
  currency?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: DentalProduct;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface DentalOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  shippingDetails: ShippingDetails;
  status: 'Confirmed' | 'Dispatched' | 'Delivered';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  points: number;
}

export interface WeeklyHabitReport {
  childName: string;
  childAge: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  morningBrushingPercent: number;
  eveningBrushingPercent: number;
  flossingPercent: number;
  tongueCleaningPercent: number;
  avgBrushingSeconds: number;
  currentStreak: number;
  bestStreak: number;
  weeklyConsistencyPercent: number;
  insights: string[];
  areasToImprove?: string[];
}

