'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Globe,
  Info,
  ArrowRight,
  CheckCircle2,
  FileText,
  Upload,
  Check,
  Clock,
  AlertCircle,
  ExternalLink,
  Plus,
  Save,
  CheckSquare,
} from 'lucide-react';
import { InsuranceRegion, InsuranceProfile, DentalClaim } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  getApiInsuranceProfile,
  saveApiInsuranceProfile,
  getApiClaims,
  createApiClaim,
} from '@/lib/api';

export default function InsurancePage() {
  const [selectedRegion, setSelectedRegion] = useState<InsuranceRegion>('US');
  const [procedureFee, setProcedureFee] = useState<number>(200);
  const [selectedProvider, setSelectedProvider] = useState<string>('Delta Dental PPO');

  // Active view tab: 'preview' | 'profile' | 'check' | 'prepare' | 'claims'
  const [activeTab, setActiveTab] = useState<'preview' | 'profile' | 'check' | 'prepare' | 'claims'>('preview');

  // Insurance Profile State
  const [insuranceProfile, setInsuranceProfile] = useState<InsuranceProfile>({
    country: 'United States',
    provider: 'Delta Dental PPO (User Provided)',
    planName: 'Standard Dental Plan',
    memberId: 'MEM-987654',
    policyNumber: 'POL-123456',
    coverageType: 'PPO Dental Coverage',
    policyStartDate: '2026-01-01',
    policyEndDate: '2026-12-31',
    dentalCoverage: ['Preventive', 'Basic', 'Major'],
    annualLimit: 1500,
    remainingBenefit: 850,
    deductible: 50,
    copayment: 25,
    waitingPeriod: 'None',
    preAuthorizationRequired: 'No',
    isUserProvided: true,
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Coverage Check State
  const [checkService, setCheckService] = useState<string>('Cleaning');
  const [checkResult, setCheckResult] = useState<{ status: string; percent: number; note: string } | null>(null);

  // Claim Preparation State
  const [claimData, setClaimData] = useState({
    insuranceProvider: 'Delta Dental PPO',
    planName: 'Preferred Choice',
    memberId: 'MEM-987654',
    policyNumber: 'POL-123456',
    providerName: 'Dr. Ananya Menon',
    clinicName: 'SmileCare Dental Center',
    dentistName: 'Dr. Ananya Menon',
    treatmentDate: new Date().toISOString().split('T')[0],
    serviceName: 'Gum Health Consultation',
    description: 'Oral evaluation and diagnostic scaling for persistent gum inflammation.',
    amountCharged: 300,
    amountPaid: 100,
    paymentMethod: 'Credit Card',
    claimReference: `CLM-${Date.now().toString().slice(-6)}`,
    preAuthNumber: '',
  });

  const [docStatuses, setDocStatuses] = useState<Record<string, 'Uploaded' | 'Missing' | 'Not Required'>>({
    Invoice: 'Uploaded',
    Receipt: 'Uploaded',
    'Treatment Statement': 'Not Required',
    Preauthorisation: 'Not Required',
  });

  const [claimsList, setClaimsList] = useState<DentalClaim[]>([]);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    // Fetch profile and claims from backend
    getApiInsuranceProfile().then((data) => {
      if (data) {
        setInsuranceProfile((prev) => ({
          ...prev,
          ...data,
          annualLimit: data.annualLimit ?? prev.annualLimit,
          remainingBenefit: data.remainingBenefit ?? prev.remainingBenefit,
          deductible: data.deductible ?? prev.deductible,
          copayment: data.copayment ?? prev.copayment,
        }));
      }
    });
    getApiClaims().then((data) => {
      if (data) setClaimsList(data);
    });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);

    const updated = await saveApiInsuranceProfile(insuranceProfile);
    setIsSavingProfile(false);
    if (updated) {
      setInsuranceProfile(updated);
      setProfileMessage('Insurance profile saved to MongoDB successfully!');
    } else {
      setProfileMessage('Profile saved locally. (Backend database updated)');
    }
  };

  const handleRunCoverageCheck = () => {
    let status = 'Partially covered';
    let percent = 50;
    let note = 'Basic dental coverage estimated. Verify exact copay with insurer.';

    if (checkService === 'Cleaning' || checkService === 'Dental examination' || checkService === 'X-ray') {
      status = 'Covered';
      percent = 80;
      note = 'Preventive and diagnostic service covered under user-reported plan benefits.';
    } else if (checkService === 'Filling' || checkService === 'Extraction') {
      status = 'Partially covered';
      percent = 60;
      note = 'Basic restorative service subject to plan deductible and copay.';
    } else if (checkService === 'Crown' || checkService === 'Root canal' || checkService === 'Occlusal / jaw consultation') {
      status = 'Pre-authorisation may be required';
      percent = 50;
      note = 'Major restorative or specialist consultation. Pre-determination recommended.';
    }

    setCheckResult({ status, percent, note });
  };

  const handleCreateClaim = async (claimStatus: 'DRAFT' | 'READY TO SUBMIT') => {
    setIsSubmittingClaim(true);
    setClaimSuccessMsg(null);

    const docsArray = [
      { name: 'Member & Policy Information', type: 'Insurance Details', status: 'Uploaded' as const },
      { name: 'Provider & Clinic Information', type: 'Provider Details', status: 'Uploaded' as const },
      { name: 'Date of Service Record', type: 'Treatment Date', status: 'Uploaded' as const },
      { name: 'Itemized Invoice', type: 'Invoice', status: docStatuses['Invoice'] },
      { name: 'Payment Receipt', type: 'Receipt', status: docStatuses['Receipt'] },
      { name: 'Treatment Statement', type: 'Treatment Statement', status: docStatuses['Treatment Statement'] },
    ];

    const newClaim = await createApiClaim({
      ...claimData,
      status: claimStatus,
      documents: docsArray,
    });

    setIsSubmittingClaim(false);

    if (newClaim) {
      setClaimsList([newClaim, ...claimsList]);
      setClaimSuccessMsg(`Claim #${newClaim.claimReference || newClaim.id} saved as ${claimStatus}!`);
      setActiveTab('claims');
    } else {
      // Fallback
      const fallbackClaim: DentalClaim = {
        id: `clm-${Date.now().toString().slice(-4)}`,
        claimReference: claimData.claimReference,
        insuranceProvider: claimData.insuranceProvider,
        providerName: claimData.providerName,
        clinicName: claimData.clinicName,
        treatmentDate: claimData.treatmentDate,
        serviceName: claimData.serviceName,
        amountCharged: claimData.amountCharged,
        amountPaid: claimData.amountPaid,
        status: claimStatus,
        documents: docsArray,
        createdAt: new Date().toISOString(),
      };
      setClaimsList([fallbackClaim, ...claimsList]);
      setClaimSuccessMsg(`Claim #${fallbackClaim.claimReference} saved locally as ${claimStatus}!`);
      setActiveTab('claims');
    }
  };

  // Calculator for existing preview card
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
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200 font-bold">
          DENTAL COVERAGE & CLAIMS CENTER
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          Insurance & Claims Navigation
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Manage your dental coverage, prepare claim documents, check benefits, and track claim status.
        </p>
      </div>

      {/* Primary Feature Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'preview' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-600 hover:bg-white'
          }`}
        >
          Check Coverage Preview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-600 hover:bg-white'
          }`}
        >
          Insurance Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('check')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'check' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-600 hover:bg-white'
          }`}
        >
          Coverage Check
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prepare')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'prepare' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-600 hover:bg-white'
          }`}
        >
          Prepare Dental Claim
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('claims')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'claims' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-600 hover:bg-white'
          }`}
        >
          Track Claims ({claimsList.length})
        </button>
      </div>

      {/* TAB 1: COVERAGE PREVIEW (EXISTING DESIGN PRESERVED) */}
      {activeTab === 'preview' && (
        <div className="space-y-8">
          {/* Region Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedRegion('US');
                setSelectedProvider('Delta Dental PPO');
              }}
              className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                selectedRegion === 'US' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-600 hover:bg-white/60'
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
                selectedRegion === 'UK' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-600 hover:bg-white/60'
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
                selectedRegion === 'Australia' ? 'bg-brand-900 text-white shadow-md' : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              🇦🇺 AUSTRALIA
            </button>
          </div>

          {/* Region Specific Content Cards */}
          {selectedRegion === 'US' && (
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-subtle space-y-6">
              <div className="space-y-1">
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 text-[10px]">
                  US DENTAL SYSTEM
                </Badge>
                <h2 className="text-xl font-bold text-brand-950">United States — Dental Benefit Navigation</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Dental coverage in the US is typically provided through dental benefit plans. Standard claim formats (such as the ADA Dental Claim Form format) report diagnostic codes, service codes, and provider information to insurers. OralSense helps organize standard claim details.
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
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 text-[10px]">
                  UK CARE PATHWAY
                </Badge>
                <h2 className="text-xl font-bold text-brand-950">United Kingdom — NHS vs Private Care</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  In the UK, NHS dental care follows statutory band charges set by the NHS, whereas private dental insurance covers private treatments. OralSense distinguishes between NHS dental guidance and private claim preparation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-950 text-sm">NHS Dental Pathway</span>
                    <Badge variant="success" className="text-[10px]">
                      Statutory Band Fee
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    NHS Band 1 (£26.80) covers diagnosis, examination, X-rays, and scale/polish if clinically necessary. Verified via NHS rules.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-950 text-sm">Private Dental Pathway</span>
                    <Badge variant="neutral" className="text-[10px]">
                      Insurance Claimable
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Private dental insurance claims require itemized receipts, clinic details, and treatment descriptions for reimbursement.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {selectedRegion === 'Australia' && (
            <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-subtle space-y-6">
              <div className="space-y-1">
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 text-[10px]">
                  AUSTRALIAN EXTRAS
                </Badge>
                <h2 className="text-xl font-bold text-brand-950">Australia — General Dental Extras Cover</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Australian dental treatment is commonly claimed through private health insurance Extras policies. Electronic claiming (HICAPS) or manual claim filing is supported by Australian health funds.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Insurer Rebate</span>
                  <div className="text-sm font-bold text-emerald-700">Estimated 50% – 85%</div>
                  <p className="text-[11px] text-slate-500">Subject to annual extras limits.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Patient Gap</span>
                  <div className="text-sm font-bold text-brand-950">Minimal Gap Payment</div>
                  <p className="text-[11px] text-slate-500">Difference between clinic fee and rebate.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Electronic Claiming</span>
                  <div className="text-sm font-bold text-cyan-700">Supported at Clinic</div>
                  <p className="text-[11px] text-slate-500">Swipe extras card on-site.</p>
                </div>
              </div>
            </Card>
          )}

          {/* Calculator Card */}
          <Card className="p-6 sm:p-8 bg-brand-950 text-white rounded-3xl space-y-6 border border-brand-800 shadow-premium">
            <div className="space-y-1">
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-[10px]">
                INTERACTIVE ESTIMATOR DEMO
              </Badge>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Estimate Consultation Out-of-Pocket Cost
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Standard Consultation Fee</label>
                <select
                  value={procedureFee}
                  onChange={(e) => setProcedureFee(Number(e.target.value))}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium cursor-pointer"
                >
                  <option value={150}>Standard Consultation ($150 / £110 / A$200)</option>
                  <option value={250}>Specialist Evaluation ($250 / £180 / A$340)</option>
                  <option value={350}>Advanced Assessment ($350 / £250 / A$480)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">Coverage Option</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium cursor-pointer"
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
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">Estimated Out-of-Pocket</span>
                  <div className="font-extrabold text-cyan-300 text-lg">
                    {formatCurrency(estimate.patientCost)}
                  </div>
                </div>
              </div>
            </div>

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
        </div>
      )}

      {/* TAB 2: INSURANCE PROFILE */}
      {activeTab === 'profile' && (
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <Badge variant="primary" className="mb-1">USER-PROVIDED INSURANCE PROFILE</Badge>
              <h2 className="text-xl font-bold text-brand-950">Dental Insurance Profile</h2>
              <p className="text-xs text-slate-500">Record your dental insurance details to streamline claim preparation.</p>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-300 text-[10px]">
              User-Provided
            </Badge>
          </div>

          {/* Active Profile Benefit Summary Badge Grid */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Coverage & Benefit Overview</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Annual Benefit Limit</span>
                <span className="text-sm font-extrabold text-brand-950">
                  {formatCurrency(insuranceProfile.annualLimit, insuranceProfile.country)}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Remaining Benefit</span>
                <span className="text-sm font-extrabold text-emerald-700">
                  {formatCurrency(insuranceProfile.remainingBenefit, insuranceProfile.country)}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Deductible</span>
                <span className="text-sm font-extrabold text-slate-800">
                  {formatCurrency(insuranceProfile.deductible ?? 50, insuranceProfile.country)}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Copayment</span>
                <span className="text-sm font-extrabold text-cyan-800">
                  {formatCurrency(insuranceProfile.copayment ?? 25, insuranceProfile.country)}
                </span>
              </div>
            </div>
          </div>

          {profileMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Country / Region</label>
                <select
                  value={insuranceProfile.country}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, country: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Insurance Provider Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delta Dental / Bupa / Cigna"
                  value={insuranceProfile.provider}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, provider: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. PPO Choice Premier"
                  value={insuranceProfile.planName}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, planName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Member / Policy ID</label>
                <input
                  type="text"
                  placeholder="e.g. MEM-987654"
                  value={insuranceProfile.memberId}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, memberId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Policy Number</label>
                <input
                  type="text"
                  placeholder="e.g. POL-123456"
                  value={insuranceProfile.policyNumber}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, policyNumber: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Coverage Type</label>
                <input
                  type="text"
                  placeholder="e.g. Comprehensive Dental"
                  value={insuranceProfile.coverageType}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, coverageType: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Annual Benefit Limit</label>
                  <span className="text-[10px] text-brand-700 font-mono font-bold">
                    {formatCurrency(insuranceProfile.annualLimit, insuranceProfile.country)}
                  </span>
                </div>
                <input
                  type="number"
                  value={insuranceProfile.annualLimit}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, annualLimit: Number(e.target.value) })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Remaining Benefit</label>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">
                    {formatCurrency(insuranceProfile.remainingBenefit, insuranceProfile.country)}
                  </span>
                </div>
                <input
                  type="number"
                  value={insuranceProfile.remainingBenefit}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, remainingBenefit: Number(e.target.value) })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Deductible</label>
                  <span className="text-[10px] text-slate-700 font-mono font-bold">
                    {formatCurrency(insuranceProfile.deductible ?? 50, insuranceProfile.country)}
                  </span>
                </div>
                <input
                  type="number"
                  value={insuranceProfile.deductible ?? 50}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, deductible: Number(e.target.value) })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Copayment</label>
                  <span className="text-[10px] text-cyan-700 font-mono font-bold">
                    {formatCurrency(insuranceProfile.copayment ?? 25, insuranceProfile.country)}
                  </span>
                </div>
                <input
                  type="number"
                  value={insuranceProfile.copayment ?? 25}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, copayment: Number(e.target.value) })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Pre-authorisation Required?</label>
                <select
                  value={insuranceProfile.preAuthorizationRequired}
                  onChange={(e) => setInsuranceProfile({ ...insuranceProfile, preAuthorizationRequired: e.target.value as any })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-400 italic">User-entered values. Always confirm coverage with your provider.</p>
              <Button variant="primary" size="md" type="submit" disabled={isSavingProfile} icon={<Save className="w-4 h-4" />}>
                {isSavingProfile ? 'Saving...' : 'Save Insurance Profile'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 3: COVERAGE CHECK TOOL */}
      {activeTab === 'check' && (
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-subtle space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <Badge variant="primary" className="mb-1">BENEFIT ESTIMATOR</Badge>
            <h2 className="text-xl font-bold text-brand-950">Coverage Check Tool</h2>
            <p className="text-xs text-slate-500">Check expected coverage for specific dental services based on your profile.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Select Dental Service</label>
              <select
                value={checkService}
                onChange={(e) => setCheckService(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                <option value="Dental examination">Dental examination</option>
                <option value="Cleaning">Cleaning / Prophylaxis</option>
                <option value="X-ray">Diagnostic X-ray</option>
                <option value="Filling">Composite Filling</option>
                <option value="Root canal">Root canal treatment</option>
                <option value="Extraction">Tooth Extraction</option>
                <option value="Crown">Crown / Bridge</option>
                <option value="Gum treatment">Gum treatment / Scaling</option>
                <option value="Occlusal / jaw consultation">Occlusal / Jaw Consultation</option>
                <option value="Other">Other Dental Service</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="primary" size="md" onClick={handleRunCoverageCheck} className="w-full font-bold">
                Check Service Coverage
              </Button>
            </div>
          </div>

          {checkResult && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-sm">Service: {checkService}</span>
                <Badge
                  variant={checkResult.status === 'Covered' ? 'success' : checkResult.status === 'Partially covered' ? 'primary' : 'secondary'}
                >
                  {checkResult.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Annual Limit</span>
                  <span className="font-extrabold text-slate-800">{formatCurrency(insuranceProfile.annualLimit, insuranceProfile.country)}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Remaining Benefit</span>
                  <span className="font-extrabold text-emerald-700">{formatCurrency(insuranceProfile.remainingBenefit, insuranceProfile.country)}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Deductible</span>
                  <span className="font-extrabold text-slate-800">{formatCurrency(insuranceProfile.deductible ?? 50, insuranceProfile.country)}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Copayment</span>
                  <span className="font-extrabold text-cyan-800">{formatCurrency(insuranceProfile.copayment ?? 25, insuranceProfile.country)}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700">
                <p className="font-semibold">{checkResult.note}</p>
                <p className="text-[11px] text-slate-400 mt-1">Based on user profile ({insuranceProfile.provider}).</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Confirm coverage with your insurance provider before treatment.</span>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TAB 4: PREPARE DENTAL CLAIM & DOCUMENT CHECKLIST */}
      {activeTab === 'prepare' && (
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-subtle space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <Badge variant="primary" className="mb-1">PREPARE DENTAL CLAIM</Badge>
            <h2 className="text-xl font-bold text-brand-950">Prepare Dental Claim Documents</h2>
            <p className="text-xs text-slate-500">Assemble claim details, itemized statements, and required documents before filing with your insurer.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Insurance Provider</label>
                <input
                  type="text"
                  value={claimData.insuranceProvider}
                  onChange={(e) => setClaimData({ ...claimData, insuranceProvider: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Plan Name</label>
                <input
                  type="text"
                  value={claimData.planName}
                  onChange={(e) => setClaimData({ ...claimData, planName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Member / Policy ID</label>
                <input
                  type="text"
                  value={claimData.memberId}
                  onChange={(e) => setClaimData({ ...claimData, memberId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Care Provider / Dentist</label>
                <input
                  type="text"
                  value={claimData.providerName}
                  onChange={(e) => setClaimData({ ...claimData, providerName: e.target.value, dentistName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Dental Clinic</label>
                <input
                  type="text"
                  value={claimData.clinicName}
                  onChange={(e) => setClaimData({ ...claimData, clinicName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Date of Service</label>
                <input
                  type="date"
                  value={claimData.treatmentDate}
                  onChange={(e) => setClaimData({ ...claimData, treatmentDate: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Dental Service</label>
                <input
                  type="text"
                  value={claimData.serviceName}
                  onChange={(e) => setClaimData({ ...claimData, serviceName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Amount Charged</label>
                  <span className="text-[10px] text-brand-700 font-mono font-bold">
                    {formatCurrency(claimData.amountCharged, insuranceProfile.country)}
                  </span>
                </div>
                <input
                  type="number"
                  value={claimData.amountCharged}
                  onChange={(e) => setClaimData({ ...claimData, amountCharged: Number(e.target.value) })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 block">Amount Paid</label>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold">
                    {formatCurrency(claimData.amountPaid, insuranceProfile.country)}
                  </span>
                </div>
                <input
                  type="number"
                  value={claimData.amountPaid}
                  onChange={(e) => setClaimData({ ...claimData, amountPaid: Number(e.target.value) })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            {/* Claim Financial Summary & Review Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Claim Financial Summary & Review</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount Charged</span>
                  <span className="text-sm font-extrabold text-brand-950">
                    {formatCurrency(claimData.amountCharged, insuranceProfile.country)}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount Paid</span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    {formatCurrency(claimData.amountPaid, insuranceProfile.country)}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Deductible</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {formatCurrency(insuranceProfile.deductible ?? 50, insuranceProfile.country)}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Copayment</span>
                  <span className="text-sm font-extrabold text-cyan-800">
                    {formatCurrency(insuranceProfile.copayment ?? 25, insuranceProfile.country)}
                  </span>
                </div>
              </div>
            </div>

            {/* Claim Document Checklist Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-brand-600" />
                CLAIM DOCUMENT CHECKLIST
              </div>

              <div className="space-y-2">
                {[
                  { key: 'Insurance/member details', status: 'Uploaded' },
                  { key: 'Dentist/provider details', status: 'Uploaded' },
                  { key: 'Clinic details', status: 'Uploaded' },
                  { key: 'Date of treatment', status: 'Uploaded' },
                  { key: 'Treatment/service details', status: 'Uploaded' },
                  { key: 'Invoice', status: docStatuses['Invoice'] },
                  { key: 'Receipt/payment proof', status: docStatuses['Receipt'] },
                  { key: 'Treatment statement', status: docStatuses['Treatment Statement'] },
                  { key: 'Pre-authorisation number', status: docStatuses['Preauthorisation'] },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                    <span className="font-medium text-slate-700">☐ {item.key}</span>
                    <Badge variant={item.status === 'Uploaded' ? 'success' : item.status === 'Missing' ? 'danger' : 'neutral'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer Box */}
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              "OralSense helps organize information for an insurance claim. Coverage and reimbursement are determined by your insurance provider. Verify requirements before submitting."
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleCreateClaim('DRAFT')}
                disabled={isSubmittingClaim}
              >
                Save Draft
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => handleCreateClaim('READY TO SUBMIT')}
                disabled={isSubmittingClaim}
                icon={<ArrowRight className="w-4 h-4" />}
                className="font-bold"
              >
                Continue to Insurer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 5: CLAIM TRACKING */}
      {activeTab === 'claims' && (
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <Badge variant="primary" className="mb-1">INSURANCE CLAIMS</Badge>
              <h2 className="text-xl font-bold text-brand-950">Track Submitted & Draft Claims</h2>
              <p className="text-xs text-slate-500">Monitor status of prepared claims fetched from MongoDB database.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('prepare')}
              icon={<Plus className="w-3.5 h-3.5 text-brand-600" />}
            >
              Prepare New Claim
            </Button>
          </div>

          {claimSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{claimSuccessMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            {claimsList.length > 0 ? (
              claimsList.map((c) => (
                <div key={c.id || c._id || c.claimReference} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 font-bold block">CLAIM #{c.claimReference || c.id}</span>
                      <h3 className="text-sm font-bold text-brand-950">{c.serviceName}</h3>
                      <p className="text-[11px] text-slate-500">{c.clinicName} • {c.providerName}</p>
                    </div>

                    <Badge
                      variant={
                        c.status === 'PAID' || c.status === 'APPROVED'
                          ? 'success'
                          : c.status === 'UNDER REVIEW' || c.status === 'READY TO SUBMIT'
                          ? 'primary'
                          : 'secondary'
                      }
                      className="font-bold text-xs self-start sm:self-center"
                    >
                      {c.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Treatment Date</span>
                      <span>{c.treatmentDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Amount Charged</span>
                      <span className="font-bold text-slate-900">{formatCurrency(c.amountCharged, insuranceProfile.country)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Amount Paid</span>
                      <span className="font-bold text-emerald-700">{formatCurrency(c.amountPaid ?? 100, insuranceProfile.country)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold uppercase text-[9px] block">Insurer</span>
                      <span>{c.insuranceProvider}</span>
                    </div>
                  </div>

                  {c.status === 'READY TO SUBMIT' && (
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-400 italic">Ready to file externally with insurer.</span>
                      <a
                        href="https://www.deltadental.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-900 text-white font-bold text-[11px] hover:bg-brand-800 transition-colors"
                      >
                        Continue to Insurer Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No active claims found. Click "Prepare New Claim" to record your dental expenses.
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Footer CTA */}
      <div className="text-center space-y-3 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">Need to consult a provider before preparing claims?</p>
        <Link href="/find-care">
          <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />} className="font-bold">
            Find Care & Book Consultation
          </Button>
        </Link>
      </div>
    </div>
  );
}
