'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredPracticePatients, addClinicalNoteToPatient } from '@/lib/storage';
import { PracticePatient, ClinicalNote } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  Calendar,
  Activity,
  CheckCircle2,
  Search,
  Plus,
  X,
  FileText,
  Clock,
  ChevronRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  AlertCircle,
  Camera,
  Video,
} from 'lucide-react';

export default function PracticeDashboardPage() {
  const [patients, setPatients] = useState<PracticePatient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PracticePatient | null>(null);

  // Clinical Note Form state
  const [observation, setObservation] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [followUpDate, setFollowUpDate] = useState('24 Sept 2026');
  const [noteAddedSuccess, setNoteAddedSuccess] = useState(false);

  useEffect(() => {
    setPatients(getStoredPracticePatients());
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.concern.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !observation) return;

    const newNote: ClinicalNote = {
      id: `cn-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      author: 'Dr. Ananya Menon',
      observation,
      recommendation,
      followUpDate,
    };

    const updatedPatients = addClinicalNoteToPatient(selectedPatient.id, newNote);
    setPatients(updatedPatients);

    const updatedSelected = updatedPatients.find((p) => p.id === selectedPatient.id);
    if (updatedSelected) setSelectedPatient(updatedSelected);

    setObservation('');
    setRecommendation('');
    setNoteAddedSuccess(true);
    setTimeout(() => setNoteAddedSuccess(false), 2500);
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-slate-50/50">
      
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-brand-600" />
            <Badge variant="primary" className="bg-brand-100 text-brand-800 border-brand-200">
              PRACTICE PORTAL
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-950 tracking-tight">
            BruxShield Practice Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-0.5">
            Manage patient screening leads, symptom histories, appointments, and care follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/for-practices">
            <Button variant="outline" size="sm">
              Practice Workflow Info
            </Button>
          </Link>
          <Link href="/screening">
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              Test Screening Form
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <Card className="p-5 shadow-subtle border-slate-200 flex items-center justify-between bg-white">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">New Screenings</span>
            <div className="text-3xl font-extrabold text-brand-950">24</div>
            <div className="text-xs text-brand-600 font-semibold">+6 this week</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 shadow-subtle border-slate-200 flex items-center justify-between bg-white">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Upcoming Appointments</span>
            <div className="text-3xl font-extrabold text-brand-950">9</div>
            <div className="text-xs text-emerald-600 font-semibold">3 today</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 shadow-subtle border-slate-200 flex items-center justify-between bg-white">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Monitoring</span>
            <div className="text-3xl font-extrabold text-brand-950">17</div>
            <div className="text-xs text-indigo-600 font-semibold">Daily check-ins logged</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 shadow-subtle border-slate-200 flex items-center justify-between bg-white">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Follow-Ups Due</span>
            <div className="text-3xl font-extrabold text-brand-950">6</div>
            <div className="text-xs text-amber-600 font-semibold">Action required</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Card>

      </div>

      {/* Search & Patient Table Section */}
      <Card className="p-6 shadow-subtle border-slate-200 bg-white space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-brand-950">Screening Leads & Patient Directory</h2>
            <p className="text-xs text-slate-500">Structured patient screening outcomes and care status</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient or concern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Concern</th>
                <th className="py-3 px-4">Screening Indication</th>
                <th className="py-3 px-4">Appointment</th>
                <th className="py-3 px-4">Monitoring</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  <td className="py-4 px-4">
                    <div className="font-bold text-brand-950 flex items-center gap-1.5">
                      {patient.name}
                      {patient.hasVisualInput && (
                        <span title={`Attached ${patient.visualInputType}`}>
                          {patient.visualInputType === 'video' ? (
                            <Video className="w-3.5 h-3.5 text-cyan-600 inline" />
                          ) : (
                            <Camera className="w-3.5 h-3.5 text-cyan-600 inline" />
                          )}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{patient.age} yrs • {patient.gender}</div>
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-800">
                    {patient.concern}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        patient.screeningIndication === 'HIGHER CONCERN'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : patient.screeningIndication === 'MODERATE CONCERN'
                          ? 'bg-cyan-100 text-cyan-900 border border-cyan-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {patient.screeningIndication} ({patient.screeningScore} pts)
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px]">
                    {patient.appointmentDate ? `${patient.appointmentDate} (${patient.appointmentTime})` : 'Unscheduled'}
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant={patient.monitoringStatus === 'Active' ? 'success' : 'neutral'}>
                      {patient.monitoringStatus}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 font-semibold text-brand-700">
                    {patient.timelineStage}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPatient(patient)}
                      icon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      View Dossier
                    </Button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </Card>

      {/* Patient Dossier Drawer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border-l border-slate-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <Badge variant="primary" className="mb-1">PATIENT DOSSIER</Badge>
                <h2 className="text-2xl font-extrabold text-brand-950">{selectedPatient.name}</h2>
                <div className="text-xs text-slate-500 flex items-center gap-4 mt-1">
                  <span>{selectedPatient.phone}</span>
                  <span>•</span>
                  <span>{selectedPatient.email}</span>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Visual Workflow Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Care Continuity Stage</h3>
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] font-bold">
                {['Screening', 'Appointment', 'Clinical Assessment', 'Monitoring', 'Follow-Up'].map((stage, i) => {
                  const isCurrent = selectedPatient.timelineStage === stage;
                  return (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-cyan-500 animate-ping' : 'bg-slate-300'}`} />
                      <span className={isCurrent ? 'text-brand-950 font-extrabold' : 'text-slate-400'}>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Screening Summary Box */}
            <div className="p-5 rounded-2xl bg-brand-50/70 border border-brand-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-brand-800">AI-Assisted Screening Summary</span>
                <span className="text-xs font-mono font-bold text-brand-900">{selectedPatient.screeningDate}</span>
              </div>
              <div className="text-sm font-bold text-brand-950">
                Primary Concern: {selectedPatient.concern} ({selectedPatient.screeningIndication})
              </div>
              
              {selectedPatient.hasVisualInput && (
                <div className="p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {selectedPatient.visualInputType === 'video' ? <Video className="w-4 h-4 text-cyan-400" /> : <Camera className="w-4 h-4 text-cyan-400" />}
                    Attached {selectedPatient.visualInputType} visual check
                  </span>
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">Reviewable</Badge>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-600">Why Highlighted:</div>
                <ul className="space-y-1">
                  {selectedPatient.whyHighlighted.map((w, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Shared Patient Health Updates */}
            {selectedPatient.patientHealthUpdates && selectedPatient.patientHealthUpdates.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Shared Patient Health Updates</h3>
                <div className="space-y-2">
                  {selectedPatient.patientHealthUpdates.map((upd) => (
                    <div key={upd.id} className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-emerald-950">
                        <span className="flex items-center gap-1.5">
                          <Badge variant={upd.type === 'Worsened' ? 'danger' : 'success'} className="text-[10px]">
                            {upd.type}
                          </Badge>
                          <span>{upd.concern}</span>
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">{upd.date}</span>
                      </div>
                      <p className="text-slate-700 italic">"{upd.note}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Patient Screening Answers */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Patient Screening Responses</h3>
              <div className="space-y-2">
                {selectedPatient.screeningAnswers.map((qa, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                    <span className="text-slate-700 font-medium">{qa.question}</span>
                    <span className="font-bold text-brand-900 bg-white px-2 py-1 rounded-md border border-slate-200">{qa.answer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Observations */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Observations & Notes</h3>
              {selectedPatient.clinicalNotes.length > 0 ? (
                <div className="space-y-3">
                  {selectedPatient.clinicalNotes.map((note) => (
                    <div key={note.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-brand-950">
                        <span>{note.author}</span>
                        <span className="text-slate-400 font-mono">{note.date}</span>
                      </div>
                      <p className="text-slate-700"><strong>Observation:</strong> {note.observation}</p>
                      <p className="text-slate-700"><strong>Recommendation:</strong> {note.recommendation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                  No clinical notes recorded yet for this patient.
                </div>
              )}
            </div>

            {/* Add Clinical Note Form */}
            <Card className="p-5 border-brand-100 bg-slate-50/50 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-600" /> Add Clinical Note
              </h3>

              <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinical Observation</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter observation from consultation..."
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recommendation</label>
                  <input
                    type="text"
                    placeholder="e.g. Recommend desensitizing paste and follow-up in 1 week."
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Follow-Up Date:</span>
                    <input
                      type="text"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="p-1.5 bg-white border border-slate-200 rounded-lg w-28 font-mono"
                    />
                  </div>

                  <Button type="submit" variant="primary" size="sm">
                    Save Note
                  </Button>
                </div>
              </form>

              {noteAddedSuccess && (
                <div className="text-xs text-emerald-600 font-semibold text-center">
                  Clinical note saved successfully!
                </div>
              )}
            </Card>

          </div>
        </div>
      )}

    </div>
  );
}
