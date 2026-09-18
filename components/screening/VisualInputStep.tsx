'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VisualInputConfig, AttachedVisualInput } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Camera, Video, Upload, Check, X, ShieldCheck, Info, AlertCircle, RefreshCw, Play, Square } from 'lucide-react';

interface VisualInputStepProps {
  config: VisualInputConfig;
  onContinue: (attachedMedia?: AttachedVisualInput) => void;
  onSkip: () => void;
}

export const VisualInputStep: React.FC<VisualInputStepProps> = ({
  config,
  onContinue,
  onSkip,
}) => {
  const [attachedMedia, setAttachedMedia] = useState<AttachedVisualInput | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser camera API is not available.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: config.mediaType === 'video',
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
      console.warn('Camera access error, falling back to file upload:', err);
      setCameraError('Camera access unavailable or declined. Please choose a photo/video file from your device.');
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
      setPreviewUrl(dataUrl);

      const captured: AttachedVisualInput = {
        type: 'photo',
        fileUrl: dataUrl,
        fileName: `dental_photo_${Date.now().toString().slice(-4)}.jpg`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAttachedMedia(captured);
      stopCameraStream();
    }
  };

  const simulateRecordVideo = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const captured: AttachedVisualInput = {
        type: 'video',
        fileUrl: 'sample_jaw_movement.mp4',
        fileName: `jaw_movement_recording_${Date.now().toString().slice(-4)}.mp4`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAttachedMedia(captured);
      setPreviewUrl('sample_jaw_movement.mp4');
      stopCameraStream();
    }, 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      const isVideo = file.type.startsWith('video');
      const uploaded: AttachedVisualInput = {
        type: isVideo ? 'video' : 'photo',
        fileUrl: url,
        fileName: file.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAttachedMedia(uploaded);
      stopCameraStream();
    }
  };

  const handleRemoveMedia = () => {
    setAttachedMedia(null);
    setPreviewUrl(null);
    stopCameraStream();
  };

  if (config.mediaType === 'none') {
    return (
      <Card className="p-8 shadow-premium border-brand-100 bg-white text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <Badge variant="primary">NO VISUAL INPUT REQUIRED</Badge>
          <h2 className="text-2xl font-bold text-slate-900">{config.title}</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">{config.description}</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => onContinue(undefined)}>
          Proceed to AI Analysis Summary
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-10 shadow-premium border-brand-100 bg-white space-y-6">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Badge variant="primary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
            OPTIONAL VISUAL CHECK
          </Badge>
          <Badge variant="neutral" className="text-[10px] uppercase">
            {config.mediaType} INPUT
          </Badge>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {config.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {config.description}
        </p>
      </div>

      {/* Capture Guidance Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
        <div className="font-bold text-brand-950 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-cyan-600" />
          Capture & Lighting Guidance
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pl-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
            <span>Use good room lighting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
            <span>Keep the camera steady</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
            <span>Avoid camera flash glare</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
            <span>Only upload media relevant to your dental concern</span>
          </div>
        </div>
      </div>

      {/* Camera / Upload Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 relative overflow-hidden border border-slate-800">
        
        {/* State 1: Live Camera Active */}
        {isCameraActive ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black max-w-md mx-auto aspect-video border border-slate-700">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              {isRecording && (
                <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                  <Square className="w-2.5 h-2.5 fill-white" /> RECORDING JAW MOVEMENT...
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              {config.mediaType === 'video' ? (
                <Button
                  variant="primary"
                  size="md"
                  disabled={isRecording}
                  onClick={simulateRecordVideo}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold border-0"
                  icon={<Video className="w-4 h-4" />}
                >
                  {isRecording ? 'Recording (5s)...' : 'Start 5s Video Recording'}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={capturePhoto}
                  className="bg-cyan-500 hover:bg-cyan-400 text-brand-950 font-bold border-0"
                  icon={<Camera className="w-4 h-4" />}
                >
                  Capture Photo
                </Button>
              )}

              <Button variant="ghost" size="sm" onClick={stopCameraStream} className="text-slate-300">
                Cancel
              </Button>
            </div>
          </div>
        ) : attachedMedia ? (
          /* State 2: Media Captured / Uploaded Preview */
          <div className="space-y-4 py-2 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <Badge variant="success">VISUAL INPUT ATTACHED</Badge>
              <div className="text-sm font-bold text-white">{attachedMedia.fileName}</div>
              <div className="text-xs text-slate-400">Recorded/Uploaded at {attachedMedia.timestamp}</div>
            </div>

            {previewUrl && (
              <div className="max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-700 bg-black p-1">
                {attachedMedia.type === 'photo' && previewUrl.startsWith('data:') ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-36 object-cover rounded-lg" />
                ) : (
                  <div className="p-4 bg-slate-800 rounded-lg text-xs text-slate-300 flex items-center justify-center gap-2">
                    <Video className="w-5 h-5 text-cyan-400" />
                    <span>Video Clip Ready</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleRemoveMedia}
              className="text-xs text-rose-400 hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <X className="w-4 h-4" /> Remove / Retake Media
            </button>
          </div>
        ) : (
          /* State 3: Choice Buttons (Take Photo vs Upload Photo) */
          <div className="space-y-5 py-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
              {config.mediaType === 'video' ? <Video className="w-8 h-8" /> : <Camera className="w-8 h-8" />}
            </div>

            <div className="space-y-1">
              <div className="text-base font-bold text-white">
                {config.mediaType === 'video'
                  ? 'Record or Upload Jaw Movement Video'
                  : 'Take or Upload Photo'}
              </div>
              <div className="text-xs text-slate-400">
                Visual input is optional and assists your dentist during consultation.
              </div>
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
                icon={config.mediaType === 'video' ? <Video className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
              >
                Option A: {config.mediaType === 'video' ? 'Record Video' : 'Take Photo'}
              </Button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                Option B: Upload {config.mediaType === 'video' ? 'Video File' : 'Photo File'}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept={config.mediaType === 'video' ? 'video/*' : 'image/*'}
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}

      </div>

      {/* Privacy Notice Box */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Privacy & Data Control
        </div>
        <p>
          "Your screening media is stored locally and shared with a dental professional only when you choose to share it."
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <Button variant="ghost" size="sm" onClick={onSkip} className="text-xs text-slate-500 hover:text-slate-800">
          Skip Visual Check
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={() => onContinue(attachedMedia || undefined)}
        >
          {attachedMedia ? 'Continue to AI Analysis' : 'Proceed Without Visual Check'}
        </Button>
      </div>

    </Card>
  );
};
