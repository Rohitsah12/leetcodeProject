import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { 
  Play, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Maximize2, 
  RotateCcw, 
  Copy,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Star,
  ExternalLink,
  Lightbulb,
  Building2,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const ProblemSolvePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Problem data
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Code editor state
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [fontSize, setFontSize] = useState(14);
  
  // Test cases and results
  const [activeTab, setActiveTab] = useState('testcase');
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // UI state
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [activeDescriptionTab, setActiveDescriptionTab] = useState('description');
  const [showHints, setShowHints] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    topics: false,
    companies: false,
    hints: false,
    similar: false
  });

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/problemById/${id}`);
        setProblem(response.data);
        
        // Set initial code based on selected language
        const initialCode = response.data.startCode?.find(
          sc => sc.language === selectedLanguage
        )?.initialCode || '';
        setCode(initialCode);
      } catch (err) {
        setError('Failed to load problem');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id, selectedLanguage]);

  // Handle language change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    const initialCode = problem?.startCode?.find(
      sc => sc.language === language
    )?.initialCode || '';
    setCode(initialCode);
  };

  // Run code
  const handleRunCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setActiveTab('testcase');
    
    try {
      const response = await axiosClient.post(`/submission/run/${id}`, {
        code,
        language: selectedLanguage
      });
      
      setTestResults(response.data);
    } catch (err) {
      console.error('Run failed:', err);
      setTestResults({
        success: false,
        error: err.response?.data?.message || 'Runtime error occurred'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code
  const handleSubmitCode = async () => {
    if (!code.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axiosClient.post(`/submission/submit/${id}`, {
        code,
        language: selectedLanguage
      });
      
      // Show submission results
      setTestResults({
        ...response.data,
        isSubmission: true
      });
      setActiveTab('result');
    } catch (err) {
      console.error('Submission failed:', err);
      setTestResults({
        success: false,
        isSubmission: true,
        error: err.response?.data?.message || 'Submission failed'
      });
      setActiveTab('result');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Get language display name
  const getLanguageDisplay = (lang) => {
    const langMap = {
      'javascript': 'JavaScript',
      'c++': 'C++',
      'java': 'Java'
    };
    return langMap[lang] || lang;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading problem...</div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">{error || 'Problem not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/problemset')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Problem List</span>
          </button>
          
          <div className="flex items-center gap-2">
            <ChevronLeft size={16} className="text-gray-500" />
            <ChevronRight size={16} className="text-gray-500" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Problem Description */}
        <div 
          className="bg-gray-800 border-r border-gray-700 overflow-hidden flex flex-col"
          style={{ width: `${leftPanelWidth}%` }}
        >
          {/* Description Tabs */}
          <div className="border-b border-gray-700 flex">
            {['description', 'editorial', 'solutions', 'submissions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveDescriptionTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  activeDescriptionTab === tab
                    ? 'text-white border-b-2 border-orange-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Description Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeDescriptionTab === 'description' && (
              <div className="space-y-6">
                {/* Problem Title and Metadata */}
                <div>
                  <h1 className="text-2xl font-bold mb-4">
                    {problem.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                    </span>
                    
                    <div className="flex items-center gap-2 text-gray-400">
                      <ThumbsUp size={16} />
                      <span className="text-sm">177</span>
                      <ThumbsDown size={16} />
                      <span className="text-sm">40</span>
                    </div>
                    
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star size={16} />
                    </button>
                    
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: problem.description }} />
                </div>

                {/* Examples */}
                {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                  <div className="space-y-4">
                    {problem.visibleTestCases.map((testCase, index) => (
                      <div key={index} className="bg-gray-900 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Input: </span>
                            <code className="bg-gray-800 px-2 py-1 rounded">{testCase.input}</code>
                          </div>
                          <div>
                            <span className="text-gray-400">Output: </span>
                            <code className="bg-gray-800 px-2 py-1 rounded">{testCase.output}</code>
                          </div>
                          {testCase.explaination && (
                            <div>
                              <span className="text-gray-400">Explanation: </span>
                              <span>{testCase.explaination}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Acceptance Rate */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Accepted</span>
                    <span className="text-gray-400">Acceptance Rate</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">10,158 <span className="text-gray-400 text-sm">/35.2K</span></span>
                    <span className="font-semibold">28.9%</span>
                  </div>
                </div>

                {/* Expandable Sections */}
                <div className="space-y-2">
                  {/* Topics */}
                  <div className="border border-gray-700 rounded-lg">
                    <button
                      onClick={() => toggleSection('topics')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Tag size={16} />
                        <span>Topics</span>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className={`transition-transform ${expandedSections.topics ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {expandedSections.topics && (
                      <div className="px-4 pb-4">
                        <div className="flex flex-wrap gap-2">
                          {problem.tags?.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-700 rounded text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Companies */}
                  {problem.companies && problem.companies.length > 0 && (
                    <div className="border border-gray-700 rounded-lg">
                      <button
                        onClick={() => toggleSection('companies')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 size={16} />
                          <span>Companies</span>
                        </div>
                        <ChevronRight 
                          size={16} 
                          className={`transition-transform ${expandedSections.companies ? 'rotate-90' : ''}`}
                        />
                      </button>
                      {expandedSections.companies && (
                        <div className="px-4 pb-4">
                          <div className="flex flex-wrap gap-2">
                            {problem.companies.map((company, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-700 rounded text-sm"
                              >
                                {company}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hints */}
                  <div className="border border-gray-700 rounded-lg">
                    <button
                      onClick={() => toggleSection('hints')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb size={16} />
                        <span>Hint 1</span>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className={`transition-transform ${expandedSections.hints ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {expandedSections.hints && (
                      <div className="px-4 pb-4">
                        <p className="text-gray-300">
                          Think about using dynamic programming or mathematical approach to solve this efficiently.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Similar Questions */}
                  <div className="border border-gray-700 rounded-lg">
                    <button
                      onClick={() => toggleSection('similar')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} />
                        <span>Similar Questions</span>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className={`transition-transform ${expandedSections.similar ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {expandedSections.similar && (
                      <div className="px-4 pb-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                              Two Sum
                            </span>
                            <span className="text-green-500 text-sm">Easy</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                              Three Sum
                            </span>
                            <span className="text-yellow-500 text-sm">Medium</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          className="w-1 bg-gray-700 cursor-col-resize hover:bg-gray-600 transition-colors"
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startWidth = leftPanelWidth;
            
            const handleMouseMove = (e) => {
              const diff = ((e.clientX - startX) / window.innerWidth) * 100;
              const newWidth = Math.max(30, Math.min(70, startWidth + diff));
              setLeftPanelWidth(newWidth);
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Right Panel - Code Editor */}
        <div 
          className="bg-gray-900 flex flex-col"
          style={{ width: `${100 - leftPanelWidth}%` }}
        >
          {/* Code Editor Header */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">Code</span>
              
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-orange-500 focus:outline-none"
              >
                {problem.startCode?.map((sc) => (
                  <option key={sc.language} value={sc.language}>
                    {getLanguageDisplay(sc.language)}
                  </option>
                ))}
              </select>
              
              <span className="text-gray-400 text-sm">Auto</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <RotateCcw size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Copy size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-gray-900 text-white p-4 font-mono resize-none focus:outline-none"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
              placeholder="Write your code here..."
              spellCheck={false}
            />
            
            {/* Line numbers could be added here */}
            <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
              Ln 1, Col 1
            </div>
          </div>

          {/* Bottom Panel - Test Cases */}
          <div className="bg-gray-800 border-t border-gray-700">
            {/* Test Case Tabs */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('testcase')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'testcase'
                      ? 'text-white border-b-2 border-orange-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Testcase
                </button>
                <button
                  onClick={() => setActiveTab('result')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'result'
                      ? 'text-white border-b-2 border-orange-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Test Result
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || !code.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={16} />
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                
                <button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting || !code.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>

            {/* Test Case Content */}
            <div className="p-4 h-48 overflow-y-auto">
              {activeTab === 'testcase' && (
                <div>
                  {/* Test Case Selector */}
                  {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {problem.visibleTestCases.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTestCase(index)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            selectedTestCase === index
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Case {index + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected Test Case */}
                  {problem.visibleTestCases && problem.visibleTestCases[selectedTestCase] && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Input:</label>
                        <div className="bg-gray-900 p-3 rounded font-mono text-sm">
                          {problem.visibleTestCases[selectedTestCase].input}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Expected Output:</label>
                        <div className="bg-gray-900 p-3 rounded font-mono text-sm">
                          {problem.visibleTestCases[selectedTestCase].output}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'result' && (
                <div>
                  {testResults ? (
                    <div className="space-y-4">
                      {testResults.error ? (
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle size={16} />
                          <span>Runtime Error</span>
                        </div>
                      ) : testResults.isSubmission ? (
                        <div className="space-y-3">
                          <div className={`flex items-center gap-2 ${testResults.accepted ? 'text-green-400' : 'text-red-400'}`}>
                            {testResults.accepted ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            <span className="font-medium">
                              {testResults.accepted ? 'Accepted' : 'Wrong Answer'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Test Cases Passed:</span>
                              <div className="font-mono">
                                {testResults.passedTestCases}/{testResults.totalTestCases}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Runtime:</span>
                              <div className="font-mono">{testResults.runtime?.toFixed(2)}ms</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className={`flex items-center gap-2 ${testResults.success ? 'text-green-400' : 'text-red-400'}`}>
                            {testResults.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            <span className="font-medium">
                              {testResults.success ? 'All test cases passed' : 'Some test cases failed'}
                            </span>
                          </div>
                          
                          {testResults.testCases && (
                            <div className="space-y-2">
                              {testResults.testCases.map((result, index) => (
                                <div key={index} className="bg-gray-900 p-3 rounded">
                                  <div className={`flex items-center gap-2 mb-2 ${result.status_id === 3 ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.status_id === 3 ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    <span className="text-sm font-medium">
                                      Test Case {index + 1}
                                    </span>
                                  </div>
                                  
                                  {result.status_id !== 3 && result.stderr && (
                                    <div className="text-red-400 text-sm font-mono">
                                      {result.stderr}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {testResults.error && (
                        <div className="bg-red-900/20 border border-red-700 p-3 rounded">
                          <div className="text-red-400 text-sm font-mono">
                            {testResults.error}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      Run your code to see the results here
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolvePage;