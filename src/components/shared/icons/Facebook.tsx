import React from "react";

interface Props {
  className?: string;
}

const Facebook: React.FC<Props> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        // d="M14.5 8.5H12.5C11.3954 8.5 10.5 9.39543 10.5 10.5V12.5H8.5V14.5H10.5V18.5H12.5V14.5H14.5L15 12.5H12.5V10.5C12.5 9.98122 12.6186 9.48857 12.8315 9.05025C13.0444 8.61193 13.345 8.23744 13.6967 7.95632C14.0484 7.6752 14.4395 7.5 14.85 7.5H16.5V8.5Z"
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
        fill="white"
      />
    </svg>
  );
};

export default Facebook;
