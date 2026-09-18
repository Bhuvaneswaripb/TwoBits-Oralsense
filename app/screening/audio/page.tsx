'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Square, Play, Pause, Upload, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getStoredScreeningResult, saveScreeningResult } from '@/lib/storage';

export default function AudioScreeningPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Timer logic for recording
  useEffect(() => {
    let interval: any = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev >= 15) {
            // Auto stop at 15s for demo preview
            setIsRecording(false);
            setHasRecorded(true);
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const handleStartRecording = () => {
    setTimerSeconds(0);
    setHasRecorded(false);
    setAnalysisComplete(false);
    setIsRecording(true);
    setIsPaused(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
  };

  const handleAnalyzeAudio = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);

      // Save audio result into screening state
      const current = getStoredScreeningResult();
      const updated = {
        ...current,
        audioResult: {
          grindingEventsCount: 7,
          confidence: 'Moderate' as const,
          durationSeconds: timerSeconds || 120,
          decibelPeaks: [42, 58, 64, 51, 69, 45, 62],
          timestamp: new Date().toLocaleTimeString(),
        }
      };
      saveScreeningResult(updated);
    }, 1800);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="secondary">STEP 2 OF 3 • AUDIO PATTERN ANALYSIS</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          Check for nighttime sound patterns
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Place your phone near your bed while you sleep. BruxCare can analyze a sample recording for sound patterns that may be consistent with grinding.
        </p>
      </div>

      {/* Main Recorder Card */}
      <Card className="p-8 shadow-premium text-center space-y-8 border-brand-100 relative overflow-hidden">
        
        {!analysisComplete ? (
          <>
            {/* Visual Mic / Waveform Container */}
            <div className="flex flex-col items-center justify-center space-y-6">
              
              {/* Mic Circle */}
              <div className="relative">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
                )}
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
                    isRecording
                      ? 'bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600'
                      : hasRecorded
                      ? 'bg-emerald-600 text-white shadow-emerald-200'
                      : 'bg-brand-800 text-white hover:bg-brand-900 hover:scale-105 shadow-brand-200'
                  }`}
                >
                  {isRecording ? (
                    <Square className="w-10 h-10" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                  <span className="text-[11px] font-bold mt-1 tracking-wider uppercase">
                    {isRecording ? 'Stop' : hasRecorded ? 'Re-record' : 'Record'}
                  </span>
                </button>
              </div>

              {/* Timer Display */}
              <div className="space-y-1">
                <div className="text-4xl font-mono font-bold text-slate-900">
                  {formatTimer(timerSeconds)}
                </div>
                <div className="text-xs text-slate-400">
                  {isRecording ? 'Listening for nighttime sound signals...' : hasRecorded ? 'Audio Sample Captured (15s)' : 'Tap Mic to start sample capture'}
                </div>
              </div>

              {/* Simulated Waveform Graphic */}
              <div className="w-full max-w-md h-16 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-center gap-1.5 px-6">
                {[30, 45, 75, 20, 90, 60, 40, 80, 50, 95, 30, 70, 85, 40, 60, 30, 75, 90, 45, 60].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isRecording
                        ? 'bg-brand-500 animate-wave'
                        : hasRecorded
                        ? 'bg-emerald-500'
                        : 'bg-slate-300'
                    }`}
                    style={{
                      height: isRecording ? `${Math.min(100, h * (0.5 + Math.random()))}%` : `${h * 0.4}%`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-100">
              
              {!hasRecorded ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleStartRecording}
                    icon={<Mic className="w-4 h-4" />}
                  >
                    Start Demo Audio Test
                  </Button>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    <Upload className="w-4 h-4 text-brand-600" />
                    <span>Upload .wav/.mp3</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={() => {
                        setTimerSeconds(120);
                        setHasRecorded(true);
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={isAnalyzing}
                    onClick={handleAnalyzeAudio}
                    icon={isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  >
                    {isAnalyzing ? 'Analyzing sound patterns...' : 'Analyze Audio Sample'}
                  </Button>
                </div>
              )}

            </div>
          </>
        ) : (
          /* Mock Audio Result View */
          <div className="space-y-6 py-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="success">AUDIO ANALYSIS COMPLETE</Badge>
              <h2 className="text-2xl font-bold text-brand-950">Sound Pattern Summary</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="space-y-1 text-center">
                <div className="text-xs font-semibold text-slate-500 uppercase">Grinding Events</div>
                <div className="text-3xl font-extrabold text-brand-900">7</div>
                <div className="text-[11px] text-slate-400">Detected friction signals</div>
              </div>
              <div className="space-y-1 text-center">
                <div className="text-xs font-semibold text-slate-500 uppercase">AI Confidence</div>
                <div className="text-3xl font-extrabold text-amber-600">Moderate</div>
                <div className="text-[11px] text-slate-400">Audio signal match</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs border border-amber-200 max-w-md mx-auto flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Prototype analysis — not a medical diagnosis.</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => router.push('/results')}
              >
                Skip to Results
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/screening/face')}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Proceed to Facial Scanner
              </Button>
            </div>
          </div>
        )}

      </Card>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button onClick={() => router.push('/screening')} className="flex items-center gap-1 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" /> Back to Questionnaire
        </button>
        <button onClick={() => router.push('/screening/face')} className="flex items-center gap-1 text-brand-700 font-semibold hover:underline">
          Skip to Facial Check <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
