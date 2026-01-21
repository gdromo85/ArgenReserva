import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SelectorOption } from '../types';

interface SelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectorOption[];
  placeholder?: string;
  disabled?: boolean;
}

export const Selector: React.FC<SelectorProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Seleccionar opción",
  disabled = false
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${disabled ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors duration-200"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      </div>
    </div>
  );
};