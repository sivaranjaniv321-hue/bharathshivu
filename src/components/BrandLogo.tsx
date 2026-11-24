import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'dark', onClick }) => {
  const titleColor = variant === 'light' ? 'text-[#FAF6EF]' : 'text-[#6B1826]';
  const ringStroke = variant === 'light' ? '#E5B53B' : '#6B1826';
  const innerFill = variant === 'light' ? '#6B1826' : '#FAF6EF';
  const accentGold = '#D4A017';

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] rounded-md cursor-pointer"
      aria-label="Bharath Delights Home"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        {/* Heritage circular temple medallion */}
        <circle cx="24" cy="24" r="22" fill={innerFill} stroke={ringStroke} strokeWidth="2" />
        <circle cx="24" cy="24" r="18.5" stroke={accentGold} strokeWidth="1" strokeDasharray="2 2" />
        {/* Stylized Banana Leaf Bowl / Arch */}
        <path
          d="M12 28C12 33.5 17.4 37.5 24 37.5C30.6 37.5 36 33.5 36 28C32 30.2 28.2 31.2 24 31.2C19.8 31.2 16 30.2 12 28Z"
          fill="#2D6A4F"
        />
        {/* Traditional Brass Lamp / Deepam Flame */}
        <path
          d="M24 10C24 10 27.5 14.2 27.5 17C27.5 18.9 25.9 20.5 24 20.5C22.1 20.5 20.5 18.9 20.5 17C20.5 14.2 24 10 24 10Z"
          fill={accentGold}
        />
        {/* Brass Bowl Rim */}
        <path
          d="M16.5 22.5H31.5C30.8 26.2 27.8 28.5 24 28.5C20.2 28.5 17.2 26.2 16.5 22.5Z"
          fill={ringStroke}
        />
        <line x1="15" y1="22.5" x2="33" y2="22.5" stroke={accentGold} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className={`font-display text-xl sm:text-2xl font-bold tracking-tight ${titleColor}`}>
        Bharath Delights
      </span>
    </button>
  );
};
