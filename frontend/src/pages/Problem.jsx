import React, { useRef, useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Timer,
  Fullscreen,
  Share2,
  Minimize2,
  Check,
  X,
  Search,
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const ProblemPage = () => {
  const navigate = useNavigate();
  const fullscreenRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showProblemList, setShowProblemList] = useState(false);
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Resizable panels state
  const [leftWidth, setLeftWidth] = useState(50); // Default width percentage
  const [editorHeight, setEditorHeight] = useState(70); // Default height percentage for editor
  const [isResizing, setIsResizing] = useState(false);
  const [isVerticalResizing, setIsVerticalResizing] = useState(false);
  const containerRef = useRef(null);

  // Fetch problems from backend
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/problem/getAllProblem');
        setProblems(response.data);
        
        // Set the first problem as current if none is selected
        if (response.data.length > 0 && !currentProblem) {
          setCurrentProblem(response.data[0]);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load problems. Please try again later.');
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Filter problems based on search term
  const filteredProblems = useMemo(() => {
    if (!searchTerm.trim()) return problems;
    return problems.filter(problem => 
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [problems, searchTerm]);

  // Handle resizing of panels
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        // Horizontal resizing (left/right panels)
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const mouseX = e.clientX - containerRect.left;
        const newLeftWidth = (mouseX / containerWidth) * 100;
        
        // Set boundaries (min 20%, max 80%)
        if (newLeftWidth >= 20 && newLeftWidth <= 80) {
          setLeftWidth(newLeftWidth);
        }
      }
      
      if (isVerticalResizing) {
        // Vertical resizing (editor/test cases)
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerHeight = containerRect.height;
        const mouseY = e.clientY - containerRect.top;
        const newEditorHeight = (mouseY / containerHeight) * 100;
        
        // Set boundaries (min 30%, max 90%)
        if (newEditorHeight >= 30 && newEditorHeight <= 90) {
          setEditorHeight(newEditorHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsVerticalResizing(false);
    };

    if (isResizing || isVerticalResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isVerticalResizing]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const elem = fullscreenRef.current;
    if (!isFullscreen) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  // Clipboard copy function
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy URL');
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(!!isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Navigation handlers for chevron buttons
  const handlePrevProblem = () => {
    if (currentProblem) {
      const currentIndex = problems.findIndex(p => p._id === currentProblem._id);
      if (currentIndex > 0) {
        const prevProblem = problems[currentIndex - 1];
        setCurrentProblem(prevProblem);
        navigate(`/problem/${prevProblem._id}`);
      }
    }
  };

  const handleNextProblem = () => {
    if (currentProblem) {
      const currentIndex = problems.findIndex(p => p._id === currentProblem._id);
      if (currentIndex < problems.length - 1) {
        const nextProblem = problems[currentIndex + 1];
        setCurrentProblem(nextProblem);
        navigate(`/problem/${nextProblem._id}`);
      }
    }
  };

  // Handle problem selection from list
  const handleProblemSelect = (problem) => {
    setCurrentProblem(problem);
    setShowProblemList(false);
    navigate(`/problem/${problem._id}`);
  };

  // Get current problem index for navigation
  const getCurrentProblemIndex = () => {
    if (!currentProblem) return -1;
    return problems.findIndex(p => p._id === currentProblem._id);
  };

  const currentIndex = getCurrentProblemIndex();

  return (
    <div ref={fullscreenRef} className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      
      {/* Problem List Modal */}
      {showProblemList && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowProblemList(false)}
          />
          
          <div className="relative z-50 w-full max-w-md bg-[#27272a]/80 backdrop-blur-md shadow-lg">
            <div className="p-4 border-b ">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Problem List</h2>
                <button 
                  onClick={() => setShowProblemList(false)}
                  className="p-1 rounded hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="relative border rounded">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">  
                  <Search className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  className="w-full py-2 pl-10 pr-4 bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">🍀</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Loading problems...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-400">{error}</div>
              ) : filteredProblems.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No problems found</div>
              ) : (
                filteredProblems.map((problem) => (
                  <div
                    key={problem._id}
                    className={`p-2 border-b cursor-pointer hover:text-orange-300 ${
                      currentProblem && currentProblem._id === problem._id 
                        ? 'text-orange-500' 
                        : ''
                    }`}
                    onClick={() => handleProblemSelect(problem)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{problem.title}</h3>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full ${
                          problem.difficulty === 'easy' 
                            ? 'bg-green-900 text-green-300' 
                            : problem.difficulty === 'medium' 
                              ? 'bg-yellow-900 text-yellow-300' 
                              : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="bg-black border-b border-gray-800 px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-40">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className="text-white text-lg font-bold px-3 py-1 border-r border-gray-700 hover:text-orange-400"
          >
            DC
          </NavLink>
          <div className="flex items-center gap-2 text-gray-300">
            <span 
              className="hover:text-white transition cursor-pointer"
              onClick={() => setShowProblemList(true)}
            >
              Problem List
            </span>
            <ChevronLeft 
              className={`hover:text-white cursor-pointer ${
                currentIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={currentIndex > 0 ? handlePrevProblem : undefined}
            />
            <ChevronRight 
              className={`hover:text-white cursor-pointer ${
                currentIndex >= problems.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={currentIndex < problems.length - 1 ? handleNextProblem : undefined}
            />
          </div>
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded bg-orange-500 ">
            <Play className="text-white w-5 h-5" />
          </button>
          <button className="w-20 h-10 flex items-center justify-center text-sm text-white rounded bg-orange-500">
            Submit
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded bg-orange-500">
            <Timer className="text-white w-5 h-5" />
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="hover:text-white text-gray-300 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 /> : <Fullscreen />}
          </button>
          <button
            onClick={handleShare}
            className="hover:text-white text-gray-300 transition"
            title="Copy Link"
          >
            {copied ? <Check className="text-green-400" /> : <Share2 />}
          </button>
          <span className="text-xs font-medium px-3 py-1 rounded-full text-orange-400 bg-gray-800 hover:bg-gray-700 cursor-pointer transition">
            Upgrade to Pro
          </span>
        </div>
      </nav>
      
      {/* Main Content - Resizable Panels */}
      <div 
        ref={containerRef}
        className="flex h-[calc(100vh-64px)] relative"
      >
        {/* Left Tab - Problem Description */}
        <div 
          className="h-full overflow-auto bg-[#0e0e10]/80 backdrop-blur-md p-6"
          style={{ width: `${leftWidth}%` }}
        >
          {currentProblem ? (
            <>
              <h1 className="text-3xl font-bold mb-2">
                {currentProblem.title}
              </h1>
              <div className="mb-4 flex items-center gap-4">
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${
                    currentProblem.difficulty === 'easy' 
                      ? 'bg-green-900 text-green-300' 
                      : currentProblem.difficulty === 'medium' 
                        ? 'bg-yellow-900 text-yellow-300' 
                        : 'bg-red-900 text-red-300'
                  }`}
                >
                  {currentProblem.difficulty}
                </span>
                <span className="text-sm text-gray-400">
                  Problem {currentIndex + 1} of {problems.length}
                </span>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: currentProblem.description 
                  }} 
                  className="text-gray-300 mb-6"
                />
                
                {currentProblem.example && (
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Example:</h3>
                    <pre className="bg-gray-900 p-4 rounded overflow-x-auto">
                      {currentProblem.example}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 pt-10">
              {loading ? (
                "Loading problem data..."
              ) : error ? (
                error
              ) : problems.length === 0 ? (
                "No problems available"
              ) : (
                "Select a problem to view details"
              )}
            </div>
          )}
        </div>
        
        {/* Vertical Resizer (Left/Right Panels) */}
        <div 
          className="w-1 bg-gray-700 hover:bg-orange-500 cursor-col-resize absolute top-0 bottom-0 z-10"
          style={{ left: `${leftWidth}%` }}
          onMouseDown={() => setIsResizing(true)}
        />
        
        {/* Right Tab - Code Editor and Test Cases */}
        <div 
          className="h-full bg-[#0e0e10]/80 backdrop-blur-md flex flex-col"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {/* Code Editor */}
          <div 
            className="overflow-auto"
            style={{ height: `${editorHeight}%` }}
          >
            
          </div>
          
          {/* Horizontal Resizer (Editor/Test Cases) */}
          <div 
            className="h-1 bg-gray-700 hover:bg-orange-500 cursor-row-resize"
            onMouseDown={() => setIsVerticalResizing(true)}
          />
          
          {/* Test Cases */}
          <div 
            className="overflow-auto"
            style={{ height: `${100 - editorHeight}%` }}
          >
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;