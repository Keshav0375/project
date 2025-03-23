export interface Course {
  id?: number;
  title: string;
  description: string;
  image?: string;
  price: number | string;
  rating: number | string;
  platform: string;
  url?: string;
}

export interface SearchSuggestion {
  text: string;
  category: string;
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

// Analysis data types
export interface WordFrequency {
  text: string;
  value: number;
}

export interface IndexEntry {
  term: string;
  courses: string[];
}

export interface PageRankItem {
  title: string;
  rank: number;
  platform: string;
}

// API response types
export interface ApiResponse {
  success: boolean;
  message: string;
  coursesByPlatform: Record<string, ApiCourse[]>;
  courses: null | ApiCourse[];
  totalCourses: number;
  executionTimeMs: number;
}

export interface ApiCourse {
  title: string;
  description: string;
  url: string;
  price: string;
  rating: number;
  platform: string;
}