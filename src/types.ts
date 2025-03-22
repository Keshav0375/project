export interface Course {
  id: number;
  title: string;
  description: string;
  rating: number;
  price: number;
  image: string;
  platform: 'edx' | 'coursera' | 'khan-academy' | 'stanford' | 'roadmap-sh';
}

export interface TeamMember {
  name: string;
  role: string;
  github: string;
  linkedin: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface SearchSuggestion {
  text: string;
  category: string;
}

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface InvertedIndex {
  word: string;
  frequency: number;
  urls: string[];
}

export interface PageRank {
  url: string;
  rank: number;
  description: string;
}