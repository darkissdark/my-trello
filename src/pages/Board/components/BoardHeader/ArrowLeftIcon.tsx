import React from 'react';

interface ArrowLeftIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({
  width = 38,
  height = 38,
  className = 'bi bi-arrow-left',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="currentColor"
      className={className}
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M15 8a.5.5 0 0 1-.5.5H3.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 0 1 .708.708L3.707 7.5H14.5a.5.5 0 0 1 .5.5z"
      />
    </svg>
  );
};
