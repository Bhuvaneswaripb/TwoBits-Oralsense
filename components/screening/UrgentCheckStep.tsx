'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, PhoneCall, ShieldAlert, ArrowRight, Check } from 'lucide-react';

interface UrgentCheckStepProps {
  initialSelected?: string[];
  onContinue: (selectedItems: string[]) => void;
}

export const SAFETY_QUESTIONS = [
  'Severe or rapidly worsening pain',
  'Significant facial or jaw swelling',
  'Uncontrolled bleeding after dental injury',
  'Serious dental or facial trauma',
  'Difficulty breathing or swallowing',
];

export const UrgentCheckStep: React.FC<UrgentCheckStepProps> = ({ initialSelected = [], onContinue }) => {
  const [selectedUrgentItems, setSelectedUrgentItems] = useState<string[]>(initialSelected);

  const toggleSymptom = (item: string) => {
    if (selectedUrgentItems.includes(item)) {
      setSelectedUrgentItems(selectedUrgentItems.filter((i) => i !== item));
    } else {
      setSelectedUrgentItems([...selectedUrgentItems, item]);
    }
  };

  const isUrgent = selectedUrgentItems.length > 0;

  return (
    <Card className="p-6 sm:p-10 shadow-premium border-amber-200 bg-white space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-slate-100 pb-4">
        <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-300">
          <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-700" />
          SAFETY STEP • URGENT SYMPTOM CHECK
        </Badge>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Are you experiencing any urgent dental symptoms?
        </h2>

        <p className="text-xs sm:text-sm text-slate-600">
          Before completing standard screening, please confirm if any of the following emergency symptoms apply:
        </p>
      </div>

      {/* Symptoms Selector */}
      <div className="space-y-2.5">
        {SAFETY_QUESTIONS.map((symptom, idx) => {
          const isSelected = selectedUrgentItems.includes(symptom);
          return (
            <div
              key={idx}
              onClick={() => toggleSymptom(symptom)}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-amber-950 font-bold' : 'text-slate-700'}`}>
                {symptom}
              </span>

              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                  isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {selectedUrgentItems.length > 0 ? `${selectedUrgentItems.length} safety items noted` : 'Select any that apply or continue'}
        </span>

        <Button
          variant="primary"
          size="md"
          onClick={() => onContinue(selectedUrgentItems)}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Continue to Screening Questions
        </Button>
      </div>
    </Card>
  );
};
