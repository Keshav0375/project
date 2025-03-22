import React, { useState } from 'react';
import type { InvertedIndex } from '../../types';
import { ArrowUpDown } from 'lucide-react';

interface Props {
  data: InvertedIndex[];
}

export function InvertedIndexTable({ data }: Props) {
  const [sortField, setSortField] = useState<'word' | 'frequency'>('frequency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...data].sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    return a[sortField] > b[sortField] ? modifier : -modifier;
  });

  const toggleSort = (field: 'word' | 'frequency') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2 px-4 text-left">
              <button 
                className="flex items-center text-gray-200 hover:text-white"
                onClick={() => toggleSort('word')}
              >
                Word <ArrowUpDown size={16} className="ml-1" />
              </button>
            </th>
            <th className="py-2 px-4 text-left">
              <button 
                className="flex items-center text-gray-200 hover:text-white"
                onClick={() => toggleSort('frequency')}
              >
                Frequency <ArrowUpDown size={16} className="ml-1" />
              </button>
            </th>
            <th className="py-2 px-4 text-left text-gray-200">URLs</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index} className="border-b border-gray-800">
              <td className="py-2 px-4 text-gray-300">{item.word}</td>
              <td className="py-2 px-4 text-gray-300">{item.frequency}</td>
              <td className="py-2 px-4">
                <div className="flex flex-wrap gap-2">
                  {item.urls.map((url, urlIndex) => (
                    <a
                      key={urlIndex}
                      href={url}
                      className="text-[#cc73f8] hover:text-[#2ECC71] text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {new URL(url).pathname}
                    </a>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}