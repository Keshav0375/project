import React, { useState, useEffect } from 'react';
import { Search, Menu, Star, X, BarChart2, Network, TrendingUp } from 'lucide-react';
import type {SearchSuggestion } from './types';
// Data imports moved to separate files for clarity
import { courses, teamMembers, features } from './data';
import { WordFrequencyChart } from './components/analysis/WordFrequencyChart';
import { InvertedIndexTable } from './components/analysis/InvertedIndexTable';
import { PageRankDisplay } from './components/analysis/PageRankDisplay';
import { wordFrequencyData, invertedIndexData, pageRankData } from './data/analysisData';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const fullText = "Find Your Perfect Course";

  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'edx', name: 'EDx' },
    { id: 'coursera', name: 'Coursera' },
    { id: 'khan-academy', name: 'Khan Academy' },
    { id: 'stanford', name: 'Stanford Education' },
    { id: 'roadmap-sh', name: 'Roadmap.sh' }
  ];

  useEffect(() => {
    let currentIndex = 0;
    let interval: number;

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  
    // List of diverse course search formations
    const formations: string[] = [
      `Best ${query} courses`,
      `${query} courses online`,
      `${query} certification programs`,
      `Learn ${query} from scratch`,
      `Advanced ${query} tutorials`,
      `Top-rated ${query} courses`,
      `Beginner-friendly ${query} classes`,
      `Free ${query} learning resources`,
      `Professional ${query} training`,
      `Industry-recognized ${query} certification`,
      `Practical ${query} workshops`,
      `${query} bootcamp for professionals`,
      `Step-by-step ${query} guide`,
      `Latest trends in ${query}`,
      `Complete ${query} roadmap`,
      `${query} diploma programs`,
      `Mastering ${query} in 30 days`,
      `Comprehensive ${query} study plan`,
      `${query} mentorship programs`,
      `Best platforms to learn ${query}`
    ];


    // Select 3 random suggestions
    if (query.length > 2) {
      const randomSuggestions = formations
        .sort(() => Math.random() - 0.5) // Shuffle array
        .slice(0, 3) // Pick 3
        .map(text => ({ text, category: "Suggested" })); // Format as suggestion object
  
      setSuggestions(randomSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  

  const filteredCourses = selectedPlatform === 'all' 
    ? courses 
    : courses.filter(course => course.platform === selectedPlatform);

  return (
    <div className="min-h-screen bg-black">
      {/* <Toaster position="top-right" /> */}
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
          <div className="w-8" />
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
      
      {/* CHANGE: Updated search container positioning to be fixed only within hero boundaries */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-[60%] px-4 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-6 py-3 rounded-lg focus:outline-none"
          />
          <button
            onClick={() => setShowMoreSuggestions(!showMoreSuggestions)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#cc73f8] text-white px-4 py-2 rounded-lg 
                    hover:bg-[#2ECC71] transition-all duration-300 flex items-center"
          >
            <Search size={20} className="mr-2" />
            Search
          </button>
          
          {suggestions.length > 0 && (
            <div className="suggestions-container">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center"
                  onClick={() => setSearchQuery(suggestion.text)}
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

        {/* Course Display Section */}
        <div id="courses" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform 
                        duration-300 hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center mb-4">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    <span className="ml-2">{course.rating}</span>
                    <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getPlatformName(course.platform)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    <button className="bg-[#cc73f8] text-white px-4 py-2 rounded-lg 
                                    hover:bg-[#2ECC71] transition-colors duration-300">
                      Learn More
                    </button>
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
  switch (platformId) {
    case 'edx':
      return 'EDx';
    case 'coursera':
      return 'Coursera';
    case 'khan-academy':
      return 'Khan Academy';
    case 'stanford':
      return 'Stanford';
    case 'roadmap-sh':
      return 'Roadmap.sh';
    default:
      return platformId;
  }
}

export default App;