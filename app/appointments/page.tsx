'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStoredAppointments, cancelAppointment } from '@/lib/storage';
import { Appointment } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, MapPin, X, AlertTriangle, CheckCircle2, ChevronRight, Stethoscope } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');

  // Modal states
  const [selectedAptDetails, setSelectedAptDetails] = useState<Appointment | null>(null);
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);

  useEffect(() => {
    setAppointments(getStoredAppointments());
  }, []);

  const handleConfirmCancel = () => {
    if (!cancelModalApt) return;
    const updated = cancelAppointment(cancelModalApt.id);
    setAppointments(updated);
    setCancelModalApt(null);
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'Upcoming') return apt.status === 'Upcoming';
    return apt.status === 'Completed' || apt.status === 'Cancelled';
  });

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary">PATIENT CARE SCHEDULE</Badge>
          <h1 className="text-3xl font-extrabold text-brand-950 tracking-tight mt-1">
            My Dental Appointments
          </h1>
        </div>

        <Link href="/doctors">
          <Button variant="primary" size="md" icon={<Stethoscope className="w-4 h-4" />}>
            Find a Dentist
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('Upcoming')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'Upcoming'
              ? 'border-brand-600 text-brand-900 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming Appointments ({appointments.filter(a => a.status === 'Upcoming').length})
        </button>
        <button
          onClick={() => setActiveTab('Past')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'Past'
              ? 'border-brand-600 text-brand-900 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Past & Cancelled ({appointments.filter(a => a.status !== 'Upcoming').length})
        </button>
      </div>

      {/* List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <Card key={apt.id} className="p-6 shadow-subtle border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Doctor info */}
                <div className="flex items-center gap-4">
                  <img
                    src={apt.doctorImage}
                    alt={apt.doctorName}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-brand-950">{apt.doctorName}</h3>
                      <Badge
                        variant={
                          apt.status === 'Upcoming'
                            ? 'primary'
                            : apt.status === 'Completed'
                            ? 'success'
                            : 'danger'
                        }
                      >
                        {apt.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-brand-700">{apt.doctorSpecialty}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {apt.clinicName}
                    </p>
                  </div>
                </div>

                {/* Date & Fee Info */}
                <div className="sm:text-right space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center sm:justify-end gap-1.5">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span>{apt.date} at {apt.time}</span>
                  </div>
                  <div className="text-xs text-slate-500">Consultation Fee: {formatCurrency(apt.fee)}</div>
                  <div className="text-[10px] font-mono text-slate-400">ID: #{apt.id}</div>
                </div>

              </div>

              {/* Patient notes if any */}
              {apt.patientNotes && (
                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100">
                  <strong>Notes:</strong> {apt.patientNotes}
                </div>
              )}

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAptDetails(apt)}
                >
                  View Details
                </Button>

                {apt.status === 'Upcoming' && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => alert(`Reschedule request initiated for #${apt.id}.`)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setCancelModalApt(apt)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>

            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No {activeTab.toLowerCase()} appointments found.</h3>
          <p className="text-xs text-slate-500">
            {activeTab === 'Upcoming'
              ? 'You do not have any upcoming consultations booked.'
              : 'You have no past appointment history yet.'}
          </p>
          <Link href="/doctors">
            <Button variant="primary" size="md" icon={<Stethoscope className="w-4 h-4" />}>
              Find a Dentist Now
            </Button>
          </Link>
        </Card>
      )}

      {/* Details Modal */}
      {selectedAptDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setSelectedAptDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-brand-950">Appointment #{selectedAptDetails.id}</h2>
            
            <div className="flex items-center gap-4">
              <img src={selectedAptDetails.doctorImage} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <div className="text-base font-bold text-slate-900">{selectedAptDetails.doctorName}</div>
                <div className="text-xs text-brand-700">{selectedAptDetails.doctorSpecialty}</div>
                <div className="text-xs text-slate-500">{selectedAptDetails.clinicName}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-200/80">
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold text-slate-900">{selectedAptDetails.date} at {selectedAptDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700">{selectedAptDetails.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-medium text-slate-800">{selectedAptDetails.clinicAddress}</span>
              </div>
            </div>

            <Button variant="outline" size="md" className="w-full" onClick={() => setSelectedAptDetails(null)}>
              Close Details
            </Button>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center border border-slate-100">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Cancel Appointment?</h2>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel your appointment with <strong>{cancelModalApt.doctorName}</strong> on {cancelModalApt.date}?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" size="md" onClick={() => setCancelModalApt(null)}>
                Keep Appointment
              </Button>
              <Button variant="danger" size="md" onClick={handleConfirmCancel}>
                Confirm Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
