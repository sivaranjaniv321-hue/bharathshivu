import React from 'react';

interface VegIndicatorProps {
  isVeg: boolean;
  showLabel?: boolean;
}

export const VegIndicator: React.FC<VegIndicatorProps> = ({ isVeg, showLabel = false }) => {
  const borderColor = isVeg ? 'border-[#1E6B3A]' : 'border-[#8C1D2D]';
  const fillColor = isVeg ? 'bg-[#1E6B3A]' : 'bg-[#8C1D2D]';
  const labelText = isVeg ? 'Vegetarian' : 'Non-Vegetarian';

  return (
    <span className="inline-flex items-center gap-1.5 shrink-0" title={labelText}>
      <span
        className={`inline-flex items-center justify-center w-4 h-4 border-[1.5px] rounded-[3px] ${borderColor} bg-white`}
        aria-hidden="true"
      >
        {isVeg ? (
          <span className={`w-2 h-2 rounded-full ${fillColor}`} />
        ) : (
          <span
            className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-[#8C1D2D]"
          />
        )}
      </span>
      {showLabel ? (
        <span className={`text-xs font-medium ${isVeg ? 'text-[#1E6B3A]' : 'text-[#8C1D2D]'}`}>
          {labelText}
        </span>
      ) : (
        <span className="sr-only">{labelText}</span>
      )}
    </span>
  );
};
