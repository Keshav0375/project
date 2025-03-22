import type { WordFrequency, InvertedIndex, PageRank } from '../types';

export const wordFrequencyData: WordFrequency[] = [
  { word: "machine", count: 156, percentage: 12.4 },
  { word: "learning", count: 142, percentage: 11.3 },
  { word: "development", count: 128, percentage: 10.2 },
  { word: "programming", count: 115, percentage: 9.1 },
  { word: "data", count: 98, percentage: 7.8 }
];

export const invertedIndexData: InvertedIndex[] = [
  {
    word: "machine",
    frequency: 156,
    urls: [
      "https://example.com/courses/machine-learning",
      "https://example.com/courses/ai-basics",
      "https://example.com/courses/deep-learning"
    ]
  },
  {
    word: "learning",
    frequency: 142,
    urls: [
      "https://example.com/courses/machine-learning",
      "https://example.com/courses/deep-learning",
      "https://example.com/courses/reinforcement-learning"
    ]
  },
  {
    word: "development",
    frequency: 128,
    urls: [
      "https://example.com/courses/web-development",
      "https://example.com/courses/mobile-development",
      "https://example.com/courses/software-engineering"
    ]
  }
];

export const pageRankData: PageRank[] = [
  {
    url: "https://example.com/courses/machine-learning",
    rank: 4.5,
    description: "Comprehensive machine learning course with practical applications"
  },
  {
    url: "https://example.com/courses/web-development",
    rank: 4.5,
    description: "Full-stack web development bootcamp"
  },
  {
    url: "https://example.com/courses/data-science",
    rank: 4.6,
    description: "Data science and analytics fundamentals"
  },
  {
    url: "https://example.com/courses/ai-basics",
    rank: 4.5,
    description: "Introduction to artificial intelligence"
  },
  {
    url: "https://example.com/courses/python-programming",
    rank: 4.4,
    description: "Python programming from basics to advanced"
  }
];