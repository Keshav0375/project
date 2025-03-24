import React from 'react';

interface PageRankItem {
  word: string;
  frequency: number;
  urlLink: string;
}

interface Props {
  data: PageRankItem[];
}

export function PageRankDisplay({ data }: Props) {
  // Only display the top 5 items
  const topItems = data.slice(0, 5);

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">
        Search for courses to see page rank data.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topItems.map((item, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <a 
              href={item.urlLink}
              className="text-[#cc73f8] hover:text-[#2ECC71] font-semibold max-w-[70%] truncate"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.word}
            </a>
            <div className="flex items-center space-x-1 min-w-fit">
              <span className="text-white">{item.frequency}</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm truncate">{item.urlLink}</p>
        </div>
      ))}
    </div>
  );
}
