'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, PhoneCall, ShieldAlert, ArrowRight, Check } from 'lucide-react';

interface UrgentCheckStepProps {
  onContinue: () => void;
}

export const UrgentCheckStep: React.FC<UrgentCheckStepProps> = ({ onContinue }) => {
  const [selectedUrgentItems, setSelectedUrgentItems] = useState<string[]>([]);
  const [hasChecked, setHasChecked] = useState(false);

  const urgentSymptoms = [
    'Severe or rapidly worsening pain',
    'Significant facial or jaw swelling',
    'Uncontrolled bleeding after dental injury',
    'Serious dental or facial trauma',
    'Difficulty breathing or swallowing',
  ];

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
        {urgentSymptoms.map((symptom, idx) => {
          const isSelected = selectedUrgentItems.includes(symptom);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleSymptom(symptom)}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                isSelected
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-amber-950' : 'text-slate-700'}`}>
                {symptom}
              </span>

              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'
              }`}>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Emergency Warning Box if Urgent Selected */}
      {isUrgent ? (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            Prompt Professional Evaluation Advised
          </div>
          
          <p className="text-xs text-amber-900 leading-relaxed">
            These symptoms may require prompt professional attention. Please contact an appropriate dental clinic or emergency healthcare service immediately.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <a
              href="tel:112"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
            >
              <PhoneCall className="w-4 h-4" /> Call Local Emergency Services
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={onContinue}
              className="w-full sm:w-auto text-xs border-amber-300 text-amber-900 hover:bg-amber-100"
            >
              Proceed to Standard Screening
            </Button>
          </div>
        </div>
      ) : (
        /* Normal Continue Button */
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">None of the above apply</span>
          
          <Button
            variant="primary"
            size="md"
            onClick={onContinue}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Screening Questions
          </Button>
        </div>
      )}

    </Card>
  );
};
