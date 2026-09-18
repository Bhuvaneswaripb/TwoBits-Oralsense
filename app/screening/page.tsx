'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONCERN_QUESTIONS, VISUAL_INPUT_CONFIGS, FEATURED_CONCERNS, SECONDARY_CONCERNS } from '@/data/mockData';
import { ConcernType, Question, ScreeningAnswers, ScreeningResult, AttachedVisualInput, NeutralIndication } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Check, ArrowRight, ArrowLeft, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { saveScreeningResult } from '@/lib/storage';
import { UrgentCheckStep } from '@/components/screening/UrgentCheckStep';
import { VisualInputStep } from '@/components/screening/VisualInputStep';
import { AnalysisLoader } from '@/components/screening/AnalysisLoader';
import { ConcernSelection } from '@/components/landing/ConcernSelection';

function UnifiedScreeningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialConcernParam = searchParams?.get('concern');
  const allConcerns = [...FEATURED_CONCERNS, ...SECONDARY_CONCERNS];
  const validConcern = (allConcerns.find((c) => c.id === initialConcernParam)?.id as ConcernType) || 'Bruxism & Jaw Health';

  // Step flow: 'concern' | 'urgent' | 'questions' | 'visual' | 'analyzing'
  const [currentStep, setCurrentStep] = useState<'concern' | 'urgent' | 'questions' | 'visual' | 'analyzing'>(
    initialConcernParam ? 'urgent' : 'concern'
  );

  const [selectedConcern, setSelectedConcern] = useState<ConcernType>(validConcern);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ScreeningAnswers>({});
  const [attachedMedia, setAttachedMedia] = useState<AttachedVisualInput | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const questions: Question[] = CONCERN_QUESTIONS[selectedConcern] || CONCERN_QUESTIONS['Bruxism & Jaw Health'];
  const currentQ = questions[currentQuestionIndex] || questions[0];
  const totalQuestions = questions.length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const selectedValue = answers[currentQ.id];

  const handleSelectConcern = (concernId: ConcernType) => {
    setSelectedConcern(concernId);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentStep('urgent');
  };

  const handleSelectOption = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  };

  const handleQuestionNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentStep('visual');
    }
  };

  const handleQuestionBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setCurrentStep('urgent');
    }
  };

  const handleVisualComplete = (media?: AttachedVisualInput) => {
    setAttachedMedia(media);
    setCurrentStep('analyzing');
  };

  const handleFinishAnalysis = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    let totalPoints = 0;
    Object.values(answers).forEach((val) => {
      totalPoints += val;
    });

    const maxPoints = totalQuestions * 4;
    const rawScore = Math.round((totalPoints / Math.max(1, maxPoints)) * 100);

    let indicationLevel: NeutralIndication = 'LOWER CONCERN';
    if (rawScore > 60) indicationLevel = 'HIGHER CONCERN';
    else if (rawScore > 30) indicationLevel = 'MODERATE CONCERN';

    const whyHighlighted: string[] = [];
    questions.forEach((q) => {
      const val = answers[q.id];
      if (val && val >= 2) {
        whyHighlighted.push(q.text.replace('Do you ', '').replace('Have you ', '').replace('Are you ', '').replace('?', ''));
      }
    });

    if (whyHighlighted.length === 0) {
      whyHighlighted.push('Selected responses indicate mild or occasional symptoms');
    }

    if (attachedMedia) {
      whyHighlighted.push(`Optional ${attachedMedia.type} visual input attached for evaluation`);
    }

    const result: ScreeningResult = {
      id: `scr-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      concern: selectedConcern,
      overallScore: Math.max(20, rawScore),
      indicationLevel,
      riskLevel: indicationLevel === 'HIGHER CONCERN' ? 'Higher' : indicationLevel === 'MODERATE CONCERN' ? 'Moderate' : 'Low',
      symptomsScore: rawScore,
      whyHighlighted: whyHighlighted.slice(0, 4),
      hasVisualInput: !!attachedMedia,
      visualInputType: attachedMedia?.type,
      attachedVisualInput: attachedMedia,
      recommendedNextStep: `Consider discussing these persistent or concerning ${selectedConcern.toLowerCase()} symptoms with a dental professional.`,
      recommendations: [
        `Discuss persistent ${selectedConcern.toLowerCase()} symptoms during your next dental visit.`,
        'Log symptom trends using OralSense daily symptom monitoring.',
        'Follow recommended oral hygiene practices and avoid excessive biting strain.',
      ],
    };

    try {
      const response = await fetch('http://localhost:5000/api/screenings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: 'pat-default',
          concern: result.concern,
          overallScore: result.overallScore,
          score: result.overallScore,
          indicationLevel: result.indicationLevel,
          summary: result.recommendedNextStep || 'AI-assisted screening summary',
          recommendedNextStep: result.recommendedNextStep,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Backend server returned status ${response.status}`);
      }

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.message || 'Failed to save screening result.');
      }

      saveScreeningResult(result);
      router.push('/results');
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'Error connecting to backend server.');
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header Stepper Banner */}
      <div className="text-center space-y-3">
        <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
          AI-ASSISTED SCREENING ENGINE
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          Dental Symptom Early-Screening
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          BruxCare provides an early screening summary for informational purposes. It does not diagnose dental conditions or replace professional dental evaluation.
        </p>
      </div>

      {/* Progress Indicator Steps Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle space-y-2">
        <div className="grid grid-cols-6 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
          <span className={currentStep === 'concern' ? 'text-brand-700 font-extrabold' : ''}>1. Concern</span>
          <span className={currentStep === 'urgent' ? 'text-brand-700 font-extrabold' : ''}>2. Safety</span>
          <span className={currentStep === 'questions' ? 'text-brand-700 font-extrabold' : ''}>3. Questions</span>
          <span className={currentStep === 'visual' ? 'text-brand-700 font-extrabold' : ''}>4. Visual</span>
          <span className={currentStep === 'analyzing' ? 'text-brand-700 font-extrabold' : ''}>5. Summary</span>
          <span>6. Dentist</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{
              width:
                currentStep === 'concern'
                  ? '16%'
                  : currentStep === 'urgent'
                  ? '33%'
                  : currentStep === 'questions'
                  ? '50%'
                  : currentStep === 'visual'
                  ? '66%'
                  : currentStep === 'analyzing'
                  ? '83%'
                  : '100%',
            }}
          />
        </div>
      </div>

      {/* STEP 1: CONCERN SELECTION ENTRY */}
      {currentStep === 'concern' && (
        <Card className="p-6 sm:p-10 shadow-premium border-brand-100 bg-white">
          <ConcernSelection onSelectConcern={handleSelectConcern} showServices={true} />
        </Card>
      )}

      {/* STEP 2: URGENT SYMPTOM SAFETY CHECK */}
      {currentStep === 'urgent' && (
        <UrgentCheckStep onContinue={() => setCurrentStep('questions')} />
      )}

      {/* STEP 3: PERSONALIZED SCREENING QUESTIONS */}
      {currentStep === 'questions' && (
        <Card className="p-6 sm:p-10 shadow-premium border-brand-100 bg-white space-y-8">
          
          {/* Question Sub-header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
                {selectedConcern} Assessment
              </span>
              <span className="text-xs text-slate-400 capitalize">{currentQ.category} evaluation</span>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
                <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Large Readable Question */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {currentQ.text}
            </h2>
            <p className="text-xs text-slate-500">
              Select the option that best describes your experience over recent weeks.
            </p>
          </div>

          {/* Simple Answer Option Buttons */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = selectedValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectOption(opt.value)}
                  className={`flex items-center justify-between p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-slate-50/80'
                  }`}
                >
                  <span className={`text-base font-semibold ${isSelected ? 'text-brand-950 font-bold' : 'text-slate-700'}`}>
                    {opt.label}
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-brand-600 border-brand-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              onClick={handleQuestionBack}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>

            <Button
              variant="primary"
              size="md"
              disabled={selectedValue === undefined}
              onClick={handleQuestionNext}
              icon={<ArrowRight className="w-4 h-4" />}
              className="font-bold shadow-subtle"
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Proceed to Visual Check' : 'Next Question'}
            </Button>
          </div>

        </Card>
      )}

      {/* STEP 4: OPTIONAL VISUAL CHECK */}
      {currentStep === 'visual' && (
        <VisualInputStep
          config={VISUAL_INPUT_CONFIGS[selectedConcern] || VISUAL_INPUT_CONFIGS['Bruxism & Jaw Health']}
          onContinue={handleVisualComplete}
          onSkip={() => handleVisualComplete(undefined)}
        />
      )}

      {/* STEP 5: AI ANALYSIS ANIMATION & BACKEND SYNC */}
      {currentStep === 'analyzing' && (
        <>
          {submitError ? (
            <Card className="p-8 text-center space-y-4 max-w-md mx-auto bg-white border-rose-200">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">Failed to Save Screening</h2>
              <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {submitError}
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSubmitError(null);
                    setCurrentStep('questions');
                  }}
                >
                  Back to Questions
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  onClick={handleFinishAnalysis}
                >
                  {isSubmitting ? 'Saving...' : 'Retry Saving'}
                </Button>
              </div>
            </Card>
          ) : (
            <AnalysisLoader onComplete={handleFinishAnalysis} />
          )}
        </>
      )}

      {/* Mandatory Disclaimer Footer */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 text-center">
        <AlertCircle className="w-4 h-4 shrink-0 text-slate-400" />
        <span>OralSense provides an early screening summary for informational purposes. It does not diagnose dental conditions or replace professional dental evaluation.</span>
      </div>

    </div>
  );
}

export default function ScreeningPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading OralSense adaptive engine...</p>
          </div>
        </div>
      }
    >
      <UnifiedScreeningContent />
    </Suspense>
  );
}
