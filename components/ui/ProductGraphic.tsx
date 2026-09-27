'use client';

import React from 'react';

interface ProductGraphicProps {
  productId?: string;
  category: string;
  className?: string;
}

export const ProductGraphic: React.FC<ProductGraphicProps> = ({ productId, category, className = 'w-full h-44' }) => {
  // Specific static product renders based on productId
  if (productId === 'prod-1') {
    return (
      <div className={`rounded-2xl bg-gradient-to-br from-cyan-100 via-sky-50 to-teal-100 flex items-center justify-center p-3 relative overflow-hidden shadow-inner border border-cyan-200/50 ${className}`}>
        {/* Soft studio backdrop lighting circle */}
        <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl transform scale-75 pointer-events-none" />
        
        <svg className="w-full h-full max-h-36 drop-shadow-lg relative z-10" viewBox="0 0 200 140" fill="none">
          {/* Toothbrush Body & Handle */}
          <rect x="88" y="45" width="24" height="85" rx="12" fill="#0284C7" />
          <rect x="92" y="48" width="16" height="79" rx="8" fill="#0EA5E9" />
          
          {/* Soft Ergonomic Silicone Side Grips */}
          <rect x="85" y="65" width="4" height="35" rx="2" fill="#38BDF8" />
          <rect x="111" y="65" width="4" height="35" rx="2" fill="#38BDF8" />
          <circle cx="100" cy="72" r="3" fill="#E0F2FE" />
          <circle cx="100" cy="84" r="3" fill="#E0F2FE" />
          
          {/* Sonic Power Button */}
          <circle cx="100" cy="100" r="5" fill="#0284C7" stroke="#BAE6FD" strokeWidth="1.5" />
          
          {/* Neck */}
          <rect x="94" y="25" width="12" height="23" rx="4" fill="#E0F2FE" />
          <rect x="96" y="25" width="8" height="23" rx="2" fill="#FFFFFF" />
          
          {/* Brush Head */}
          <rect x="91" y="10" width="18" height="20" rx="6" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="1" />
          
          {/* Micro Tapered Soft Bristles */}
          <path d="M83 14 H90 M83 17 H90 M83 20 H90 M83 23 H90" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M83 15.5 H89 M83 18.5 H89 M83 21.5 H89" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" />

          {/* Sonic Vibrational Wave Indicator */}
          <path d="M74 15 Q71 18.5 74 22" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M69 13 Q65 18.5 69 24" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

          {/* Realistic Clean Shine */}
          <ellipse cx="100" cy="58" rx="4" ry="12" fill="#FFFFFF" opacity="0.4" />
        </svg>

        {/* Realistic Product Badge */}
        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-xs text-[9px] font-extrabold text-cyan-900 px-2 py-0.5 rounded-full border border-cyan-200 shadow-2xs">
          SONIC SOFT 3-6Y
        </div>
      </div>
    );
  }

  if (productId === 'prod-2') {
    return (
      <div className={`rounded-2xl bg-gradient-to-br from-indigo-100 via-slate-50 to-blue-200 flex items-center justify-center p-3 relative overflow-hidden shadow-inner border border-indigo-200/50 ${className}`}>
        <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl transform scale-75 pointer-events-none" />
        
        <svg className="w-full h-full max-h-36 drop-shadow-lg relative z-10" viewBox="0 0 200 140" fill="none">
          {/* Main Handle */}
          <rect x="85" y="42" width="30" height="88" rx="15" fill="#312E81" />
          <rect x="89" y="45" width="22" height="82" rx="11" fill="#4338CA" />

          {/* Pressure Sensor Ring */}
          <rect x="85" y="40" width="30" height="5" fill="#F43F5E" rx="1.5" opacity="0.85" />
          <rect x="85" y="45" width="30" height="3" fill="#E2E8F0" rx="1" />

          {/* Power Button with LED halo */}
          <circle cx="100" cy="72" r="7" fill="#6366F1" stroke="#EEF2FF" strokeWidth="2" />
          <path d="M100 68 V72 M98 70 H102" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

          {/* Speed Indicator Lights */}
          <circle cx="100" cy="88" r="2" fill="#34D399" />
          <circle cx="100" cy="96" r="2" fill="#34D399" />

          {/* Stainless Shaft */}
          <rect x="96" y="20" width="8" height="20" fill="#94A3B8" />
          <rect x="98" y="20" width="4" height="20" fill="#F8FAFC" />

          {/* Oscillating Round Brush Head */}
          <circle cx="100" cy="15" r="11" fill="#FFFFFF" stroke="#4338CA" strokeWidth="2" />
          <circle cx="100" cy="15" r="8" fill="#60A5FA" />
          <circle cx="100" cy="15" r="4" fill="#1D4ED8" />
          
          {/* Oscillation Motion Rays */}
          <circle cx="100" cy="15" r="14" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>

        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-xs text-[9px] font-extrabold text-indigo-900 px-2 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
          OSCILLATING 6-12Y
        </div>
      </div>
    );
  }

  if (productId === 'prod-3') {
    return (
      <div className={`rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 flex items-center justify-center p-3 relative overflow-hidden shadow-inner border border-emerald-200/50 ${className}`}>
        <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl transform scale-75 pointer-events-none" />
        
        <svg className="w-full h-full max-h-36 drop-shadow-lg relative z-10" viewBox="0 0 200 140" fill="none">
          {/* Toothpaste Tube Body - Squeezable soft tube angle */}
          <path d="M45 50 L155 35 L145 105 L35 120 Z" fill="#047857" />
          <path d="M48 53 L152 38 L143 100 L39 114 Z" fill="#059669" />
          <path d="M52 57 L148 43 L141 93 L43 107 Z" fill="#10B981" />

          {/* Toothpaste Brand Label */}
          <rect x="70" y="55" width="60" height="35" rx="6" fill="#FFFFFF" transform="rotate(-7 100 72)" opacity="0.95" />
          <text x="76" y="70" fill="#047857" fontSize="8" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-7 100 72)">
            OralSense
          </text>
          <text x="76" y="80" fill="#059669" fontSize="6" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-7 100 72)">
            1450ppm Fluoride
          </text>

          {/* Screw Cap / Flip Top */}
          <rect x="30" y="65" width="16" height="30" rx="4" fill="#065F46" transform="rotate(-7 38 80)" />
          <rect x="25" y="70" width="8" height="20" rx="3" fill="#D1FAE5" transform="rotate(-7 29 80)" />

          {/* Fresh Mint Paste Swirl Ribbon */}
          <path d="M148 40 C165 30, 175 45, 185 35 C190 30, 180 20, 168 32" stroke="#A7F3D0" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M148 40 C165 30, 175 45, 185 35 C190 30, 180 20, 168 32" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>

        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-xs text-[9px] font-extrabold text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
          ENAMEL DEFENSE
        </div>
      </div>
    );
  }

  if (productId === 'prod-4') {
    return (
      <div className={`rounded-2xl bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 flex items-center justify-center p-3 relative overflow-hidden shadow-inner border border-rose-200/50 ${className}`}>
        <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl transform scale-75 pointer-events-none" />
        
        <svg className="w-full h-full max-h-36 drop-shadow-lg relative z-10" viewBox="0 0 200 140" fill="none">
          {/* Toddler Gel Tube */}
          <path d="M50 45 L150 40 L140 110 L40 115 Z" fill="#E11D48" />
          <path d="M53 48 L147 43 L138 106 L44 110 Z" fill="#F43F5E" />
          <path d="M58 53 L142 48 L134 100 L49 104 Z" fill="#FB7185" />

          {/* Gentle Label */}
          <rect x="68" y="55" width="64" height="38" rx="8" fill="#FFFFFF" transform="rotate(-3 100 74)" opacity="0.95" />
          <text x="74" y="70" fill="#BE123C" fontSize="8" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-3 100 74)">
            OralSense Kids
          </text>
          <text x="74" y="80" fill="#E11D48" fontSize="6" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-3 100 74)">
            Fluoride-Free Gel
          </text>
          
          {/* Wild Berry Graphic Accent */}
          <circle cx="118" cy="82" r="4" fill="#9F1239" transform="rotate(-3 100 74)" />
          <circle cx="123" cy="85" r="3" fill="#BE123C" transform="rotate(-3 100 74)" />

          {/* Cap */}
          <rect x="34" y="60" width="16" height="32" rx="5" fill="#881337" transform="rotate(-3 42 76)" />
          <rect x="28" y="66" width="8" height="20" rx="3" fill="#FFE4E6" transform="rotate(-3 32 76)" />

          {/* Translucent Berry Gel Swirl */}
          <path d="M142 45 Q160 30 178 40" stroke="#FDA4AF" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M142 45 Q160 30 178 40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>

        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-xs text-[9px] font-extrabold text-rose-900 px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
          SAFE 2-5Y GEL
        </div>
      </div>
    );
  }

  if (productId === 'prod-5') {
    return (
      <div className={`rounded-2xl bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 flex items-center justify-center p-3 relative overflow-hidden shadow-inner border border-amber-200/50 ${className}`}>
        <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl transform scale-75 pointer-events-none" />
        
        <svg className="w-full h-full max-h-36 drop-shadow-lg relative z-10" viewBox="0 0 200 140" fill="none">
          {/* Pack Box Frame */}
          <rect x="40" y="20" width="120" height="100" rx="12" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" opacity="0.9" />
          <rect x="44" y="24" width="112" height="92" rx="8" fill="#FEF3C7" opacity="0.6" />

          {/* Box Header Label */}
          <rect x="50" y="30" width="100" height="20" rx="5" fill="#D97706" />
          <text x="58" y="44" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
            OralSense Flossers (48 Pack)
          </text>

          {/* Flosser 1 (Turquoise) */}
          <g transform="translate(60, 58) scale(0.65)">
            <path d="M20 10 L20 60 Q20 65 25 65 Q30 65 30 60 L30 10 Z" fill="#06B6D4" />
            <path d="M10 0 Q15 20 20 22 L30 22 Q35 20 40 0 L32 0 Q28 15 25 15 Q22 15 18 0 Z" fill="#0891B2" />
            <line x1="12" y1="3" x2="38" y2="3" stroke="#FFFFFF" strokeWidth="3" />
          </g>

          {/* Flosser 2 (Bright Yellow) */}
          <g transform="translate(90, 62) scale(0.65)">
            <path d="M20 10 L20 60 Q20 65 25 65 Q30 65 30 60 L30 10 Z" fill="#F59E0B" />
            <path d="M10 0 Q15 20 20 22 L30 22 Q35 20 40 0 L32 0 Q28 15 25 15 Q22 15 18 0 Z" fill="#D97706" />
            <line x1="12" y1="3" x2="38" y2="3" stroke="#FFFFFF" strokeWidth="3" />
          </g>

          {/* Flosser 3 (Coral Pink) */}
          <g transform="translate(120, 58) scale(0.65)">
            <path d="M20 10 L20 60 Q20 65 25 65 Q30 65 30 60 L30 10 Z" fill="#F43F5E" />
            <path d="M10 0 Q15 20 20 22 L30 22 Q35 20 40 0 L32 0 Q28 15 25 15 Q22 15 18 0 Z" fill="#E11D48" />
            <line x1="12" y1="3" x2="38" y2="3" stroke="#FFFFFF" strokeWidth="3" />
          </g>
        </svg>

        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-xs text-[9px] font-extrabold text-amber-900 px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
          48 PACK FLOSS
        </div>
      </div>
    );
  }

  if (productId === 'prod-6') {
    return (
      <div className={`rounded-2xl bg-gradient-to-br from-violet-100 via-purple-50 to-violet-200 flex items-center justify-center p-3 relative overflow-hidden shadow-inner border border-violet-200/50 ${className}`}>
        <div className="absolute inset-0 bg-white/40 rounded-full blur-2xl transform scale-75 pointer-events-none" />
        
        <svg className="w-full h-full max-h-36 drop-shadow-lg relative z-10" viewBox="0 0 200 140" fill="none">
          {/* Blister Card Background */}
          <rect x="35" y="15" width="130" height="110" rx="10" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.9" />
          <rect x="40" y="20" width="120" height="100" rx="6" fill="#F5F3FF" />

          {/* Replacement Head 1 */}
          <g transform="translate(48, 30)">
            <rect x="8" y="25" width="10" height="40" rx="4" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1" />
            <rect x="5" y="12" width="16" height="14" rx="4" fill="#7C3AED" />
            <path d="M1 14 H6 M1 17 H6 M1 20 H6" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
            <circle cx="13" cy="60" r="3" fill="#38BDF8" />
          </g>

          {/* Replacement Head 2 */}
          <g transform="translate(76, 30)">
            <rect x="8" y="25" width="10" height="40" rx="4" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1" />
            <rect x="5" y="12" width="16" height="14" rx="4" fill="#7C3AED" />
            <path d="M1 14 H6 M1 17 H6 M1 20 H6" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
            <circle cx="13" cy="60" r="3" fill="#F43F5E" />
          </g>

          {/* Replacement Head 3 */}
          <g transform="translate(104, 30)">
            <rect x="8" y="25" width="10" height="40" rx="4" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1" />
            <rect x="5" y="12" width="16" height="14" rx="4" fill="#7C3AED" />
            <path d="M1 14 H6 M1 17 H6 M1 20 H6" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
            <circle cx="13" cy="60" r="3" fill="#10B981" />
          </g>

          {/* Replacement Head 4 */}
          <g transform="translate(132, 30)">
            <rect x="8" y="25" width="10" height="40" rx="4" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1" />
            <rect x="5" y="12" width="16" height="14" rx="4" fill="#7C3AED" />
            <path d="M1 14 H6 M1 17 H6 M1 20 H6" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
            <circle cx="13" cy="60" r="3" fill="#F59E0B" />
          </g>

          <text x="62" y="112" fill="#6D28D9" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
            Indicator Bristles • 4 Pack
          </text>
        </svg>

        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-xs text-[9px] font-extrabold text-violet-900 px-2 py-0.5 rounded-full border border-violet-200 shadow-2xs">
          4 PACK REFILLS
        </div>
      </div>
    );
  }

  // Fallbacks by category if productId is not prod-1..prod-6
  switch (category) {
    case "Children's Toothbrushes":
      return (
        <div className={`rounded-2xl bg-gradient-to-br from-cyan-100 via-sky-50 to-cyan-200 flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
          <svg className="w-24 h-24 text-cyan-600 drop-shadow-md" viewBox="0 0 100 100" fill="none">
            <rect x="44" y="35" width="12" height="55" rx="6" fill="#0891B2" />
            <rect x="46" y="55" width="8" height="25" rx="4" fill="#06B6D4" />
            <circle cx="50" cy="45" r="2" fill="#E0F2FE" />
            <circle cx="50" cy="52" r="2" fill="#E0F2FE" />
            <rect x="46" y="20" width="8" height="18" rx="3" fill="#0891B2" />
            <rect x="42" y="10" width="16" height="15" rx="4" fill="#0891B2" />
            <rect x="36" y="12" width="6" height="3" rx="1.5" fill="#38BDF8" />
            <rect x="36" y="16" width="6" height="3" rx="1.5" fill="#38BDF8" />
            <rect x="36" y="20" width="6" height="3" rx="1.5" fill="#38BDF8" />
          </svg>
        </div>
      );

    case 'Electric Toothbrushes':
      return (
        <div className={`rounded-2xl bg-gradient-to-br from-indigo-100 via-slate-50 to-blue-200 flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
          <svg className="w-24 h-24 text-indigo-700 drop-shadow-md" viewBox="0 0 100 100" fill="none">
            <rect x="42" y="30" width="16" height="60" rx="8" fill="#4338CA" />
            <circle cx="50" cy="55" r="4" fill="#818CF8" />
            <rect x="49" y="52" width="2" height="4" fill="#EEF2FF" />
            <rect x="42" y="30" width="16" height="4" fill="#94A3B8" />
            <rect x="47" y="15" width="6" height="18" fill="#CBD5E1" />
            <circle cx="50" cy="12" r="7" fill="#4338CA" />
            <circle cx="50" cy="12" r="4" fill="#60A5FA" />
          </svg>
        </div>
      );

    case 'Toothpaste':
      return (
        <div className={`rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
          <svg className="w-24 h-24 text-emerald-700 drop-shadow-md" viewBox="0 0 100 100" fill="none">
            <path d="M30 40 L70 40 L65 85 L35 85 Z" fill="#059669" />
            <path d="M32 50 L68 50 L66 60 L34 60 Z" fill="#34D399" />
            <rect x="42" y="25" width="16" height="15" rx="3" fill="#047857" />
            <rect x="44" y="18" width="12" height="7" rx="2" fill="#D1FAE5" />
          </svg>
        </div>
      );

    case 'Flossers':
      return (
        <div className={`rounded-2xl bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
          <svg className="w-24 h-24 text-amber-700 drop-shadow-md" viewBox="0 0 100 100" fill="none">
            <path d="M45 40 L45 85 Q45 90 50 90 Q55 90 55 85 L55 40 Z" fill="#D97706" />
            <path d="M35 20 Q40 38 45 40 L55 40 Q60 38 65 20 L58 18 Q53 32 50 32 Q47 32 42 18 Z" fill="#F59E0B" />
            <line x1="37" y1="22" x2="63" y2="22" stroke="#FEF3C7" strokeWidth="2.5" />
          </svg>
        </div>
      );

    case 'Replacement Brush Heads':
      return (
        <div className={`rounded-2xl bg-gradient-to-br from-violet-100 via-purple-50 to-violet-200 flex items-center justify-center p-4 relative overflow-hidden ${className}`}>
          <svg className="w-24 h-24 text-violet-700 drop-shadow-md" viewBox="0 0 100 100" fill="none">
            <rect x="30" y="35" width="10" height="45" rx="5" fill="#7C3AED" />
            <rect x="27" y="20" width="16" height="15" rx="4" fill="#7C3AED" />
            <rect x="60" y="35" width="10" height="45" rx="5" fill="#6D28D9" />
            <rect x="57" y="20" width="16" height="15" rx="4" fill="#6D28D9" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`rounded-2xl bg-slate-100 flex items-center justify-center p-4 ${className}`}>
          <div className="text-3xl">🪥</div>
        </div>
      );
  }
};

