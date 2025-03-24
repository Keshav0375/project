// InvertedIndexTable.tsx
import React from 'react';
import type { InvertedIndexItem } from '../../types'; // Ensure that your types file is updated accordingly

interface Props {
  data: InvertedIndexItem[];
}

export function InvertedIndexTable({ data }: Props) {
  // Here we assume we want to sort by frequency (descending) by default.
  const sortedData = [...data].sort((a, b) => b.frequency - a.frequency);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2 px-4 text-left">Frequency</th>
            <th className="py-2 px-4 text-left">Positions</th>
            <th className="py-2 px-4 text-left">URL</th>
          </tr>
        </thead>
        <tbody>
        {sortedData.slice(0, 5).map((item, index) => (
            <tr key={index} className="border-b border-gray-800">
              {/* Display frequency */}
              <td className="py-2 px-4 text-gray-300">{item.frequency}</td>
              
              {/* Display up to three positions */}
              <td className="py-2 px-4 text-gray-300">
                {item.positionList.slice(0, 3).join(', ')}
                {item.positionList.length > 3 ? '...' : ''}
              </td>
              
              {/* Display URL as a clickable link */}
              <td className="py-2 px-4">
                <a
                  href={item.url}
                  className="text-[#cc73f8] hover:text-[#2ECC71] text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {new URL(item.url).pathname}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
