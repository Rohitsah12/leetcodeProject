import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, ExternalLink, Loader2, HelpCircle } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';

const EventTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentContestIndex, setCurrentContestIndex] = useState(0);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);
  const [fetchedMonths, setFetchedMonths] = useState(new Set());
  const contestsCacheRef = useRef({});

  const username = "RohitKumarsah";
  const apiKey = "ff0f4599aa59e360096c1d5eb6213bd005e2705e";
  
  const allowedSites = [
    'codechef.com',
    'codeforces.com', 
    'leetcode.com',
    'atcoder.jp',
  ];

  // Helper function to parse UTC date strings correctly
  const parseUTCDate = useCallback((dateString) => {
    if (!dateString) return new Date();
    if (typeof dateString !== 'string') {
      return new Date(dateString);
    }
    // Append 'Z' to indicate UTC if no timezone is present
    if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
      return new Date(dateString + 'Z');
    }
    return new Date(dateString);
  }, []);

  // Define upcomingContests using useMemo
  const upcomingContests = useMemo(() => {
    const now = new Date();
    return contests
      .filter(contest => {
        const contestDate = parseUTCDate(contest.start);
        return contestDate >= now;
      })
      .sort((a, b) => {
        const dateA = parseUTCDate(a.start);
        const dateB = parseUTCDate(b.start);
        return dateA - dateB;
      });
  }, [contests, parseUTCDate]);

  const formatDuration = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }, []);

  // Format date to Indian Standard Time (IST)
  const formatToIST = useCallback((dateString) => {
    try {
      const date = parseUTCDate(dateString);
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }, [parseUTCDate]);

  // Format time only to IST
  const formatTimeToIST = useCallback((dateString) => {
    try {
      const date = parseUTCDate(dateString);
      return date.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Time';
    }
  }, [parseUTCDate]);

  const fetchContests = useCallback(async (startDate, endDate) => {
    const url = `https://clist.by/api/v3/contest/?username=${username}&api_key=${apiKey}&start__gte=${startDate}&end__lte=${endDate}&limit=100&order_by=start`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data && data.objects && Array.isArray(data.objects)) {
        const filteredContests = data.objects.filter(contest => 
          contest && contest.host && allowedSites.includes(contest.host)
        );
        return filteredContests;
      }
      return [];
    } catch (err) {
      console.error('Error fetching contests:', err);
      throw err;
    }
  }, [username, apiKey]);

  const loadContestsForMonth = useCallback(async (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const startStr = startDate.toISOString();
    const endStr = endDate.toISOString();
    
    const cacheKey = `${year}-${month}`;
    
    // Check cache first
    if (contestsCacheRef.current[cacheKey]) {
      return contestsCacheRef.current[cacheKey];
    }
    
    try {
      const monthContests = await fetchContests(startStr, endStr);
      // Cache the results
      contestsCacheRef.current[cacheKey] = monthContests;
      return monthContests;
    } catch (err) {
      throw err;
    }
  }, [fetchContests]);

  const loadContests = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const thirdMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 1);
    
    // Create keys for each month
    const currentKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
    const nextKey = `${nextMonth.getFullYear()}-${nextMonth.getMonth()}`;
    const thirdKey = `${thirdMonth.getFullYear()}-${thirdMonth.getMonth()}`;
    
    // Check which months need to be fetched
    const monthsToFetch = [];
    if (!fetchedMonths.has(currentKey)) monthsToFetch.push(currentMonth);
    if (!fetchedMonths.has(nextKey)) monthsToFetch.push(nextMonth);
    if (!fetchedMonths.has(thirdKey)) monthsToFetch.push(thirdMonth);
    
    if (monthsToFetch.length === 0) {
      setLoading(false);
      return;
    }
    
    try {
      const results = await Promise.all(monthsToFetch.map(loadContestsForMonth));
      
      // Update fetched months
      setFetchedMonths(prevFetchedMonths => {
        const newFetchedMonths = new Set(prevFetchedMonths);
        monthsToFetch.forEach(month => {
          const key = `${month.getFullYear()}-${month.getMonth()}`;
          newFetchedMonths.add(key);
        });
        return newFetchedMonths;
      });
      
      // Combine all contests
      setContests(prev => {
        const existingIds = new Set(prev.map(c => c.id));
        const newContests = [];
        
        results.forEach(monthContests => {
          monthContests.forEach(contest => {
            if (!existingIds.has(contest.id)) {
              newContests.push(contest);
              existingIds.add(contest.id);
            }
          });
        });
        
        return [...prev, ...newContests];
      });
    } catch (err) {
      setError('Failed to load contests. Please try again.');
      console.error('Error loading contests:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate, fetchedMonths, loadContestsForMonth]);

  useEffect(() => {
    loadContests();
  }, [loadContests]);

  // Reset contest index when contests change
  useEffect(() => {
    setCurrentContestIndex(0);
  }, [upcomingContests]);

  const navigateMonth = useCallback((direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  }, [currentDate]);

  const getContestsForDate = useCallback((date) => {
    return contests.filter(contest => {
      try {
        const contestDate = parseUTCDate(contest.start);
        return contestDate.toDateString() === date.toDateString();
      } catch (error) {
        return false;
      }
    });
  }, [contests, parseUTCDate]);

  const nextContest = useCallback(() => {
    if (upcomingContests.length === 0) return;
    setCurrentContestIndex(prev => 
      prev < upcomingContests.length - 1 ? prev + 1 : 0
    );
  }, [upcomingContests]);

  const prevContest = useCallback(() => {
    if (upcomingContests.length === 0) return;
    setCurrentContestIndex(prev => 
      prev > 0 ? prev - 1 : upcomingContests.length - 1
    );
  }, [upcomingContests]);

  const handleMouseEnter = useCallback((date, event) => {
    setHoveredDate(date);
    
    const rect = event.currentTarget.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    let x = rect.left + scrollLeft + rect.width / 2;
    let y = rect.top + scrollTop + rect.height + 10;
    
    // Adjust position to keep tooltip within viewport
    const tooltipWidth = 400;
    const tooltipHeight = 300;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (x + tooltipWidth / 2 > viewportWidth) {
      x = viewportWidth - tooltipWidth / 2 - 20;
    }
    if (x - tooltipWidth / 2 < 0) {
      x = tooltipWidth / 2 + 20;
    }
    
    if (y + tooltipHeight > viewportHeight + scrollTop) {
      y = rect.top + scrollTop - tooltipHeight - 10;
    }
    
    setTooltipPosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredDate(null);
  }, []);

  const renderCalendar = useCallback(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const calendarDate = new Date(year, month, 1);
    const monthName = calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    // Today's date without time for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (
      <div className="bg-black border border-orange-600 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold text-orange-400 mb-4 text-center">{monthName}</h2>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-orange-300 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-24"></div>;
            }
            
            const date = new Date(year, month, day);
            const dayContests = getContestsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            // Check if date is in the past
            const isPast = date < today;
            
            // Check if date is in the future with no contests
            const isFutureWithNoContests = date > today && dayContests.length === 0;
            
            return (
              <div
                key={day}
                className={`h-24 border border-orange-600 p-1 overflow-hidden relative cursor-pointer transition-all duration-200 ${
                  isToday ? 'bg-orange-900 border-orange-300' : 'bg-black'
                } ${isPast ? 'past-day' : ''} ${hoveredDate?.toDateString() === date.toDateString() ? 'ring-2 ring-orange-400' : ''}`}
                onMouseEnter={(e) => handleMouseEnter(date, e)}
                onMouseLeave={handleMouseLeave}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-white' : 'text-orange-200'}`}>
                  {day}
                </div>
                
                {/* Question mark for future days with no contests */}
                {isFutureWithNoContests && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-orange-400 opacity-40" />
                  </div>
                )}
                
                {/* Contest list - shown by default for today and past days */}
                {!isFutureWithNoContests && dayContests.map((contest, idx) => (
                  <div
                    key={contest.id || idx}
                    className="text-xs bg-orange-600 text-white p-1 mb-1 rounded truncate"
                    title={contest.event || 'Contest'}
                  >
                    {contest.event ? (
                      contest.event.length > 15 ? contest.event.substring(0, 15) + '...' : contest.event
                    ) : 'Contest'}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [currentDate, getContestsForDate, handleMouseEnter, handleMouseLeave, hoveredDate]);

  const renderContestSlider = useCallback(() => {
    if (upcomingContests.length === 0) {
      return (
        <div className="bg-black border border-orange-600 rounded-lg p-4">
          <h3 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Upcoming Contests
          </h3>
          <p className="text-orange-300 text-center py-4">No upcoming contests found</p>
        </div>
      );
    }

    const contest = upcomingContests[currentContestIndex];
    if (!contest) return null;
    
    return (
      <div className="bg-black border border-orange-600 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            Upcoming Contests
          </h3>
          <div className="text-orange-300 text-sm">
            {currentContestIndex + 1} / {upcomingContests.length}
          </div>
        </div>
        
        <div className="relative">
          {/* Navigation Arrows */}
          {upcomingContests.length > 1 && (
            <>
              <button 
                onClick={prevContest}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-700 p-2 rounded-full hover:bg-orange-600 z-10"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              <button 
                onClick={nextContest}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-700 p-2 rounded-full hover:bg-orange-600 z-10"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
          
          {/* Contest Card */}
          <div className={`bg-orange-900 border border-orange-700 rounded p-4 ${upcomingContests.length > 1 ? 'mx-8' : ''}`}>
            <h4 className="font-semibold text-white mb-2 text-center">{contest.event || 'Contest'}</h4>
            <div className="text-sm text-orange-100 space-y-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-orange-300 flex-shrink-0" />
                <span className="truncate">Platform: {contest.host || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-300 flex-shrink-0" />
                <span>Start: {formatToIST(contest.start)} (IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-300 flex-shrink-0" />
                <span>Duration: {formatDuration(contest.duration)}</span>
              </div>
            </div>
            {contest.href && (
              <div className="flex justify-center mt-4">
                <a
                  href={contest.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-500 transition-colors"
                >
                  View Contest
                </a>
              </div>
            )}
          </div>
        </div>
        
        {upcomingContests.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {upcomingContests.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentContestIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentContestIndex ? 'bg-orange-500' : 'bg-orange-800'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }, [upcomingContests, currentContestIndex, prevContest, nextContest, formatToIST, formatDuration]);

  // Hover tooltip for day contests
  const renderHoverTooltip = useCallback(() => {
    if (!hoveredDate) return null;
    
    const dayContests = getContestsForDate(hoveredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = hoveredDate < today;
    
    return (
      <div 
        ref={tooltipRef}
        className="fixed bg-black border border-orange-600 rounded-lg p-4 shadow-xl z-50 max-w-md"
        style={{ 
          left: tooltipPosition.x - 200,
          top: tooltipPosition.y,
          transform: 'translateX(0)',
          pointerEvents: 'none'
        }}
      >
        <div className="text-lg font-bold text-orange-400 mb-2">
          {hoveredDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          {isPast && <span className="text-red-400 ml-2 text-sm">(Past)</span>}
        </div>
        
        {dayContests.length === 0 ? (
          <p className="text-orange-300">No contests scheduled for this day</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {dayContests.map((contest, index) => (
              <div key={contest.id || index} className="bg-orange-900 border border-orange-700 rounded p-3">
                <h4 className="font-semibold text-white mb-1">{contest.event || 'Contest'}</h4>
                <div className="text-xs text-orange-200 space-y-1">
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>Platform: {contest.host || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Start: {formatTimeToIST(contest.start)} (IST)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Duration: {formatDuration(contest.duration)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [hoveredDate, getContestsForDate, tooltipPosition, formatTimeToIST, formatDuration]);

  return (
    <div className="min-h-screen bg-black relative bg-gradient-to-br from-gray-900 via-black to-gray-900"
     style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
    
      <style>
        {`
          .past-day {
            position: relative;
            opacity: 0.6;
          }
          
          .past-day::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
              linear-gradient(
                to top left,
                rgba(0,0,0,0) 0%,
                rgba(0,0,0,0) calc(50% - 2px),
                rgba(220, 0, 0, 0.9) calc(50% - 2px),
                rgba(220, 0, 0, 0.9) calc(50% + 2px),
                rgba(0,0,0,0) calc(50% + 2px),
                rgba(0,0,0,0) 100%
              ),
              linear-gradient(
                to top right,
                rgba(0,0,0,0) 0%,
                rgba(0,0,0,0) calc(50% - 2px),
                rgba(220, 0, 0, 0.9) calc(50% - 2px),
                rgba(220, 0, 0, 0.9) calc(50% + 2px),
                rgba(0,0,0,0) calc(50% + 2px),
                rgba(0,0,0,0) 100%
              );
            pointer-events: none;
          }
        `}
      </style>
      <Navbar/>

      <div className="bg-opacity-80 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-orange-400 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-orange-400" />
              Contest Calendar
            </h1>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 bg-orange-700 text-white rounded hover:bg-orange-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-orange-300 font-semibold">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 bg-orange-700 text-white rounded hover:bg-orange-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
              <span className="ml-2 text-orange-300">Loading contests...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900 border border-red-600 text-white p-4 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {renderCalendar()}
              </div>
              
              <div className="lg:col-span-1">
                {renderContestSlider()}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hover tooltip - positioned absolutely */}
      {renderHoverTooltip()}
    </div>
  );
};

export default EventTracker;