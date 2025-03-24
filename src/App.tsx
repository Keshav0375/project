import React, { useState, useEffect } from 'react';
import { Search, Menu, Star, X, BarChart2, Network, TrendingUp, Loader, Download } from 'lucide-react';
import type { SearchSuggestion, Course, InvertedIndexItem } from './types';
import { teamMembers, features } from './data';
import { fetchCourses, fetchPageRank, fetchInvertedIndex} from './api'; 
import { WordFrequencyChart } from './components/analysis/WordFrequencyChart';
import { InvertedIndexTable } from './components/analysis/InvertedIndexTable';
import { PageRankDisplay } from './components/analysis/PageRankDisplay';
import { wordFrequencyData } from './data/analysisData';
import csvDataService from './services/CSVDataService';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spellCheckSuggestion, setSpellCheckSuggestion] = useState<string | null>(null);
  const [toast, setToast] = useState<{message: string, visible: boolean}>({
    message: '',
    visible: false
  });
  const [pageRankData, setPageRankData] = useState([]);
  const [invertedIndexData, setInvertedIndexData] = useState<InvertedIndexItem[]>([]);
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [feedbackError, setFeedbackError] = useState('');
  const fullText = "Find Your Perfect Course";

  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'edx', name: 'EDx' },
    { id: 'Coursera', name: 'Coursera' },
    { id: 'KhanAcademy', name: 'Khan Academy' },
    { id: 'StanfordOnline', name: 'Stanford Education' },
    { id: 'roadmap-sh', name: 'Roadmap.sh' }
  ];

  // Load CSV data when component mounts
  useEffect(() => {
    const loadData = async () => {
      await csvDataService.init();
    };
    
    loadData();
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    let interval: ReturnType<typeof setInterval>;

    const typeText = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          currentIndex = 0;
          interval = setInterval(typeText, 70);
        }, 2000);
      }
    };

    interval = setInterval(typeText, 70);
    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000); // Hide after 3 seconds
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const validateFeedback = () => {
    const { name, email, mobile, message } = feedback;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const mobileRegex = /^(\+1[-.\s]?)?(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}$/;
  
    if (!name || !nameRegex.test(name)) {
      return "Please enter a valid name (letters and spaces only).";
    }
    if (!email || !emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!mobile || !mobileRegex.test(mobile)) {
      return "Please enter a valid Canadian mobile number (e.g., +1 613-957-2991).";
    }
    if (!message.trim()) {
      return "Please enter a message.";
    }
    return "";
  };
  
  // Handle form submission:
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateFeedback();
    if (errorMsg) {
      setFeedbackError(errorMsg);
      return;
    }
    setFeedbackError('');
    
    // Prepare the new feedback entry
    const newEntry = `Name: ${feedback.name}\nEmail: ${feedback.email}\nMobile: ${feedback.mobile}\nMessage: ${feedback.message}\n----------------------\n`;
    
    // Retrieve any previously saved feedback from localStorage
    const existingFeedback = localStorage.getItem("feedbackTxt") || "";
    const updatedFeedback = existingFeedback + newEntry;
    localStorage.setItem("feedbackTxt", updatedFeedback);
    
    // Create a text file Blob from the updated feedback
    const blob = new Blob([updatedFeedback], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // Set the filename. This will re-download a new file each submission.
    link.download = "feedback.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Clear the form fields and show a toast message
    setFeedback({
      name: '',
      email: '',
      mobile: '',
      message: ''
    });
    showToast("Feedback submitted and saved successfully!");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Reset spell check suggestion when query changes
    setSpellCheckSuggestion(null);
    
    // Get title suggestions if query has at least 3 characters
    if (query.length > 2) {
      const titleSuggestions = csvDataService.getTitleSuggestions(query, 3);
      
      const formattedSuggestions: SearchSuggestion[] = titleSuggestions.map(text => ({
        text,
        category: "Suggested"
      }));
      
      setSuggestions(formattedSuggestions);
      
      // Check spelling for single words
      if (query.split(/\s+/).length === 1) {
        const spellingSuggestion = csvDataService.findSpellingSuggestion(query);
        if (spellingSuggestion) {
          setSpellCheckSuggestion(spellingSuggestion);
        }
      }
    } else {
      setSuggestions([]);
    }
  };
  
  // Function to perform CSV search
  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Search from CSV data
      const searchResults = csvDataService.searchCourses(searchQuery, 25);
      
      // Process the results
      if (searchResults.length > 0) {
        setCourses(searchResults);
        showToast(`Found ${searchResults.length} courses matching "${searchQuery}"`);
        
        // Now fetch page rank data
        try {
          const pageRankResponse = await fetchPageRank(searchQuery);
          if (pageRankResponse && pageRankResponse.data) {
            setPageRankData(pageRankResponse.data);
          }
        } catch (pageRankError) {
          console.error("Error fetching page rank data:", pageRankError);
          // We don't set the main error as this is a secondary feature
        }

        try {
          const invertedIndexResponse = await fetchInvertedIndex(searchQuery);
          if (invertedIndexResponse && invertedIndexResponse.data) {
              setInvertedIndexData(invertedIndexResponse.data);
          }
          } catch (invertedIndexError) {
              console.error("Error fetching inverted index data:", invertedIndexError);
          }
      } else {
        setError("No courses found. Try a different search term.");
      }
    } catch (err) {
      setError("Failed to search courses. Please try again later.");
      console.error("Error searching courses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const performScraping = async () => {
    if (!searchQuery.trim()) return;
    
    setIsScraping(true);
    setError(null);
    
    try {
      // Call the API with the search query
      const fetchedCourses = await fetchCourses(searchQuery, 15, true);
      
      // Process the API response
      if (fetchedCourses.length > 0) {
        setCourses(fetchedCourses);
        showToast(`Scraped ${fetchedCourses.length} courses for "${searchQuery}"`);
        
        // Now fetch page rank data
        try {
          const pageRankResponse = await fetchPageRank(searchQuery);
          if (pageRankResponse && pageRankResponse.data) {
            setPageRankData(pageRankResponse.data);
          }
        } catch (pageRankError) {
          console.error("Error fetching page rank data:", pageRankError);
          // We don't set the main error as this is a secondary feature
        }


        try {
          const invertedIndexResponse = await fetchInvertedIndex(searchQuery);
          if (invertedIndexResponse && invertedIndexResponse.data) {
              setInvertedIndexData(invertedIndexResponse.data);
          }
          } catch (invertedIndexError) {
              console.error("Error fetching inverted index data:", invertedIndexError);
          }
      } else {
        setError("No courses found. Try a different search term.");
      }
    } catch (err) {
      setError("Failed to scrape courses. Please try again later.");
      console.error("Error scraping courses:", err);
    } finally {
      setIsScraping(false);
    }
  };

  const filteredCourses = selectedPlatform === 'all' 
    ? courses 
    : courses.filter(course => course.platform.toLowerCase() === selectedPlatform.toLowerCase());

  return (
    <div className="min-h-screen bg-black">
      {/* Toast Notification */}
      <div className={`fixed top-16 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-500 ${toast.visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {toast.message}
      </div>
      
      {/* Navigation */}
      <nav className="bg-gray-900 text-white fixed w-full z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="sparkle-container">
            <h1 className="text-xl md:text-3xl brand-name metallic-text">
              EduMetrics
            </h1>
            <div className="sparkle" />
          </div>
          
          {/* New Scrape Button */}
          <button
            onClick={performScraping}
            disabled={isScraping || !searchQuery.trim()}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center"
          >
            <Download size={20} className={isScraping ? "animate-pulse" : ""} />
            <span className="ml-2 hidden md:inline">{isScraping ? "Scraping..." : "Scrape"}</span>
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Features</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hero Section */}
      <div className="min-h-screen bg-black relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-32 typewriter">
            {displayText}
          </h1>
        </div>
        
        {/* Search container */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-[60%] px-4 z-10">
          <div className="relative">
            {spellCheckSuggestion && (
              <div className="absolute -top-6 left-0 text-white bg-gray-800 px-2 py-1 rounded-t-md text-sm">
                Did you mean: <button 
                  className="text-blue-400 hover:underline" 
                  onClick={() => setSearchQuery(spellCheckSuggestion)}
                >
                  {spellCheckSuggestion}
                </button>
              </div>
            )}
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-6 py-3 rounded-lg focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
            />
            <button
              onClick={performSearch}
              disabled={isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#cc73f8] text-white px-4 py-2 rounded-lg 
                      hover:bg-[#2ECC71] transition-all duration-300 flex items-center"
            >
              {isLoading ? (
                <Loader size={20} className="mr-2 animate-spin" />
              ) : (
                <Search size={20} className="mr-2" />
              )}
              {isLoading ? "Searching..." : "Search"}
            </button>
            
            {suggestions.length > 0 && !isLoading && (
              <div className="suggestions-container">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                    onClick={() => {
                      setSearchQuery(suggestion.text);
                      performSearch();
                    }}
                  >
                    <span>{suggestion.text}</span>
                    <span className="text-sm text-gray-500">{suggestion.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {platforms.map(platform => (
            <button
              key={platform.id}
              className={`platform-button ${selectedPlatform === platform.id ? 'active' : ''}`}
              onClick={() => setSelectedPlatform(platform.id)}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loader or Error Message */}
      {(isLoading || isScraping) && (
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <Loader size={40} className="text-[#cc73f8] animate-spin mb-4" />
            <p className="text-white text-xl">
              {isLoading ? "Searching for courses..." : "Scraping courses..."}
            </p>
          </div>
        </div>
      )}

      {error && !isLoading && !isScraping && (
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Course Display Section */}
      <div id="courses" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">
          {courses.length > 0 ? "Search Results" : "Featured Courses"}
        </h2>
        
        {!isLoading && !isScraping && courses.length === 0 && !error ? (
          <p className="text-white text-center mb-8">
            Search for courses to see results!
          </p>
        ) : null}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform 
                      duration-300 hover:scale-105 hover:shadow-xl"
            >
              <img
                src={course.image || `https://source.unsplash.com/random/300x200?education&sig=${index}`}
                alt={course.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://source.unsplash.com/random/300x200?education&sig=${index}`;
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="ml-2">{course.rating || "N/A"}</span>
                  <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {getPlatformName(course.platform)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    {typeof course.price === 'number' 
                      ? (course.price === 0 ? "Free" : `$${course.price}`) 
                      : course.price || "Free"}
                  </span>
                  <a 
                    href={course.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#cc73f8] text-white px-4 py-2 rounded-lg 
                                  hover:bg-[#2ECC71] transition-colors duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Course Analytics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Word Frequency Analysis */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <BarChart2 className="w-8 h-8 mr-3 text-[#cc73f8]" />
              <h3 className="text-xl font-semibold text-white">Word Frequency Analysis</h3>
            </div>
            <p className="text-gray-400 mb-6">Most common keywords in available courses</p>
            <WordFrequencyChart data={wordFrequencyData} />
          </div>
          
          {/* Inverted Index Display */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <Network className="w-8 h-8 mr-3 text-[#cc73f8]" />
              <h3 className="text-xl font-semibold text-white">Inverted Index</h3>
            </div>
            <p className="text-gray-400 mb-6">Keywords and their associated courses</p>
            <InvertedIndexTable data={invertedIndexData} />
          </div>
          
          {/* Page Ranking Visualization */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 mr-3 text-[#cc73f8]" />
              <h3 className="text-xl font-semibold text-white">Page Ranking</h3>
            </div>
            <p className="text-gray-400 mb-6">Top-rated courses by relevance and popularity</p>
            <PageRankDisplay data={pageRankData} />
          </div>
        </div>
      </div>

      {/* Feedback Form Section */}
      <div className="container mx-auto px-4 py-16 bg-gray-800 rounded-lg mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Feedback</h2>
        {feedbackError && <p className="text-red-500 text-center mb-4">{feedbackError}</p>}
        <form onSubmit={handleFeedbackSubmit} className="max-w-lg mx-auto space-y-4">
          <input
            type="text"
            name="name"
            value={feedback.name}
            onChange={handleFeedbackChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={feedback.email}
            onChange={handleFeedbackChange}
            placeholder="Your Email"
            className="w-full px-4 py-2 rounded"
          />
          <input
            type="text"
            name="mobile"
            value={feedback.mobile}
            onChange={handleFeedbackChange}
            placeholder="Your Mobile Number (e.g., +1 613-957-2991)"
            className="w-full px-4 py-2 rounded"
          />
          <textarea
            name="message"
            value={feedback.message}
            onChange={handleFeedbackChange}
            placeholder="Your Message"
            className="w-full px-4 py-2 rounded h-32"
          />
          <button
            type="submit"
            className="w-full bg-[#cc73f8] text-white px-4 py-2 rounded hover:bg-[#2ECC71] transition-colors"
          >
            Submit Feedback
          </button>
        </form>
      </div>



      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <h3 className="font-bold text-lg mb-2">{member.name}</h3>
                <p className="text-gray-400 mb-3">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#cc73f8] hover:text-[#2ECC71] transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#cc73f8] hover:text-[#2ECC71] transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 text-gray-400">
            <p>© 2025 EduMetrics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getPlatformName(platformId: string): string {
  const platformMap: Record<string, string> = {
    'edx': 'EDx',
    'coursera': 'Coursera',
    'Coursera': 'Coursera',
    'khan-academy': 'Khan Academy',
    'KhanAcademy': 'Khan Academy',
    'Khan Academy': 'Khan Academy',
    'stanford': 'Stanford',
    'StanfordOnline': 'Stanford',
    'roadmap-sh': 'Roadmap.sh'
  };

  return platformMap[platformId] || platformId;
}

export default App;