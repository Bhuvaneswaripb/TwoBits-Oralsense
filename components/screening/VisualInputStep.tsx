'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VisualInputConfig, AttachedVisualInput } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Camera,
  Upload,
  Check,
  X,
  ShieldCheck,
  Info,
  AlertCircle,
  RefreshCw,
  Video,
  ChevronRight,
} from 'lucide-react';

export type ViewType = 'Front' | 'Left' | 'Right' | 'Upper' | 'Lower';

export interface ViewInput {
  type: ViewType;
  label: string;
  instruction: string;
  dataUrl?: string;
  fileName?: string;
  timestamp?: string;
}

interface VisualInputStepProps {
  config: VisualInputConfig;
  onContinue: (attachedMedia?: AttachedVisualInput | any) => void;
  onSkip: () => void;
}

const FIVE_VIEWS: { type: ViewType; label: string; instruction: string }[] = [
  {
    type: 'Front',
    label: '1. Front View',
    instruction: 'Capture the front of your teeth with good lighting.',
  },
  {
    type: 'Left',
    label: '2. Left View',
    instruction: 'Capture the left side of your teeth.',
  },
  {
    type: 'Right',
    label: '3. Right View',
    instruction: 'Capture the right side of your teeth.',
  },
  {
    type: 'Upper',
    label: '4. Upper View',
    instruction: 'Capture the upper teeth from an inside/below angle.',
  },
  {
    type: 'Lower',
    label: '5. Lower View',
    instruction: 'Capture the lower teeth from an inside/above angle.',
  },
];

export const VisualInputStep: React.FC<VisualInputStepProps> = ({ config, onContinue, onSkip }) => {
  const [activeViewIndex, setActiveViewIndex] = useState(0);
  const [viewInputs, setViewInputs] = useState<Record<ViewType, ViewInput>>({
    Front: { type: 'Front', label: 'Front View', instruction: FIVE_VIEWS[0].instruction },
    Left: { type: 'Left', label: 'Left View', instruction: FIVE_VIEWS[1].instruction },
    Right: { type: 'Right', label: 'Right View', instruction: FIVE_VIEWS[2].instruction },
    Upper: { type: 'Upper', label: 'Upper View', instruction: FIVE_VIEWS[3].instruction },
    Lower: { type: 'Lower', label: 'Lower View', instruction: FIVE_VIEWS[4].instruction },
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentViewConfig = FIVE_VIEWS[activeViewIndex];
  const currentViewData = viewInputs[currentViewConfig.type];

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      setIsCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err: any) {
      console.warn('Camera access issue:', err.message);
      setCameraError('Camera access unavailable or declined. Please choose a photo file from your device.');
      stopCameraStream();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');

      setViewInputs((prev) => ({
        ...prev,
        [currentViewConfig.type]: {
          ...prev[currentViewConfig.type],
          dataUrl,
          fileName: `${currentViewConfig.type.toLowerCase()}_teeth_view.jpg`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      }));
      stopCameraStream();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setViewInputs((prev) => ({
          ...prev,
          [currentViewConfig.type]: {
            ...prev[currentViewConfig.type],
            dataUrl: url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        }));
        stopCameraStream();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveView = (type: ViewType) => {
    setViewInputs((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        dataUrl: undefined,
        fileName: undefined,
        timestamp: undefined,
      },
    }));
    stopCameraStream();
  };

  const capturedCount = Object.values(viewInputs).filter((v) => Boolean(v.dataUrl)).length;

  const handleCompleteScreening = () => {
    const validViews = Object.values(viewInputs).filter((v) => Boolean(v.dataUrl));
    if (validViews.length === 0) {
      onContinue(undefined);
      return;
    }

    const payload: AttachedVisualInput = {
      type: 'photo',
      fileUrl: validViews[0].dataUrl || '',
      fileName: validViews.length === 1 ? `${validViews[0].type} View Photo` : `${validViews.length} Dental Photo Views`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      // Additional metadata
      views: validViews,
      photoCount: validViews.length,
    } as any;

    onContinue(payload);
  };

  return (
    <Card className="p-6 sm:p-10 shadow-premium border-brand-100 bg-white space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
            OPTIONAL FIVE-DIRECTION VISUAL CAPTURE
          </Badge>
          <Badge variant="neutral" className="text-[10px] uppercase font-mono">
            {capturedCount} OF 5 VIEWS CAPTURED
          </Badge>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Five-Direction Visual Capture</h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Provide optional photos of your teeth from up to five directions to help organize details for your dentist.
        </p>
      </div>

      {/* View Selector Tabs */}
      <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        {FIVE_VIEWS.map((v, idx) => {
          const hasImage = Boolean(viewInputs[v.type].dataUrl);
          const isActive = idx === activeViewIndex;

          return (
            <button
              key={v.type}
              type="button"
              onClick={() => {
                stopCameraStream();
                setActiveViewIndex(idx);
              }}
              className={`py-2 px-1 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? 'bg-brand-900 text-white shadow-sm font-bold'
                  : hasImage
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              <span className="text-[11px] sm:text-xs tracking-tight">{v.type}</span>
              {hasImage ? (
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-300" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active View Title & Instruction */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
        <div className="font-extrabold text-brand-950 uppercase tracking-wide flex items-center gap-2">
          <span>{currentViewConfig.label}</span>
          {viewInputs[currentViewConfig.type].dataUrl && (
            <Badge variant="success" className="text-[10px]">
              CAPTURED
            </Badge>
          )}
        </div>
        <p className="text-slate-600">{currentViewConfig.instruction}</p>
      </div>

      {/* Camera / Photo Upload Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 relative overflow-hidden border border-slate-800">
        {isCameraActive ? (
          /* Live Camera Stream */
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black max-w-md mx-auto aspect-video border border-slate-700">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={capturePhoto}
                className="bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-bold border-0"
                icon={<Camera className="w-4 h-4" />}
              >
                Capture {currentViewConfig.type} View Photo
              </Button>

              <Button variant="ghost" size="sm" onClick={stopCameraStream} className="text-slate-300">
                Cancel
              </Button>
            </div>
          </div>
        ) : currentViewData.dataUrl ? (
          /* Image Preview & Retake / Remove Options */
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="max-w-xs mx-auto rounded-2xl overflow-hidden border-2 border-cyan-400 bg-black p-1 shadow-lg">
              <img src={currentViewData.dataUrl} alt={`${currentViewConfig.type} view`} className="w-full h-44 object-cover rounded-xl" />
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-white">{currentViewConfig.type} View Attached</div>
              <div className="text-xs text-slate-400">Recorded at {currentViewData.timestamp}</div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-cyan-300 hover:bg-white/20 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
              </button>

              <button
                type="button"
                onClick={() => handleRemoveView(currentViewConfig.type)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Remove View
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Capture Trigger */
          <div className="space-y-5 py-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="text-base font-bold text-white">Capture or Upload {currentViewConfig.type} View</div>
              <div className="text-xs text-slate-400">{currentViewConfig.instruction}</div>
            </div>

            {cameraError && (
              <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs text-left flex items-start gap-2 max-w-md mx-auto">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={startCamera}
                className="bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-bold border-0 text-xs w-full sm:w-auto"
                icon={<Camera className="w-4 h-4" />}
              >
                Camera (Take Photo)
              </Button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                Upload Photo File
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Privacy & Data Control
        </div>
        <p>"Your screening media is stored locally and shared with a dental professional only when you choose to share it."</p>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button variant="ghost" size="sm" onClick={onSkip} className="text-xs text-slate-500 hover:text-slate-800">
          Skip Visual Check
        </Button>

        <div className="flex items-center gap-2">
          {activeViewIndex < FIVE_VIEWS.length - 1 ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                stopCameraStream();
                setActiveViewIndex((prev) => prev + 1);
              }}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Next View ({FIVE_VIEWS[activeViewIndex + 1].type})
            </Button>
          ) : null}

          <Button variant="primary" size="md" onClick={handleCompleteScreening}>
            {capturedCount > 0 ? `Continue with ${capturedCount} Photo${capturedCount > 1 ? 's' : ''}` : 'Proceed Without Visual Check'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
