import React from 'react';
import { ChipData } from '../types';

interface ChipProps {
  chip: ChipData;
  onDragStart: (chip: ChipData) => void;
  onDragEnd: () => void;
  isUsed?: boolean;
}

const chipColors = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  pink: 'bg-pink-100 text-pink-800 border-pink-200',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

export const Chip: React.FC<ChipProps> = ({
  chip,
  onDragStart,
  onDragEnd,
  isUsed = false
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(chip);
  };

  return (
    <div
      draggable={!isUsed}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`
        inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border cursor-move
        hover:shadow-md transition-all duration-200 transform hover:scale-105
        ${chipColors[chip.color]}
        ${isUsed ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
      `}
    >
      {chip.label}
    </div>
  );
};