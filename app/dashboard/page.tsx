'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getStoredPatientProfile,
  getStoredScreeningResult,
  getStoredAppointments,
  getStoredPatientHealthUpdates,
  addPatientHealthUpdate,
} from '@/lib/storage';
import { PatientProfile, ScreeningResult, Appointment, PatientHealthUpdate } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  Calendar,
  Stethoscope,
  ShieldCheck,
  Activity,
  Plus,
  X,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  Info,
  CreditCard,
  Lock,
  Share2,
  AlertCircle,
} from 'lucide-react';

interface JourneyNode {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  status: 'completed' | 'current' | 'upcoming';
  category: 'Screening' | 'Service' | 'Appointment' | 'Payment' | 'Consultation' | 'Follow-up';
  detail: {
    heading: string;
    description: string;
    metadata?: string;
    actionText?: string;
    actionHref?: string;
  };
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [screening, setScreening] = useState<ScreeningResult | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [healthUpdates, setHealthUpdates] = useState<PatientHealthUpdate[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Health Update Modal state
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [updateType, setUpdateType] = useState<PatientHealthUpdate['type']>('New Symptom');
  const [updateConcern, setUpdateConcern] = useState('Gum Health');
  const [updateNote, setUpdateNote] = useState('');
  const [shareWithProvider, setShareWithProvider] = useState(true);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setProfile(getStoredPatientProfile());
    setScreening(getStoredScreeningResult());
    setAppointments(getStoredAppointments());
    setHealthUpdates(getStoredPatientHealthUpdates());
  }, []);

  if (!mounted) return null;

  const upcomingApt = appointments.find((a) => a.status === 'Upcoming');
  const isDirectServiceApt = Boolean(upcomingApt?.screeningContext?.startsWith('Direct Service:'));

  const hasScreening = Boolean(screening && screening.concern && screening.overallScore > 0 && !isDirectServiceApt);
  const hasAppointment = Boolean(upcomingApt || appointments.length > 0);
  const hasData = hasScreening || hasAppointment;

  // Compute Journey Path Nodes
  let journeyNodes: JourneyNode[] = [];

  if (hasScreening) {
    // SCREENING PATH
    journeyNodes = [
      {
        id: 'node-concern',
        title: 'Concern Identified',
        subtitle: screening?.concern || 'Dental Concern Logged',
        date: screening?.date || 'Recent',
        status: 'completed',
        category: 'Screening',
        detail: {
          heading: 'Dental Concern Logged',
          description: `Patient reported concern: "${screening?.concern}". Early screening requested.`,
          metadata: `Date: ${screening?.date}`,
          actionText: 'View Screening',
          actionHref: '/results',
        },
      },
      {
        id: 'node-screening',
        title: 'Screening Completed',
        subtitle: `Score: ${screening?.overallScore}/100 • ${screening?.indicationLevel}`,
        date: screening?.date || 'Recent',
        status: 'completed',
        category: 'Screening',
        detail: {
          heading: 'OralSense AI Screening',
          description: `Analysis completed with overall score of ${screening?.overallScore}/100. Indication level: ${screening?.indicationLevel}.`,
          metadata: `Visual Input: ${screening?.hasVisualInput ? 'Attached' : 'Questionnaire'}`,
          actionText: 'Review Full Summary',
          actionHref: '/results',
        },
      },
      {
        id: 'node-summary',
        title: 'Screening Summary',
        subtitle: screening?.indicationLevel || 'Summary Generated',
        date: screening?.date || 'Recent',
        status: 'completed',
        category: 'Screening',
        detail: {
          heading: 'AI-Assisted Screening Summary',
          description: screening?.recommendedNextStep || 'Review recommendations and matched dental specialists.',
          actionText: 'Find Recommended Care',
          actionHref: `/find-care?concern=${encodeURIComponent(screening?.concern || '')}`,
        },
      },
      {
        id: 'node-provider',
        title: 'Care Provider',
        subtitle: upcomingApt ? upcomingApt.clinicName : 'Demo Dental Clinic Matched',
        date: upcomingApt ? upcomingApt.createdAt || 'Active' : 'Pending Choice',
        status: upcomingApt ? 'completed' : 'current',
        category: 'Service',
        detail: {
          heading: upcomingApt ? upcomingApt.doctorName : 'Dental Specialist Matched',
          description: upcomingApt ? `${upcomingApt.doctorSpecialty} at ${upcomingApt.clinicName}` : 'Select a recommended provider for evaluation.',
          actionText: 'Browse Care Providers',
          actionHref: '/find-care',
        },
      },
      {
        id: 'node-appointment',
        title: 'Appointment',
        subtitle: upcomingApt ? `${upcomingApt.date} at ${upcomingApt.time}` : 'Schedule Dental Consultation',
        date: upcomingApt ? upcomingApt.date : 'Upcoming',
        status: upcomingApt ? 'current' : 'upcoming',
        category: 'Appointment',
        detail: {
          heading: upcomingApt ? `Appointment with ${upcomingApt.doctorName}` : 'Schedule Dental Visit',
          description: upcomingApt ? `Clinic: ${upcomingApt.clinicName}, ${upcomingApt.clinicAddress}` : 'Book a convenient time with your provider.',
          metadata: upcomingApt ? `Status: ${upcomingApt.status} • Fee: $${upcomingApt.fee}` : undefined,
          actionText: upcomingApt ? 'View Booking Details' : 'Book Appointment',
          actionHref: upcomingApt ? '/appointments' : '/find-care',
        },
      },
      {
        id: 'node-consultation',
        title: 'Consultation',
        subtitle: 'In-Person Dental Evaluation',
        date: upcomingApt ? upcomingApt.date : 'Pending',
        status: 'upcoming',
        category: 'Consultation',
        detail: {
          heading: 'In-Person Clinical Consultation',
          description: 'Clinician performs physical exam, reviews screening summary, and discusses treatment plan.',
        },
      },
      {
        id: 'node-followup',
        title: 'Follow-Up',
        subtitle: 'Care Continuity Check-In',
        date: 'Post-Consultation',
        status: 'upcoming',
        category: 'Follow-up',
        detail: {
          heading: 'Ongoing Care & Symptom Monitoring',
          description: 'Log symptoms and submit post-visit check-ins to maintain long-term oral health.',
          actionText: 'Submit Check-In',
          actionHref: '/follow-up',
        },
      },
    ];
  } else if (hasAppointment) {
    // DIRECT SERVICE PATH
    const apt = upcomingApt || appointments[0];
    journeyNodes = [
      {
        id: 'node-service',
        title: 'Service Selected',
        subtitle: apt.doctorSpecialty || 'Dental Care Service',
        date: apt.createdAt || 'Recent',
        status: 'completed',
        category: 'Service',
        detail: {
          heading: 'Dental Service Selected',
          description: `Direct care service selected: ${apt.doctorSpecialty} at ${apt.clinicName}.`,
          metadata: `Category: Direct Service`,
        },
      },
      {
        id: 'node-dentist',
        title: 'Dentist Selected',
        subtitle: apt.doctorName,
        date: apt.createdAt || 'Recent',
        status: 'completed',
        category: 'Service',
        detail: {
          heading: apt.doctorName,
          description: `Clinic: ${apt.clinicName}. Address: ${apt.clinicAddress}.`,
        },
      },
      {
        id: 'node-appointment',
        title: 'Appointment Booked',
        subtitle: `${apt.date} at ${apt.time}`,
        date: apt.date,
        status: 'current',
        category: 'Appointment',
        detail: {
          heading: `Upcoming Appointment: ${apt.type}`,
          description: `Scheduled with ${apt.doctorName} on ${apt.date} at ${apt.time}.`,
          metadata: `Clinic: ${apt.clinicName}`,
          actionText: 'Manage Appointment',
          actionHref: '/appointments',
        },
      },
      {
        id: 'node-payment',
        title: 'Payment Completed',
        subtitle: `Demo payment ($${apt.fee})`,
        date: apt.createdAt || 'Completed',
        status: 'completed',
        category: 'Payment',
        detail: {
          heading: 'Demo Payment Confirmation',
          description: `Consultation fee of $${apt.fee} confirmed under demo patient coverage.`,
        },
      },
      {
        id: 'node-consultation',
        title: 'Consultation & Service',
        subtitle: 'Treatment Session',
        date: apt.date,
        status: 'upcoming',
        category: 'Consultation',
        detail: {
          heading: 'Clinical Evaluation & Service Delivery',
          description: 'Patient attends appointment for selected dental care service.',
        },
      },
      {
        id: 'node-followup',
        title: 'Follow-Up Care',
        subtitle: 'Care Continuity',
        date: 'Post-Visit',
        status: 'upcoming',
        category: 'Follow-up',
        detail: {
          heading: 'Post-Treatment Care Continuity',
          description: 'Track recovery and record health updates as needed.',
          actionText: 'Submit Follow-Up',
          actionHref: '/follow-up',
        },
      },
    ];
  }

  // Calculate Progress Stats
  const completedCount = journeyNodes.filter((n) => n.status === 'completed').length;
  const totalCount = journeyNodes.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentNode = journeyNodes.find((n) => n.status === 'current') || journeyNodes[completedCount] || journeyNodes[0];

  const activeSelectedNode = selectedNodeId
    ? journeyNodes.find((n) => n.id === selectedNodeId)
    : currentNode;

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateNote.trim()) return;
    if (isSubmittingUpdate) return;

    setIsSubmittingUpdate(true);
    setUpdateError(null);

    const newUpdate: PatientHealthUpdate = {
      id: `upd-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: updateType,
      concern: updateConcern,
      note: updateNote.trim(),
      shareWithProvider,
    };

    try {
      const response = await fetch('http://localhost:5000/api/health-updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: 'pat-default',
          type: newUpdate.type,
          concern: newUpdate.concern,
          note: newUpdate.note,
          shareWithProvider: newUpdate.shareWithProvider,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Backend server returned status ${response.status}`);
      }

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.message || 'Failed to save health update.');
      }

      const updatedList = addPatientHealthUpdate(newUpdate);
      setHealthUpdates(updatedList);
      setUpdateNote('');
      setIsAddUpdateOpen(false);
    } catch (err: any) {
      setUpdateError(err.message || 'Error connecting to backend server.');
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <Badge variant="primary" className="bg-brand-100 text-brand-800 border-brand-200 mb-1.5 font-bold">
            PATIENT CARE ROUTE
          </Badge>
          <h1 className="text-3xl font-extrabold text-brand-950 tracking-tight">
            My Dental Journey
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Follow your progress from your first concern to continued care.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddUpdateOpen(true)}
            icon={<Plus className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-0 shadow-sm"
          >
            Add Health Update
          </Button>
          <Link href="/screening">
            <Button variant="outline" size="sm" icon={<Stethoscope className="w-4 h-4 text-brand-600" />}>
              Screening
            </Button>
          </Link>
          <Link href="/find-care">
            <Button variant="outline" size="sm">
              Find Care
            </Button>
          </Link>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!hasData ? (
        <Card className="p-10 text-center max-w-2xl mx-auto space-y-6 shadow-subtle border-slate-200">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto border border-brand-100 shadow-inner">
            <Sparkles className="w-8 h-8 text-brand-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-brand-950 tracking-tight">
              Your dental journey starts here.
            </h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              Complete a screening or choose a dental service to begin tracking your care.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/screening">
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold" icon={<ArrowRight className="w-4 h-4" />}>
                START SCREENING
              </Button>
            </Link>
            <Link href="/find-care">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-bold">
                FIND CARE
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {/* CARE PROGRESS BAR */}
          <Card className="p-6 bg-white shadow-subtle border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-600" />
                Your care progress
              </span>
              <span className="font-bold text-brand-950 font-mono bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                {completedCount} of {totalCount} steps completed
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="h-full bg-gradient-to-r from-brand-700 via-brand-600 to-cyan-500 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </Card>

          {/* JOURNEY MAP - CONNECTED CARE PATH */}
          <Card className="p-6 sm:p-8 bg-white shadow-subtle border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-brand-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                  Care Progress Map
                </h2>
                <p className="text-xs text-slate-500">
                  Click any milestone node to view details.
                </p>
              </div>

              <Badge variant="neutral" className="text-xs font-mono text-brand-700 bg-brand-50">
                {hasScreening ? 'Screening Path' : 'Direct Service Path'}
              </Badge>
            </div>

            {/* Desktop & Mobile Connected Timeline */}
            <div className="relative pt-2 pb-4">
              {/* Connecting Line */}
              <div className="absolute left-6 sm:left-1/2 top-8 bottom-8 w-1 bg-slate-200 sm:-translate-x-1/2 -z-0" />

              <div className="space-y-6 relative z-10">
                {journeyNodes.map((node, index) => {
                  const isCompleted = node.status === 'completed';
                  const isCurrent = node.status === 'current';
                  const isSelected = activeSelectedNode?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`cursor-pointer transition-all duration-200 group flex items-start gap-4 sm:gap-8 ${
                        index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                      }`}
                    >
                      {/* Left Content (Desktop Alternating) */}
                      <div className={`hidden sm:block sm:w-1/2 ${index % 2 === 0 ? 'text-right pr-6' : 'text-left pl-6'}`}>
                        <div
                          className={`inline-block p-4 rounded-2xl border transition-all ${
                            isSelected
                              ? 'bg-brand-50/90 border-brand-300 ring-2 ring-brand-500/20 shadow-md'
                              : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="text-xs font-mono text-slate-400 font-semibold">{node.date}</div>
                          <div className="text-sm font-bold text-brand-950 flex items-center gap-1.5 justify-end">
                            {node.title}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">{node.subtitle}</div>
                        </div>
                      </div>

                      {/* Center Connected Node Pin */}
                      <div className="relative shrink-0 flex items-center justify-center left-1.5 sm:left-0">
                        {isCompleted ? (
                          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md ring-4 ring-white">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-10 h-10 rounded-full bg-brand-900 text-cyan-300 flex items-center justify-center shadow-glow ring-4 ring-cyan-400/40 animate-pulse">
                            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center shadow-sm ring-4 ring-white">
                            <div className="w-3 h-3 rounded-full bg-slate-300" />
                          </div>
                        )}
                      </div>

                      {/* Right Content / Mobile Timeline Card */}
                      <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:pl-6' : 'sm:pr-6 sm:text-right'}`}>
                        <div
                          className={`p-4 rounded-2xl border transition-all ${
                            isSelected
                              ? 'bg-brand-50/90 border-brand-300 ring-2 ring-brand-500/20 shadow-md'
                              : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex items-center justify-between sm:justify-start gap-2 text-xs font-mono text-slate-400 font-semibold mb-1">
                            <span>{node.date}</span>
                            {isCurrent && (
                              <Badge variant="primary" className="text-[10px] bg-cyan-600 text-white border-0">
                                CURRENT STEP
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm font-bold text-brand-950">{node.title}</div>
                          <div className="text-xs text-slate-600 mt-0.5">{node.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* CURRENT STEP & MILESTONE DETAILS SECTION */}
          {activeSelectedNode && (
            <Card className="p-6 bg-white shadow-subtle border-brand-200/80 space-y-4 ring-1 ring-brand-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                    <Info className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Milestone Detail</span>
                    <h3 className="text-base font-bold text-brand-950">{activeSelectedNode.title}</h3>
                  </div>
                </div>

                <Badge
                  variant={activeSelectedNode.status === 'completed' ? 'success' : activeSelectedNode.status === 'current' ? 'primary' : 'neutral'}
                  className="text-xs"
                >
                  {activeSelectedNode.status.toUpperCase()}
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                <div className="font-bold text-slate-900 text-sm">{activeSelectedNode.detail.heading}</div>
                <p className="text-slate-700 leading-relaxed font-medium">{activeSelectedNode.detail.description}</p>
                
                {activeSelectedNode.detail.metadata && (
                  <div className="text-slate-500 font-mono text-[11px] pt-1 border-t border-slate-200/60">
                    {activeSelectedNode.detail.metadata}
                  </div>
                )}
              </div>

              {activeSelectedNode.detail.actionText && activeSelectedNode.detail.actionHref && (
                <div className="flex justify-end pt-1">
                  <Link href={activeSelectedNode.detail.actionHref}>
                    <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      {activeSelectedNode.detail.actionText}
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          )}

          {/* HEALTH UPDATES SECTION */}
          <Card className="p-6 bg-white shadow-subtle border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-brand-950 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Patient Health Updates ({healthUpdates.length})
                </h2>
                <p className="text-xs text-slate-500">Record symptom changes or notes for your dental care team.</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddUpdateOpen(true)}
                icon={<Plus className="w-3.5 h-3.5 text-emerald-600" />}
                className="text-xs font-bold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              >
                Log Update
              </Button>
            </div>

            <div className="space-y-3">
              {healthUpdates.length > 0 ? (
                healthUpdates.map((upd) => (
                  <div key={upd.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Badge
                          variant={upd.type === 'Worsened' ? 'danger' : upd.type === 'Improved' ? 'success' : 'primary'}
                          className="text-[10px]"
                        >
                          {upd.type}
                        </Badge>
                        <span>{upd.concern}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{upd.date}</span>
                    </div>

                    <p className="text-slate-700 font-medium leading-relaxed">{upd.note}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                      {upd.shareWithProvider ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Share2 className="w-3 h-3 text-emerald-600" /> Shared with provider
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-400" /> Kept private
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No health updates recorded yet. Click "+ Add Health Update" to log changes.
                </div>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Add Health Update Modal Overlay */}
      {isAddUpdateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-6 sm:p-8 bg-white border-brand-100 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <Badge variant="primary" className="mb-1">PATIENT JOURNAL</Badge>
                <h2 className="text-xl font-extrabold text-brand-950">How has your dental concern changed?</h2>
              </div>
              <button onClick={() => setIsAddUpdateOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUpdate} className="space-y-4 text-xs">
              {updateError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{updateError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Status Change</label>
                <div className="grid grid-cols-3 gap-2">
                  {['New Symptom', 'Worse', 'Improved', 'No Change', 'General Note'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUpdateType(t === 'Worse' ? 'Worsened' : t === 'No Change' || t === 'General Note' ? 'Routine Note' : (t as any))}
                      className={`p-2 rounded-xl border font-bold text-center transition-all ${
                        (updateType === 'Worsened' && t === 'Worse') || (updateType === 'Routine Note' && (t === 'No Change' || t === 'General Note')) || updateType === t
                          ? 'bg-brand-900 text-white border-brand-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Dental Concern Area</label>
                <select
                  value={updateConcern}
                  onChange={(e) => setUpdateConcern(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  <option value="Bruxism & Jaw Health">Bruxism & Jaw Health</option>
                  <option value="Tooth Pain & Cavity Concerns">Tooth Pain & Cavity Concerns</option>
                  <option value="Gum Health">Gum Health</option>
                  <option value="Tooth Sensitivity">Tooth Sensitivity</option>
                  <option value="Tooth Wear & Damage">Tooth Wear & Damage</option>
                  <option value="Oral Ulcer Concerns">Oral Ulcer Concerns</option>
                  <option value="Other Dental Concern">Other Dental Concern</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us what changed..."
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                />
              </div>

              <label className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareWithProvider}
                  onChange={(e) => setShareWithProvider(e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300"
                />
                <span className="font-semibold text-slate-700">Share with provider</span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button variant="outline" size="md" type="button" onClick={() => setIsAddUpdateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isSubmittingUpdate}
                  className="font-bold bg-emerald-600 hover:bg-emerald-700 border-0"
                >
                  {isSubmittingUpdate ? 'SAVING...' : 'SAVE UPDATE'}
                </Button>
              </div>
            </form>

          </Card>
        </div>
      )}

    </div>
  );
}
