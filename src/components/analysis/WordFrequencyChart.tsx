// In WordFrequencyChart.tsx
import React from 'react';
import type { WordFrequency } from '../../types';

interface Props {
  data: WordFrequency[];
}

export function WordFrequencyChart({ data }: Props) {
  const maxCount = Math.max(...data.map(item => item.value));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-200">{item.text}</span>
            <span className="text-gray-400">
              {item.value} ({( (item.value / maxCount) * 100 ).toFixed(1)}%)
            </span>
          </div>
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-[#cc73f8] rounded-full transition-all duration-500"
              style={{ width: `${(item.value / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}