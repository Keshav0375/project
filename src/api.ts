import type { Course, ApiResponse, ApiCourse, FrequencyResponse } from './types';

/**
 * API service for EduMetrics
 * Contains functions for interacting with the backend API
 */

/**
 * Fetches course data from the EduMetrics API
 * @param query - Search query string
 * @param limit - Maximum number of results to return
 * @param saveToCSV - Whether to save results to CSV file on the server
 * @returns Promise containing fetched course data
 */
export const fetchCourses = async (
  query: string,
  limit: number = 5,
  saveToCSV: boolean = true
): Promise<Course[]> => {
  try {
    // Construct the API URL
    const apiUrl = `http://localhost:8080/api/courses/scrape-edumetrics?query=${query}&limit=${limit}&saveToCSV=${saveToCSV}`;

    // Debugging: Log the constructed API URL
    console.log('Attempting to fetch from URL:', apiUrl);

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // You might need this, depending on your backend
        },
        // If your backend expects a body, even with a GET-like URL, you can include an empty body
        body: JSON.stringify({}) 
      });

    // Debugging: Log the response status
    console.log('Response status:', response.status);

    // Check if the response is successful
    if (!response.ok) {
      // Debugging: Log the error response body
      const errorBody = await response.text();
      console.error('API error response body:', errorBody);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    // Parse the JSON response
    const data: ApiResponse = await response.json();

    // Process the returned data to match our Course type
    let courses: Course[] = [];

    if (data.success) {
      if (data.courses && Array.isArray(data.courses)) {
        courses = processCourses(data.courses);
      } else if (data.coursesByPlatform) {
        Object.entries(data.coursesByPlatform).forEach(([platform, platformCourses]) => {
          const processed = processCourses(platformCourses, platform);
          courses.push(...processed);
        });
      }
    } else {
      console.error('API returned unsuccessful response:', data.message);
    }

    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Return an empty array in case of error
    return [];
  }
};

/**
 * Process raw API courses into the application's Course format.
 * The id field is preserved if present, as defined in your types.
 */
function processCourses(apiCourses: ApiCourse[], defaultPlatform?: string): Course[] {
  return apiCourses.map((course) => {
    // Process price to handle various formats
    let processedPrice: number | string = "Free";
    if (course.price) {
      // Remove dollar signs and other currency symbols
      const priceString = course.price.replace(/[^\d.]/g, '');
      const parsedPrice = parseFloat(priceString);
      if (!isNaN(parsedPrice)) {
        processedPrice = parsedPrice;
      } else {
        processedPrice = course.price;
      }
    }
    
    return {
      title: course.title,
      description: course.description,
      url: course.url,
      price: processedPrice,
      rating: course.rating || 4.0,
      platform: course.platform || defaultPlatform || "Unknown"
    };
  });
}

export interface PageRankResponse {
  statusCode: number;
  message: string;
  data: [];
}

export async function fetchPageRank(searchWord: string): Promise<PageRankResponse> {
  try {
    const response = await fetch(`http://localhost:8080/api/courses/getPageRank?searchWord=${encodeURIComponent(searchWord)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching page rank data:", error);
    throw error;
  }
}

// api.ts

export interface InvertedIndexItem {
  url: string;
  frequency: number;
  positionList: number[];
}

export interface InvertedIndexResponse {
  statusCode: number;
  message: string;
  data: InvertedIndexItem[];
}

export async function fetchInvertedIndex(searchWord: string): Promise<InvertedIndexResponse> {
  try {
    const response = await fetch(`http://localhost:8080/api/courses/getInvertedIndex?searchWord=${encodeURIComponent(searchWord)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: InvertedIndexResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching inverted index data:", error);
    throw error;
  }
}


export async function fetchFrequencyCount(searchWord: string): Promise<FrequencyResponse> {
  try {
    const response = await fetch(`http://localhost:8080/api/courses/getFrequencyCount?keyword=${encodeURIComponent(searchWord)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: FrequencyResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching frequency count data:", error);
    throw error;
  }
}
