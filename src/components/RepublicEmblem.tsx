import React from 'react';

export const RepublicEmblem: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Armas Nacionais da República Federativa do Brasil"
    >
      {/* Background Star Points */}
      <polygon
        points="50,5 61,35 95,35 68,54 78,85 50,67 22,85 32,54 5,35 39,35"
        fill="#002776"
        stroke="#FFCC29"
        strokeWidth="1.5"
      />
      {/* Inner Green Star */}
      <polygon
        points="50,15 58,38 82,38 63,52 70,75 50,61 30,75 37,52 18,38 42,38"
        fill="#009B3A"
        stroke="#FFCC29"
        strokeWidth="1"
      />
      {/* Central Blue Circle */}
      <circle cx="50" cy="50" r="18" fill="#002776" stroke="#FFFFFF" strokeWidth="1" />
      {/* Southern Cross constellation (Cruzeiro do Sul) */}
      <circle cx="50" cy="40" r="1.5" fill="#FFFFFF" />
      <circle cx="50" cy="60" r="1.5" fill="#FFFFFF" />
      <circle cx="42" cy="49" r="1.5" fill="#FFFFFF" />
      <circle cx="58" cy="49" r="1.5" fill="#FFFFFF" />
      <circle cx="54" cy="54" r="1" fill="#FFFFFF" />
      {/* Surrounding 27 stars ring */}
      <circle cx="50" cy="50" r="15" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="1.5 2" />
      {/* Wreath branches (Coffee and Tobacco leaves stylization) */}
      <path
        d="M20 70 C 10 50, 15 25, 35 15"
        stroke="#009B3A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M80 70 C 90 50, 85 25, 65 15"
        stroke="#009B3A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Bottom Ribbon / Sword Hilt */}
      <rect x="25" y="82" width="50" height="7" rx="1.5" fill="#002776" stroke="#FFCC29" strokeWidth="1" />
      <text
        x="50"
        y="87"
        textAnchor="middle"
        fontSize="3.8"
        fill="#FFFFFF"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        REPÚBLICA FEDERATIVA DO BRASIL
      </text>
      <text
        x="50"
        y="94"
        textAnchor="middle"
        fontSize="3.2"
        fill="#1e293b"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        15 de Novembro de 1889
      </text>
    </svg>
  );
};
