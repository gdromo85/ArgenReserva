import React from 'react';
import { Chip } from './Chip';
import { ChipData } from '../types';

interface ChipContainerProps {
  chips: ChipData[];
  usedChips: Set<string>;
  onDragStart: (chip: ChipData) => void;
  onDragEnd: () => void;
}

export const ChipContainer: React.FC<ChipContainerProps> = ({
  chips,
  usedChips,
  onDragStart,
  onDragEnd
}) => {
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Campos disponibles
      </h3>
      <div className="space-y-3">
        {chips.map((chip) => (
          !usedChips.has(chip.id) && <div key={chip.id} className="flex">
            <Chip
              chip={chip}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isUsed={usedChips.has(chip.id)}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        Arrastra los campos a las columnas de la tabla para mapear los datos
      </div>
    </div>
  );
};