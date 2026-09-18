'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, Scan, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getStoredScreeningResult, saveScreeningResult } from '@/lib/storage';

export default function FacialScreeningPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanFinished, setScanFinished] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isScanning && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isScanning && countdown === 0) {
      setIsScanning(false);
      setIsAnalyzing(true);

      setTimeout(() => {
        setIsAnalyzing(false);
        setScanFinished(true);

        // Update screening result with facial data
        const current = getStoredScreeningResult();
        const updated = {
          ...current,
          facialResult: {
            jawMovement: 'Moderate' as const,
            facialSymmetry: 'Normal' as const,
            daytimeClenching: 'Elevated' as const,
            timestamp: new Date().toLocaleTimeString(),
          }
        };
        saveScreeningResult(updated);
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isScanning, countdown]);

  const handleStartScan = () => {
    setCountdown(10);
    setScanFinished(false);
    setIsScanning(true);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="secondary">STEP 3 OF 3 • FACIAL JAW DYNAMICS</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950 tracking-tight">
          Optional daytime jaw movement check
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Record a short 10-second video while gently clenching and relaxing your jaw.
        </p>
      </div>

      {/* Main Camera Scanner Card */}
      <Card className="p-8 shadow-premium text-center space-y-6 border-brand-100 relative overflow-hidden">
        
        {!scanFinished ? (
          <div className="space-y-6">
            
            {/* Camera Viewfinder Frame */}
            <div className="relative w-full max-w-md h-72 mx-auto rounded-3xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-2 border-slate-800 shadow-inner group">
              
              {/* Simulated Face Outline Grid */}
              <div className="absolute inset-8 rounded-[40%] border-2 border-dashed border-cyan-400/60 flex items-center justify-center pointer-events-none">
                <div className="w-full h-px bg-cyan-400/20" />
                <div className="h-full w-px bg-cyan-400/20 absolute" />
              </div>

              {/* Laser Scanning Bar */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-glow animate-scan z-10" />
              )}

              {/* Viewfinder Center Content */}
              <div className="z-10 text-center space-y-2 p-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-cyan-300 flex items-center justify-center mx-auto border border-white/10">
                  <Camera className="w-7 h-7" />
                </div>
                
                {isScanning ? (
                  <div className="space-y-1">
                    <div className="text-5xl font-mono font-extrabold text-cyan-300">
                      {countdown}s
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      Gently clench and relax your jaw...
                    </div>
                  </div>
                ) : isAnalyzing ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                    <div className="text-sm font-bold text-white">Analyzing daytime jaw movement...</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-white">Face Positioning Guide</div>
                    <div className="text-xs text-slate-400">Position your face inside the frame</div>
                  </div>
                )}
              </div>

            </div>

            {/* Controls */}
            {!isScanning && !isAnalyzing && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartScan}
                  icon={<Scan className="w-5 h-5" />}
                >
                  Start 10-Second Check
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => router.push('/results')}
                >
                  Skip to Final Results
                </Button>
              </div>
            )}

          </div>
        ) : (
          /* Mock Facial Result View */
          <div className="space-y-6 py-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <Badge variant="success">FACIAL SCAN COMPLETE</Badge>
              <h2 className="text-2xl font-bold text-brand-950">Daytime Jaw Movement Indicator</h2>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="space-y-1 text-center">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Jaw Movement</div>
                <div className="text-lg font-bold text-brand-900">Moderate</div>
              </div>
              <div className="space-y-1 text-center border-x border-slate-200 px-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Facial Symmetry</div>
                <div className="text-lg font-bold text-emerald-700">Normal</div>
              </div>
              <div className="space-y-1 text-center">
                <div className="text-[11px] font-semibold text-slate-500 uppercase">Daytime Clenching</div>
                <div className="text-lg font-bold text-amber-700">Elevated</div>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 text-amber-900 rounded-xl text-xs border border-amber-200 max-w-md mx-auto flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Facial analysis provides an experimental daytime indicator and cannot confirm sleep bruxism.</span>
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/results')}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                View Full Screening Results
              </Button>
            </div>
          </div>
        )}

      </Card>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button onClick={() => router.push('/screening/audio')} className="flex items-center gap-1 hover:text-slate-800">
          <ArrowLeft className="w-4 h-4" /> Back to Audio Test
        </button>
        <button onClick={() => router.push('/results')} className="flex items-center gap-1 text-brand-700 font-semibold hover:underline">
          Go directly to Results <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
