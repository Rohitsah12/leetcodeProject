import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, ExternalLink, Loader2, HelpCircle, Trophy, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    
    if (contestsCacheRef.current[cacheKey]) {
      return contestsCacheRef.current[cacheKey];
    }
    
    try {
      const monthContests = await fetchContests(startStr, endStr);
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
    
    const currentKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
    const nextKey = `${nextMonth.getFullYear()}-${nextMonth.getMonth()}`;
    const thirdKey = `${thirdMonth.getFullYear()}-${thirdMonth.getMonth()}`;
    
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
      
      setFetchedMonths(prevFetchedMonths => {
        const newFetchedMonths = new Set(prevFetchedMonths);
        monthsToFetch.forEach(month => {
          const key = `${month.getFullYear()}-${month.getMonth()}`;
          newFetchedMonths.add(key);
        });
        return newFetchedMonths;
      });
      
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
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return (
      <motion.div 
        className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 mb-6 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-orange-400 mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {monthName}
        </motion.h2>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <motion.div 
              key={day} 
              className="text-center font-semibold text-orange-300 py-3 bg-orange-500/10 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {day}
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-28"></div>;
            }
            
            const date = new Date(year, month, day);
            const dayContests = getContestsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isPast = date < today;
            const isFutureWithNoContests = date > today && dayContests.length === 0;
            
            return (
              <motion.div
                key={day}
                className={`h-28 border-2 border-orange-500/30 p-2 overflow-hidden relative cursor-pointer transition-all duration-300 rounded-lg group ${
                  isToday 
                    ? 'bg-gradient-to-br from-orange-600/40 to-orange-700/40 border-orange-400 shadow-lg shadow-orange-500/20' 
                    : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:from-orange-500/20 hover:to-orange-600/20'
                } ${isPast ? 'opacity-60' : ''}`}
                onMouseEnter={(e) => handleMouseEnter(date, e)}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02, duration: 0.3 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 20px rgba(251, 146, 60, 0.4)",
                  borderColor: "rgba(251, 146, 60, 0.8)"
                }}
              >
                <motion.div 
                  className={`text-lg font-bold mb-2 ${
                    isToday ? 'text-white' : 'text-orange-200 group-hover:text-orange-100'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {day}
                </motion.div>
                
                {isFutureWithNoContests && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <HelpCircle className="w-8 h-8 text-orange-400/50" />
                  </motion.div>
                )}
                
                {!isFutureWithNoContests && (
                  <div className="space-y-1">
                    {dayContests.slice(0, 2).map((contest, idx) => (
                      <motion.div
                        key={contest.id || idx}
                        className="text-xs bg-gradient-to-r from-orange-600 to-orange-700 text-white p-1.5 rounded truncate shadow-sm"
                        title={contest.event || 'Contest'}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgb(194, 65, 12)" }}
                      >
                        {contest.event ? (
                          contest.event.length > 12 ? contest.event.substring(0, 12) + '...' : contest.event
                        ) : 'Contest'}
                      </motion.div>
                    ))}
                    {dayContests.length > 2 && (
                      <motion.div 
                        className="text-xs text-orange-300 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        +{dayContests.length - 2} more
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }, [currentDate, getContestsForDate, handleMouseEnter, handleMouseLeave]);

  const renderContestSlider = useCallback(() => {
    if (upcomingContests.length === 0) {
      return (
        <motion.div 
          className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 shadow-2xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-orange-400" />
            Upcoming Contests
          </h3>
          <motion.p 
            className="text-orange-300 text-center py-8"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            No upcoming contests found
          </motion.p>
        </motion.div>
      );
    }

    const contest = upcomingContests[currentContestIndex];
    if (!contest) return null;
    
    return (
      <motion.div 
        className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 shadow-2xl"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h3 
            className="text-xl font-bold text-orange-400 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="w-6 h-6 text-orange-400" />
            Upcoming Contests
          </motion.h3>
          <div className="text-orange-300 text-sm bg-orange-500/20 px-3 py-1 rounded-full">
            {currentContestIndex + 1} / {upcomingContests.length}
          </div>
        </div>
        
        <div className="relative">
          {upcomingContests.length > 1 && (
            <>
              <motion.button 
                onClick={prevContest}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-3 rounded-full hover:bg-orange-500 z-10 shadow-lg"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(251, 146, 60, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </motion.button>
              
              <motion.button 
                onClick={nextContest}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-orange-600 p-3 rounded-full hover:bg-orange-500 z-10 shadow-lg"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(251, 146, 60, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.button>
            </>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentContestIndex}
              className={`bg-gradient-to-br from-orange-900/60 to-orange-800/60 border border-orange-500/40 rounded-xl p-6 backdrop-blur-sm ${upcomingContests.length > 1 ? 'mx-12' : ''}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h4 
                className="font-bold text-white mb-4 text-center text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {contest.event || 'Contest'}
              </motion.h4>
              
              <div className="text-sm text-orange-100 space-y-3">
                <motion.div 
                  className="flex items-center gap-3 p-2 bg-black/20 rounded-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ExternalLink className="w-5 h-5 text-orange-300 flex-shrink-0" />
                  <span className="truncate">Platform: {contest.host || 'Unknown'}</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 p-2 bg-black/20 rounded-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Clock className="w-5 h-5 text-orange-300 flex-shrink-0" />
                  <span>Start: {formatToIST(contest.start)} (IST)</span>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 p-2 bg-black/20 rounded-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Users className="w-5 h-5 text-orange-300 flex-shrink-0" />
                  <span>Duration: {formatDuration(contest.duration)}</span>
                </motion.div>
              </div>
              
              {contest.href && (
                <motion.div 
                  className="flex justify-center mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.a
                    href={contest.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 0 20px rgba(251, 146, 60, 0.4)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Contest
                  </motion.a>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {upcomingContests.length > 1 && (
          <motion.div 
            className="flex justify-center mt-6 space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {upcomingContests.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentContestIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentContestIndex ? 'bg-orange-500 scale-125' : 'bg-orange-800 hover:bg-orange-600'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    );
  }, [upcomingContests, currentContestIndex, prevContest, nextContest, formatToIST, formatDuration]);

  const renderHoverTooltip = useCallback(() => {
    if (!hoveredDate) return null;
    
    const dayContests = getContestsForDate(hoveredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = hoveredDate < today;
    
    return (
      <AnimatePresence>
        <motion.div 
          ref={tooltipRef}
          className="fixed bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg border-2 border-orange-500/50 rounded-xl p-6 shadow-2xl z-50 max-w-md"
          style={{ 
            left: tooltipPosition.x - 200,
            top: tooltipPosition.y,
            pointerEvents: 'none'
          }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Calendar className="w-5 h-5" />
            {hoveredDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            {isPast && <span className="text-red-400 ml-2 text-sm">(Past)</span>}
          </motion.div>
          
          {dayContests.length === 0 ? (
            <motion.p 
              className="text-orange-300 text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              No contests scheduled for this day
            </motion.p>
          ) : (
            <motion.div 
              className="space-y-3 max-h-[300px] overflow-y-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {dayContests.map((contest, index) => (
                <motion.div 
                  key={contest.id || index} 
                  className="bg-gradient-to-r from-orange-900/60 to-orange-800/60 border border-orange-500/40 rounded-lg p-4 backdrop-blur-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, borderColor: "rgba(251, 146, 60, 0.6)" }}
                >
                  <h4 className="font-semibold text-white mb-2">{contest.event || 'Contest'}</h4>
                  <div className="text-xs text-orange-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-orange-300" />
                      <span>Platform: {contest.host || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-300" />
                      <span>Start: {formatTimeToIST(contest.start)} (IST)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-300" />
                      <span>Duration: {formatDuration(contest.duration)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
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
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(251, 146, 60, 0.6);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(251, 146, 60, 0.8);
          }
        `}
      </style>
      
      <Navbar />

      <div className="bg-opacity-80 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl font-bold text-orange-400 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Calendar className="w-10 h-10 text-orange-400" />
              </motion.div>
              Contest Calendar
            </motion.h1>
            
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigateMonth(-1)}
                className="p-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(251, 146, 60, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              <motion.span 
                className="text-orange-300 font-semibold text-lg bg-orange-500/20 px-4 py-2 rounded-lg"
                key={currentDate.getMonth()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </motion.span>
              
              <motion.button
                onClick={() => navigateMonth(1)}
                className="p-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(251, 146, 60, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {loading && (
              <motion.div 
                className="flex items-center justify-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-10 h-10 text-orange-400" />
                </motion.div>
                <span className="ml-3 text-orange-300 text-lg">Loading contests...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="bg-gradient-to-r from-red-900/80 to-red-800/80 border border-red-500/50 text-white p-6 rounded-xl mb-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && !error && (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="lg:col-span-2">
                {renderCalendar()}
              </div>
              
              <div className="lg:col-span-1">
                {renderContestSlider()}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {renderHoverTooltip()}
    </div>
  );
};

export default EventTracker;
