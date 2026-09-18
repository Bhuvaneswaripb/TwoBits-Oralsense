'use client';

import React from 'react';
import Link from 'next/link';
import { SECONDARY_CONCERNS } from '@/data/mockData';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, ArrowRight, AlertCircle, Volume2, FileText, Wind, Droplets, HelpCircle, Sparkles, HeartPulse } from 'lucide-react';

interface SecondaryConcernsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  AlertCircle: <AlertCircle className="w-5 h-5 text-emerald-600" />,
  Volume2: <Volume2 className="w-5 h-5 text-blue-600" />,
  Wind: <Wind className="w-5 h-5 text-teal-600" />,
  Droplets: <Droplets className="w-5 h-5 text-cyan-600" />,
  HelpCircle: <HelpCircle className="w-5 h-5 text-indigo-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-rose-500" />,
  FileText: <FileText className="w-5 h-5 text-slate-600" />,
};

export const SecondaryConcernsModal: React.FC<SecondaryConcernsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <Badge variant="neutral" className="mb-1 text-[10px]">ALL DENTAL CONCERNS</Badge>
            <h3 className="text-xl font-extrabold text-brand-950">Secondary Dental Concerns</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECONDARY_CONCERNS.map((item) => (
            <Card
              key={item.id}
              className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 hover:bg-white hover:shadow-subtle transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shrink-0">
                  {ICON_MAP[item.iconName] || <FileText className="w-5 h-5 text-brand-600" />}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-brand-950 group-hover:text-brand-600 transition-colors">{item.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{item.description}</div>
                </div>
              </div>

              <Link href={`/screening?concern=${encodeURIComponent(item.id)}`} onClick={onClose} className="shrink-0">
                <Button variant="outline" size="sm" className="text-xs font-bold" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Screen
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="pt-2 text-center text-xs text-slate-400">
          All screening pathways use OralSense's unified adaptive engine.
        </div>

      </div>
    </div>
  );
};
