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
      const csvText = await response.text();
      
      const result = Papa.parse<CSVCourse>(csvText, {
        header: true,
        skipEmptyLines: true
      });
      
      this.courses = result.data;
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
    for (const course of this.courses) {
      if (course.title) {
        this.trie.insert(course.title);
      }
    }
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
      console.warn('CSV data not loaded yet');
      return [];
    }

    const platforms = ['edx', 'StanfordOnline', 'KhanAcademy', 'Coursera', 'roadmap-sh'];
    const resultsPerPlatform = Math.ceil(limit / platforms.length);
    const queryLower = query.toLowerCase();
    
    const results: Course[] = [];
    const platformCounts: Record<string, number> = {};
    
    // Initialize platform counts
    platforms.forEach(platform => {
      platformCounts[platform] = 0;
    });

    // First pass - add exact matches by platform
    this.courses.forEach(csvCourse => {
      const platform = this.normalizePlatform(csvCourse.platform);
      
      if (platforms.includes(platform) && 
          platformCounts[platform] < resultsPerPlatform && 
          csvCourse.title.toLowerCase().includes(queryLower)) {
        
        results.push(this.convertToCourse(csvCourse));
        platformCounts[platform]++;
      }
    });

    // If we have less than the limit, add more results
    if (results.length < limit) {
      this.courses.forEach(csvCourse => {
        const platform = this.normalizePlatform(csvCourse.platform);
        
        if (platforms.includes(platform) && 
            platformCounts[platform] < resultsPerPlatform && 
            !results.some(r => r.title === csvCourse.title)) {
          
          // Check for any word match in title
          const titleWords = csvCourse.title.toLowerCase().split(/\s+/);
          const queryWords = queryLower.split(/\s+/);
          
          if (queryWords.some(qWord => titleWords.some(tWord => tWord.includes(qWord)))) {
            results.push(this.convertToCourse(csvCourse));
            platformCounts[platform]++;
          }
        }
      });
    }

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
      description: csvCourse.description,
      url: csvCourse.url,
      price: processedPrice,
      rating: parseFloat(csvCourse.ratings) || 4.0,
      platform: this.normalizePlatform(csvCourse.platform)
    };
  }

  /**
   * Normalize platform names for consistency
   */
  private normalizePlatform(platform: string): string {
    const platformMap: Record<string, string> = {
      'edx': 'edx',
      'EDx': 'edx',
      'coursera': 'Coursera',
      'Coursera': 'Coursera',
      'khan-academy': 'KhanAcademy',
      'khan academy': 'KhanAcademy',
      'KhanAcademy': 'KhanAcademy',
      'stanford': 'StanfordOnline',
      'StanfordOnline': 'StanfordOnline',
      'Stanford': 'StanfordOnline',
      'roadmap-sh': 'roadmap-sh',
      'roadmap.sh': 'roadmap-sh',
      'Roadmap.sh': 'roadmap-sh'
    };

    return platformMap[platform] || platform;
  }
}

// Create a singleton instance
const csvDataService = new CSVDataService();
export default csvDataService;