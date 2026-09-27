'use client';

import React, { useState } from 'react';
import { InsuranceRegion, InsuranceEstimate } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Globe, ShieldCheck, Info, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface InsuranceCoverageWidgetProps {
  baseConsultationFee: number;
  onSelectEstimate?: (estimate: InsuranceEstimate) => void;
}

export const InsuranceCoverageWidget: React.FC<InsuranceCoverageWidgetProps> = ({
  baseConsultationFee,
  onSelectEstimate,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<InsuranceRegion>('US');
  const [usProvider, setUsProvider] = useState<string>('Delta Dental');
  const [ukCareType, setUkCareType] = useState<'Private' | 'NHS Band 1'>('Private');
  const [auProvider, setAuProvider] = useState<string>('Bupa Private Extras');

  const calculateEstimate = (): InsuranceEstimate => {
    if (selectedRegion === 'US') {
      const isOut = usProvider === 'Out-of-pocket / Uninsured';
      const coveragePercent = isOut ? 0 : 80;
      const estimatedOutofPocket = isOut
        ? baseConsultationFee
        : Math.round(baseConsultationFee * 0.2);

      return {
        region: 'US',
        providerName: usProvider,
        tierOrPlan: isOut ? 'Uninsured / Self-Pay' : 'Preferred PPO Network (In-Network)',
        coveragePercent,
        estimatedOutofPocket,
        isDemoEstimate: true,
        notes: isOut
          ? 'Full out-of-pocket payment required at time of visit.'
          : 'Preventative / Consultation covered up to 80% under standard PPO rules.',
      };
    }

    if (selectedRegion === 'UK') {
      const isNhs = ukCareType === 'NHS Band 1';
      const estimatedOutofPocket = isNhs ? 26.8 : Math.round(baseConsultationFee * 0.9);
      return {
        region: 'UK',
        providerName: isNhs ? 'NHS Dental Care' : 'Private Dental Care',
        tierOrPlan: isNhs ? 'NHS Band 1 Standard Diagnostic Fee' : 'Private Direct Consultation',
        coveragePercent: isNhs ? 70 : 10,
        estimatedOutofPocket,
        isDemoEstimate: true,
        notes: isNhs
          ? 'NHS Band 1 charge covers examination, diagnosis, and advice.'
          : 'Private dental consultation fees apply.',
      };
    }

    // Australia
    const isOut = auProvider === 'Self-Pay / No Extras';
    const coveragePercent = isOut ? 0 : 70;
    const estimatedOutofPocket = isOut ? baseConsultationFee : Math.round(baseConsultationFee * 0.3);

    return {
      region: 'Australia',
      providerName: auProvider,
      tierOrPlan: isOut ? 'No Dental Extras' : 'Standard General Dental Extras',
      coveragePercent,
      estimatedOutofPocket,
      isDemoEstimate: true,
      notes: isOut
        ? 'Full gap payment required.'
        : 'Extras rebate estimate applied to initial oral consultation.',
    };
  };

  const currentEstimate = calculateEstimate();

  return (
    <Card className="p-5 bg-slate-50 border border-slate-200/80 rounded-3xl space-y-4">
      {/* Widget Title Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-600" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-950">
            International Insurance & Coverage Estimator
          </h3>
        </div>
        <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 text-[10px] font-bold">
          DEMO MODE
        </Badge>
      </div>

      {/* Country Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-2xl border border-slate-200">
        {(['US', 'UK', 'Australia'] as InsuranceRegion[]).map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => setSelectedRegion(region)}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              selectedRegion === region
                ? 'bg-brand-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {region === 'US' ? '🇺🇸 United States' : region === 'UK' ? '🇬🇧 United Kingdom' : '🇦🇺 Australia'}
          </button>
        ))}
      </div>

      {/* Provider / Plan Dropdowns per Region */}
      {selectedRegion === 'US' && (
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-700 block">Select US Insurance Carrier</label>
          <select
            value={usProvider}
            onChange={(e) => setUsProvider(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-brand-500"
          >
            <option value="Delta Dental">Delta Dental (PPO Network)</option>
            <option value="Cigna Dental">Cigna Dental Care</option>
            <option value="MetLife Dental">MetLife Preferred Dentist Program</option>
            <option value="Aetna Dental">Aetna Dental PPO</option>
            <option value="Guardian Dental">Guardian Any Doctor PPO</option>
            <option value="Out-of-pocket / Uninsured">Out-of-pocket / Self-Pay</option>
          </select>
        </div>
      )}

      {selectedRegion === 'UK' && (
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-700 block">Select UK Care Pathway</label>
          <select
            value={ukCareType}
            onChange={(e) => setUkCareType(e.target.value as any)}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-brand-500"
          >
            <option value="Private">Private Dental Consultation</option>
            <option value="NHS Band 1">NHS Dental Care (Band 1 Diagnostic Charge)</option>
          </select>
        </div>
      )}

      {selectedRegion === 'Australia' && (
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-700 block">Select Australian Extras Carrier</label>
          <select
            value={auProvider}
            onChange={(e) => setAuProvider(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-brand-500"
          >
            <option value="Bupa Private Extras">Bupa Private Dental Extras</option>
            <option value="Medibank Private">Medibank Private Dental</option>
            <option value="HCF Extras">HCF More for Teeth</option>
            <option value="NIB Choice Dental Network">NIB Choice Dental Network</option>
            <option value="Self-Pay / No Extras">Self-Pay / No Extras Policy</option>
          </select>
        </div>
      )}

      {/* Coverage & Patient Gap Result Card */}
      <div className="p-4 bg-white rounded-2xl border border-brand-200 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-brand-900">{currentEstimate.providerName}</span>
          <Badge variant="success" className="text-[10px]">
            {currentEstimate.coveragePercent}% Estimated Coverage
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Standard Fee</span>
            <div className="font-bold text-slate-800">{formatCurrency(baseConsultationFee, selectedRegion)}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Patient Out-of-Pocket</span>
            <div className="font-extrabold text-brand-900 text-sm">
              {formatCurrency(currentEstimate.estimatedOutofPocket, selectedRegion)}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 italic leading-snug">
          "{currentEstimate.notes}"
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Coverage estimate — demonstration only.</strong> Actual coverage depends on your policy and provider.
        </div>
      </div>
    </Card>
  );
};
