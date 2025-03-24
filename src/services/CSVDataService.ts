import { Course } from '../types';
import { Trie } from '../utils/trie';

import Papa from 'papaparse'; 

interface CSVCourse {
  title: string;
  description: string;
  url: string;
  price: string;
  ratings: string;
  platform: string;
  html_text: string;
}

class CSVDataService {
  private courses: CSVCourse[] = [];
  private trie: Trie = new Trie();
  private isLoaded: boolean = false;
  private isLoading: boolean = false;

  /**
   * Initialize the service by loading CSV data
   */
  async init(forceReload: boolean = false): Promise<void> {
    if (this.isLoaded && !forceReload) return;
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      await this.loadCSVData();
      this.buildTrie();
      this.isLoaded = true;
      console.log('CSV Data Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize CSV data service:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load course data from CSV file
   */
  private async loadCSVData(): Promise<void> {
    try {
      const response = await fetch('/scraped_courses.csv');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      if (!csvText || csvText.trim().length === 0) {
        throw new Error('CSV file is empty');
      }
      
      const result = Papa.parse<CSVCourse>(csvText, {
        header: true,
        skipEmptyLines: true
      });
      
      if (result.errors && result.errors.length > 0) {
        console.warn('CSV parsing had errors:', result.errors);
      }
      
      this.courses = result.data.filter(course => course.title && course.title.trim().length > 0);
      console.log(`Loaded ${this.courses.length} courses from CSV`);
    } catch (error) {
      console.error('Error loading CSV data:', error);
      throw error;
    }
  }

  /**
   * Build the Trie data structure from course titles
   */
  private buildTrie(): void {
    this.trie = new Trie(); // Reset trie before rebuilding
    for (const course of this.courses) {
      if (course.title && course.title.trim()) {
        this.trie.insert(course.title);
      }
    }
    console.log(`Trie built with ${this.courses.length} course titles`);
  }

  /**
   * Get title completions for a given prefix
   * @param prefix - Search prefix
   * @param limit - Maximum number of completions to return
   */
  getTitleCompletions(prefix: string, limit: number = 5): string[] {
    if (!this.isLoaded) {
      console.warn('CSV data not loaded yet');
      return [];
    }
    return this.trie.findCompletions(prefix, limit);
  }

  /**
 * Search for courses by title and filter by platform
 * @param query - Search query
 * @param limit - Maximum total number of results to return
 * @returns Array of courses matching the query
 */
searchCourses(query: string, limit: number = 25): Course[] {
  if (!this.isLoaded) {
    console.warn('CSV data not loaded yet, attempting to initialize');
    // Try to initialize if not loaded
    this.init().catch(err => console.error('Failed to initialize on demand:', err));
    return [];
  }
  
  if (!query || query.trim().length === 0) {
    console.warn('Empty search query');
    return [];
  }
  
  console.log(`Searching for "${query}" among ${this.courses.length} courses`);

  const platforms = ['edx', 'StanfordOnline', 'KhanAcademy', 'Coursera', 'roadmap-sh'];
  const resultsPerPlatform = Math.ceil(limit / platforms.length);
  const queryLower = query.toLowerCase().trim();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  
  const results: Course[] = [];
  const platformCounts: Record<string, number> = {};
  
  // Initialize platform counts
  platforms.forEach(platform => {
    platformCounts[platform] = 0;
  });

  // Process all courses
  this.courses.forEach(csvCourse => {
    if (!csvCourse.title || results.length >= limit) return;
    
    const platform = this.normalizePlatform(csvCourse.platform);
    
    // Skip if we've already reached the limit for this platform
    if (!platforms.includes(platform) || platformCounts[platform] >= resultsPerPlatform) {
      return;
    }
    
    const titleLower = csvCourse.title.toLowerCase();
    const titleWords = titleLower.split(/\s+/);
    
    // Check if any query word matches any title word
    const hasMatch = queryWords.some(queryWord => 
      titleWords.some(titleWord => titleWord.includes(queryWord) || queryWord.includes(titleWord))
    );
    
    // Alternative: check if the full title contains the query
    const containsFullQuery = titleLower.includes(queryLower);
    
    if (hasMatch || containsFullQuery) {
      results.push(this.convertToCourse(csvCourse));
      platformCounts[platform]++;
    }
  });

  console.log(`Found ${results.length} matching courses for "${query}"`);
  return results;
}

  /**
   * Convert CSV course data to application Course format
   */
  private convertToCourse(csvCourse: CSVCourse): Course {
    // Process price to handle various formats
    let processedPrice: number | string = "Free";
    if (csvCourse.price) {
      // Remove dollar signs and other currency symbols
      const priceString = csvCourse.price.replace(/[^\d.]/g, '');
      const parsedPrice = parseFloat(priceString);
      if (!isNaN(parsedPrice)) {
        processedPrice = parsedPrice;
      } else {
        processedPrice = csvCourse.price;
      }
    }
    
    return {
      title: csvCourse.title,
      description: csvCourse.description || "No description available",
      url: csvCourse.url || "#",
      price: processedPrice,
      rating: parseFloat(csvCourse.ratings) || 4.0,
      platform: this.normalizePlatform(csvCourse.platform)
    };
  }

  /**
   * Normalize platform names for consistency
   */
  private normalizePlatform(platform: string): string {
    if (!platform) return "Unknown";
    
    const platformMap: Record<string, string> = {
      'edx': 'edx',
      'EDx': 'edx',
      'EDX': 'edx',
      'coursera': 'Coursera',
      'Coursera': 'Coursera',
      'khan-academy': 'KhanAcademy',
      'khan academy': 'KhanAcademy',
      'KhanAcademy': 'KhanAcademy',
      'Khan Academy': 'KhanAcademy',
      'stanford': 'StanfordOnline',
      'StanfordOnline': 'StanfordOnline',
      'Stanford': 'StanfordOnline',
      'roadmap-sh': 'roadmap-sh',
      'roadmap.sh': 'roadmap-sh',
      'Roadmap.sh': 'roadmap-sh'
    };

    return platformMap[platform] || platform;
  }
  
  /**
   * Get title suggestions that contain the query string
   * @param query - Search query
   * @param limit - Maximum number of suggestions to return
   */
  getTitleSuggestions(query: string, limit: number = 3): string[] {
    if (!this.isLoaded) {
      console.warn('CSV data not loaded yet');
      return [];
    }
    
    if (!query || query.trim().length === 0) return [];
    
    const queryLower = query.toLowerCase().trim();
    const matches: string[] = [];
    
    // Find all titles that contain the query string
    for (const course of this.courses) {
      if (matches.length >= limit) break;
      
      if (course.title && course.title.toLowerCase().includes(queryLower)) {
        // Avoid duplicates
        if (!matches.includes(course.title)) {
          matches.push(course.title);
        }
      }
    }
    
    return matches;
  }

  /**
   * Find a possible spelling suggestion for a word
   * @param word - The word to find suggestions for
   * @returns The best matching word or null if none found
   */
  findSpellingSuggestion(word: string): string | null {
    if (!this.isLoaded || !word || word.length < 3) {
      return null;
    }
    
    // Collect all unique words from course titles
    const allWords = new Set<string>();
    this.courses.forEach(course => {
      if (course.title) {
        course.title.split(/\s+/).forEach(w => {
          if (w.length > 3) allWords.add(w.toLowerCase());
        });
      }
    });
    
    // Find the closest match
    const wordLower = word.toLowerCase();
    let bestMatch: string | null = null;
    let bestScore = Infinity;
    
    allWords.forEach(dictWord => {
      if (dictWord === wordLower) return; // Skip exact matches
      
      const score = this.levenshteinDistance(wordLower, dictWord);
      if (score < bestScore && score <= 2) { // Within 2 edits
        bestScore = score;
        bestMatch = dictWord;
      }
    });
    
    return bestMatch;
  }

  /**
   * Calculate Levenshtein distance between two strings
   * @param a - First string
   * @param b - Second string
   * @returns Distance value
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    
    // Initialize matrix
    for (let i = 0; i <= a.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
    
    return matrix[a.length][b.length];
  }

  /**
   * Check if data is loaded
   * @returns True if data is loaded, false otherwise
   */
  isDataLoaded(): boolean {
    return this.isLoaded;
  }
}

const csvDataService = new CSVDataService();
export default csvDataService;