import React from 'react';
import type { PageRank } from '../../types';
import { Star, StarHalf } from 'lucide-react';

interface Props {
  data: PageRank[];
}

export function PageRankDisplay({ data }: Props) {
  const renderStars = (rank: number) => {
    const displayRank = Math.min(rank, 5);
    const stars = [];
    const fullStars = Math.floor(displayRank);
    const hasHalfStar = displayRank % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-5 h-5 text-yellow-400 fill-current" />);
    }

    return stars;
  };

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <a 
              href={item.url}
              className="text-[#cc73f8] hover:text-[#2ECC71] font-semibold max-w-[70%] truncate"
              target="_blank"
              rel="noopener noreferrer"
            >
              {new URL(item.url).pathname}
            </a>
            <div className="flex items-center space-x-1 min-w-fit">
              {renderStars(item.rank)}
            </div>
          </div>
          <p className="text-gray-400 text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );
}