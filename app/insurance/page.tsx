'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Globe, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { InsuranceRegion } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function InsurancePage() {
  const [selectedRegion, setSelectedRegion] = useState<InsuranceRegion>('US');
  const [procedureFee, setProcedureFee] = useState<number>(200);
  const [selectedProvider, setSelectedProvider] = useState<string>('Delta Dental PPO');

  // Dynamic estimate calculator
  const calculateEstimate = () => {
    if (selectedRegion === 'US') {
      const isUninsured = selectedProvider === 'Self-Pay / Uninsured';
      const coveragePercent = isUninsured ? 0 : 80;
      const patientCost = isUninsured ? procedureFee : Math.round(procedureFee * 0.2);
      return {
        coveragePercent,
        patientCost,
        note: isUninsured
          ? 'Full out-of-pocket payment required at time of visit.'
          : 'Standard PPO preventive & diagnostic coverage estimated at 80%.',
      };
    }

    if (selectedRegion === 'UK') {
      const isNhs = selectedProvider.includes('NHS');
      const patientCost = isNhs ? 26.8 : Math.round(procedureFee * 0.85);
      return {
        coveragePercent: isNhs ? 75 : 15,
        patientCost,
        note: isNhs
          ? 'NHS Band 1 standard diagnostic charge (£26.80) covers examination & X-rays.'
          : 'Private dental consultation fees apply based on clinic rates.',
      };
    }

    // Australia
    const isNoExtras = selectedProvider.includes('No Extras');
    const patientCost = isNoExtras ? procedureFee : Math.round(procedureFee * 0.35);
    return {
      coveragePercent: isNoExtras ? 0 : 65,
      patientCost,
      note: isNoExtras
        ? 'Full patient gap applies without dental extras policy.'
        : 'Estimated extras rebate applied to general dental consultation.',
    };
  };

  const estimate = calculateEstimate();

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200 font-bold">
          GLOBAL CARE NAVIGATION
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          Insurance & Coverage Navigation
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Understand dental coverage options, estimated out-of-pocket costs, and care pathways before scheduling your appointment.
        </p>
      </div>

      {/* Region Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => {
            setSelectedRegion('US');
            setSelectedProvider('Delta Dental PPO');
          }}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
            selectedRegion === 'US'
              ? 'bg-brand-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          🇺🇸 UNITED STATES
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedRegion('UK');
            setSelectedProvider('NHS Band 1 Care');
          }}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
            selectedRegion === 'UK'
              ? 'bg-brand-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          🇬🇧 UNITED KINGDOM
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedRegion('Australia');
            setSelectedProvider('Bupa Dental Extras');
          }}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
            selectedRegion === 'Australia'
              ? 'bg-brand-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          🇦🇺 AUSTRALIA
        </button>
      </div>

      {/* Region Specific Content Cards */}
      {selectedRegion === 'US' && (
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-subtle space-y-6">
          <div className="space-y-1">
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 text-[10px]">US DENTAL SYSTEM</Badge>
            <h2 className="text-xl font-bold text-brand-950">United States — Navigating Cost Uncertainty</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dental coverage in the US varies significantly by insurance carrier, network status (In-Network vs Out-of-Network), and deductible limits. OralSense helps you estimate patient out-of-pocket responsibility prior to booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Network Status</span>
              <div className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> In-Network PPO
              </div>
              <p className="text-[11px] text-slate-500">Contracted rates apply automatically.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Preventive Coverage</span>
              <div className="text-sm font-bold text-brand-950">80% – 100% Estimated</div>
              <p className="text-[11px] text-slate-500">Most check-ups & cleanings covered.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Copay / Out-of-Pocket</span>
              <div className="text-sm font-bold text-cyan-700">Predictable Copay</div>
              <p className="text-[11px] text-slate-500">Reviewed before confirming slot.</p>
            </div>
          </div>
        </Card>
      )}

      {selectedRegion === 'UK' && (
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-subtle space-y-6">
          <div className="space-y-1">
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 text-[10px]">UK CARE PATHWAY</Badge>
            <h2 className="text-xl font-bold text-brand-950">United Kingdom — NHS & Private Care Navigation</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Patients in the UK can choose between NHS dental care (where statutory band charges apply) or Private dental care. OralSense clarifies pathway options and expected costs before booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-950 text-sm">NHS Dental Pathway</span>
                <Badge variant="success" className="text-[10px]">Statutory Band Fee</Badge>
              </div>
              <p className="text-xs text-slate-600">
                NHS Band 1 (£26.80) covers diagnosis, examination, X-rays, and scale/polish if clinically necessary.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-950 text-sm">Private Dental Pathway</span>
                <Badge variant="neutral" className="text-[10px]">Direct Appointment</Badge>
              </div>
              <p className="text-xs text-slate-600">
                Private appointments offer immediate availability, extended consultation times, and cosmetic options.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500 italic">
            Note: NHS availability and treatment eligibility can vary depending on local practice NHS capacity.
          </p>
        </Card>
      )}

      {selectedRegion === 'Australia' && (
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-subtle space-y-6">
          <div className="space-y-1">
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 text-[10px]">AUSTRALIAN EXTRAS</Badge>
            <h2 className="text-xl font-bold text-brand-950">Australia — Gap-Cost Transparency</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Australian private health insurance provides General Dental extras cover. OralSense estimates your insurer rebate and the remaining out-of-pocket patient gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Insurer Rebate</span>
              <div className="text-sm font-bold text-emerald-700">Estimated 50% – 85%</div>
              <p className="text-[11px] text-slate-500">Applied directly via HICAPS demo.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Patient Gap</span>
              <div className="text-sm font-bold text-brand-950">Minimal Gap Payment</div>
              <p className="text-[11px] text-slate-500">Difference between fee and rebate.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Preferred Network</span>
              <div className="text-sm font-bold text-cyan-700">Bupa / Medibank / HCF</div>
              <p className="text-[11px] text-slate-500">Higher rebates at network clinics.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Interactive Demo Out-of-Pocket Calculator */}
      <Card className="p-6 sm:p-8 bg-brand-950 text-white rounded-3xl space-y-6 border border-brand-800 shadow-premium">
        <div className="space-y-1">
          <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-[10px]">
            INTERACTIVE ESTIMATOR DEMO
          </Badge>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Estimate Your Consultation Out-of-Pocket Cost
          </h2>
          <p className="text-xs text-slate-300">
            Select a sample provider/plan and adjust consultation fee to see a demonstration estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200">Standard Consultation Fee</label>
            <select
              value={procedureFee}
              onChange={(e) => setProcedureFee(Number(e.target.value))}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <option value={150}>Standard Consultation ($150 / £110 / A$200)</option>
              <option value={250}>Specialist Evaluation ($250 / £180 / A$340)</option>
              <option value={350}>Advanced Occlusal / TMJ Assessment ($350 / £250 / A$480)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-200">Coverage Option</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              {selectedRegion === 'US' && (
                <>
                  <option value="Delta Dental PPO">Delta Dental PPO (In-Network 80%)</option>
                  <option value="Cigna Dental Care">Cigna Dental Care (In-Network 80%)</option>
                  <option value="Self-Pay / Uninsured">Self-Pay / Uninsured (0%)</option>
                </>
              )}
              {selectedRegion === 'UK' && (
                <>
                  <option value="NHS Band 1 Care">NHS Band 1 (£26.80 Standard)</option>
                  <option value="Private Care Direct">Private Consultation</option>
                </>
              )}
              {selectedRegion === 'Australia' && (
                <>
                  <option value="Bupa Dental Extras">Bupa Private Dental Extras (65%)</option>
                  <option value="Medibank Private">Medibank Dental Extras (70%)</option>
                  <option value="No Extras Policy">Self-Pay / No Extras (0%)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Calculation Output Box */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Selected Plan: {selectedProvider}</span>
            <Badge variant="success" className="text-[10px]">
              {estimate.coveragePercent}% Estimated Coverage
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Base Fee</span>
              <div className="font-bold text-white text-base">{formatCurrency(procedureFee)}</div>
            </div>
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase">Estimated Patient Out-of-Pocket</span>
              <div className="font-extrabold text-cyan-300 text-lg">
                {formatCurrency(estimate.patientCost)}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 italic">
            "{estimate.note}"
          </p>
        </div>

        {/* Mandatory Safety Disclaimers */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-cyan-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Important Notice:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            <strong>Coverage estimate — demonstration only.</strong> Actual coverage depends on your specific policy, provider, and treatment. OralSense does not provide insurance approval or guarantee reimbursement.
          </p>
        </div>
      </Card>

      {/* CTA to Find Care */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-lg font-bold text-brand-950">Ready to find a provider?</h3>
        <Link href="/find-care">
          <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} className="font-bold">
            Browse Verified Care Directory
          </Button>
        </Link>
      </div>

    </div>
  );
}
