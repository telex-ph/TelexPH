import React from 'react';
import { COLORS } from "@/constant/styles";

type FeatureCardProps = {
  feature: {
    id: number;
    title: string;
    description: string;
    icon: string;
    hasRedDot?: boolean;
  };
};

const getIconSVG = (iconName: string) => {
  const ICON_CLASS = `w-8 h-8 text-[${COLORS.primary}]`; 
  
  switch (iconName) {
    case 'layers':
      return (
        <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      );
    case 'building':
      return (
        <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M3 9h18"/>
          <path d="M9 21V9"/>
        </svg>
      );
    case 'wrench':
      return (
        <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      );
    case 'shield':
      return (
        <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      );
    case 'network':
      return (
        <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="18" r="3"/>
          <circle cx="6" cy="6" r="3"/>
          <circle cx="18" cy="6" r="3"/>
          <path d="M8.59 13.51l6.83 3.98"/>
          <path d="M15.41 6.51l-6.82 3.98"/>
        </svg>
      );
    case 'leaf':
      return (
        <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
      );
    default:
      return (
        <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      );
  }
};

const FeatureCard = ({ feature }: FeatureCardProps) => {
  const BG_COLOR = COLORS.primaryLight;
  const BORDER_COLOR = COLORS.primaryLightBorder;

  return (
    <div className="bg-white p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
      {feature.hasRedDot && (
        <div className={`absolute top-4 right-4 w-3 h-3 bg-[${COLORS.primary}] rounded-full`}></div>
      )}
      <div className="flex items-start gap-4">
        <div 
          className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border-2`}
          style={{ 
            backgroundColor: BG_COLOR, 
            borderColor: BORDER_COLOR,
          }}
        >
          {getIconSVG(feature.icon)}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;