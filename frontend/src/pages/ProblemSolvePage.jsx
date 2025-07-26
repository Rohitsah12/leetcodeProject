import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
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
        console.log('Problem data:', response.data);
        setProblem(response.data);
        
        // Set initial language
        const availableLanguages = response.data.startCode?.map(sc => sc.language) || [];
        const defaultLang = availableLanguages.includes('JavaScript') ? 'JavaScript' : 
                           availableLanguages.includes('Java') ? 'Java' : 
                           availableLanguages.includes('C++') ? 'C++' : 
                           availableLanguages[0] || 'JavaScript';
        
        setSelectedLanguage(defaultLang);
        
        // Set initial code
        const initialCode = response.data.startCode?.find(
          sc => sc.language === defaultLang
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
  }, [id]);

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
    setActiveTab('result');
    
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
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  // Get language display name
  const getLanguageDisplay = (lang) => {
    const langMap = {
      'JavaScript': 'JavaScript',
      'C++': 'C++',
      'Java': 'Java'
    };
    return langMap[lang] || lang;
  };

  // Enhanced markdown components with proper styling
  const MarkdownRenderer = ({ content }) => {
    if (!content) return null;

    const components = {
      h1: ({ children }) => (
        <h1 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-gray-600">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl font-bold text-white mb-4 mt-8">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl font-semibold text-white mb-3 mt-6">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-lg font-semibold text-white mb-2 mt-4">
          {children}
        </h4>
      ),
      p: ({ children }) => (
        <p className="text-gray-300 mb-4 leading-relaxed">
          {children}
        </p>
      ),
      strong: ({ children }) => (
        <strong className="text-white font-bold">
          {children}
        </strong>
      ),
      em: ({ children }) => (
        <em className="text-orange-300 italic">
          {children}
        </em>
      ),
      code: ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');
        
        return !inline && match ? (
          <div className="my-4">
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              className="rounded-lg text-sm"
              customStyle={{
                background: '#1f2937',
                border: '1px solid #374151',
                margin: 0
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code 
            className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-sm font-mono border border-orange-500/30"
            {...props}
          >
            {children}
          </code>
        );
      },
      pre: ({ children }) => {
        // Check if this pre contains a code block
        const codeChild = React.Children.toArray(children).find(
          child => child?.props?.className?.includes('language-')
        );
        
        if (codeChild) {
          return <>{children}</>;
        }
        
        return (
          <pre className="bg-gray-800 border border-gray-600 rounded-lg p-4 overflow-x-auto my-4 font-mono text-sm text-gray-200">
            {children}
          </pre>
        );
      },
      ul: ({ children }) => (
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2 ml-4">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2 ml-4">
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li className="text-gray-300 leading-relaxed">
          {children}
        </li>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-orange-400 bg-orange-400/5 pl-6 py-3 italic text-gray-300 my-4 rounded-r">
          {children}
        </blockquote>
      ),
      table: ({ children }) => (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border border-gray-600 rounded-lg">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className="bg-gray-800">
          {children}
        </thead>
      ),
      tbody: ({ children }) => (
        <tbody>
          {children}
        </tbody>
      ),
      tr: ({ children }) => (
        <tr className="border-b border-gray-600">
          {children}
        </tr>
      ),
      th: ({ children }) => (
        <th className="px-4 py-3 text-left text-white font-semibold">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-4 py-3 text-gray-300">
          {children}
        </td>
      ),
      hr: () => (
        <hr className="border-gray-600 my-6" />
      )
    };

    return (
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
          className="prose prose-invert max-w-none"
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          <span className="text-white text-lg">Loading problem...</span>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle size={48} className="text-red-400 mx-auto mb-4" />
          <div className="text-red-400 text-lg">{error || 'Problem not found'}</div>
          <button 
            onClick={() => navigate('/problemset')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Back to Problems
          </button>
        </div>
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
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty?.charAt(0).toUpperCase() + problem.difficulty?.slice(1)}
                    </span>
                    
                    <div className="flex items-center gap-3 text-gray-400">
                      <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                        <ThumbsUp size={16} />
                        <span className="text-sm">177</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                        <ThumbsDown size={16} />
                        <span className="text-sm">40</span>
                      </button>
                      <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                        <Star size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Problem Description - Enhanced Markdown Rendering */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <MarkdownRenderer content={problem.description} />
                </div>

                {/* Examples Section */}
                {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-orange-400 border-b border-gray-600 pb-2">
                      Examples
                    </h3>
                    {problem.visibleTestCases.map((testCase, index) => (
                      <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                        <h4 className="font-bold mb-4 text-orange-300 text-lg">Example {index + 1}:</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-400 font-semibold mb-2">Input:</label>
                            <pre className="bg-gray-800 border border-gray-600 px-4 py-3 rounded-lg font-mono text-sm text-gray-200 whitespace-pre-wrap">
                              {testCase.input}
                            </pre>
                          </div>
                          <div>
                            <label className="block text-gray-400 font-semibold mb-2">Output:</label>
                            <pre className="bg-gray-800 border border-gray-600 px-4 py-3 rounded-lg font-mono text-sm text-gray-200">
                              {testCase.output}
                            </pre>
                          </div>
                          {(testCase.explanation || testCase.explaination) && (
                            <div>
                              <label className="block text-gray-400 font-semibold mb-2">Explanation:</label>
                              <div className="bg-gray-800/50 border border-gray-600 px-4 py-3 rounded-lg">
                                <p className="text-gray-300 leading-relaxed">
                                  {testCase.explanation || testCase.explaination}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                    <h4 className="font-bold mb-4 text-orange-400 text-lg">Constraints:</h4>
                    <ul className="space-y-3">
                      {problem.constraints.map((constraint, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-orange-400 mt-1">•</span>
                          <code className="bg-gray-800 border border-gray-600 px-3 py-2 rounded font-mono text-sm flex-1">
                            {constraint}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Acceptance Rate */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                  <h4 className="font-bold mb-4 text-orange-400">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Accepted</div>
                      <div className="text-white font-semibold">
                        4,158,421 <span className="text-gray-400 text-sm font-normal">/8.2M</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Acceptance Rate</div>
                      <div className="text-white font-semibold">50.6%</div>
                    </div>
                  </div>
                </div>

                {/* Expandable Sections */}
                <div className="space-y-3">
                  {/* Topics */}
                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('topics')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Tag size={18} className="text-orange-400" />
                        <span className="font-medium">Topics</span>
                      </div>
                      <ChevronRight 
                        size={18} 
                        className={`transition-transform ${expandedSections.topics ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {expandedSections.topics && (
                      <div className="px-4 pb-4 bg-gray-700/20">
                        <div className="flex flex-wrap gap-2">
                          {problem.tags?.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-2 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full text-sm font-medium"
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
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection('companies')}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 size={18} className="text-purple-400" />
                          <span className="font-medium">Companies</span>
                        </div>
                        <ChevronRight 
                          size={18} 
                          className={`transition-transform ${expandedSections.companies ? 'rotate-90' : ''}`}
                        />
                      </button>
                      {expandedSections.companies && (
                        <div className="px-4 pb-4 bg-gray-700/20">
                          <div className="flex flex-wrap gap-2">
                            {problem.companies.map((company, index) => (
                              <span
                                key={index}
                                className="px-3 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-sm font-medium"
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
                  {problem.hints && problem.hints.length > 0 && (
                    <div className="space-y-2">
                      {problem.hints.map((hint, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection(`hint-${index}`)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Lightbulb size={18} className="text-yellow-400" />
                              <span className="font-medium">Hint {index + 1}</span>
                            </div>
                            <ChevronRight 
                              size={18} 
                              className={`transition-transform ${expandedSections[`hint-${index}`] ? 'rotate-90' : ''}`}
                            />
                          </button>
                          {expandedSections[`hint-${index}`] && (
                            <div className="px-4 pb-4 bg-gray-700/20">
                              <p className="text-gray-300 leading-relaxed">
                                {hint}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Similar Questions */}
                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection('similar')}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MessageCircle size={18} className="text-blue-400" />
                        <span className="font-medium">Similar Questions</span>
                      </div>
                      <ChevronRight 
                        size={18} 
                        className={`transition-transform ${expandedSections.similar ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {expandedSections.similar && (
                      <div className="px-4 pb-4 bg-gray-700/20">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                            <span className="text-blue-400 hover:text-blue-300">
                              Add Two Numbers
                            </span>
                            <span className="text-yellow-400 text-sm px-2 py-1 bg-yellow-400/10 rounded">
                              Medium
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                            <span className="text-blue-400 hover:text-blue-300">
                              Three Sum
                            </span>
                            <span className="text-yellow-400 text-sm px-2 py-1 bg-yellow-400/10 rounded">
                              Medium
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content */}
            {activeDescriptionTab === 'editorial' && (
              <div className="text-center py-16 text-gray-400">
                <div className="space-y-4">
                  <AlertCircle size={48} className="mx-auto opacity-50" />
                  <h3 className="text-xl font-medium">Editorial Coming Soon</h3>
                  <p>The editorial for this problem will be available soon.</p>
                </div>
              </div>
            )}

            {activeDescriptionTab === 'solutions' && (
              <div className="text-center py-16 text-gray-400">
                <div className="space-y-4">
                  <MessageCircle size={48} className="mx-auto opacity-50" />
                  <h3 className="text-xl font-medium">Community Solutions</h3>
                  <p>Community solutions will be displayed here.</p>
                </div>
              </div>
            )}

            {activeDescriptionTab === 'submissions' && (
              <div className="text-center py-16 text-gray-400">
                <div className="space-y-4">
                  <Clock size={48} className="mx-auto opacity-50" />
                  <h3 className="text-xl font-medium">Your Submissions</h3>
                  <p>Your submission history will appear here.</p>
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
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-orange-500 focus:outline-none"
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
              <button 
                onClick={() => {
                  const initialCode = problem?.startCode?.find(
                    sc => sc.language === selectedLanguage
                  )?.initialCode || '';
                  setCode(initialCode);
                }}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Reset to initial code"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(code);
                }}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Copy code"
              >
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
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
              placeholder="Write your code here..."
              spellCheck={false}
            />
            
            {/* Status indicator */}
            <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
              Ln 1, Col 1
            </div>
          </div>

          {/* Bottom Panel - Test Cases */}
          <div className="bg-gray-800 border-t border-gray-700">
            {/* Test Case Tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
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

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning || !code.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={16} />
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                
                <button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting || !code.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>

            {/* Test Case Content */}
            <div className="p-4 h-56 overflow-y-auto">
              {activeTab === 'testcase' && (
                <div>
                  {/* Test Case Selector */}
                  {problem.visibleTestCases && problem.visibleTestCases.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {problem.visibleTestCases.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTestCase(index)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 font-medium text-sm mb-2">Input:</label>
                        <div className="bg-gray-900 border border-gray-600 p-3 rounded-lg font-mono text-sm whitespace-pre-wrap">
                          {problem.visibleTestCases[selectedTestCase].input}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 font-medium text-sm mb-2">Expected Output:</label>
                        <div className="bg-gray-900 border border-gray-600 p-3 rounded-lg font-mono text-sm">
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
                          <span className="font-medium">Runtime Error</span>
                        </div>
                      ) : testResults.isSubmission ? (
                        <div className="space-y-4">
                          <div className={`flex items-center gap-2 ${testResults.accepted ? 'text-green-400' : 'text-red-400'}`}>
                            {testResults.accepted ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            <span className="font-bold text-lg">
                              {testResults.accepted ? 'Accepted' : 'Wrong Answer'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-900 p-3 rounded-lg">
                              <div className="text-gray-400 mb-1">Test Cases Passed</div>
                              <div className="font-mono text-lg font-bold">
                                {testResults.passedTestCases}/{testResults.totalTestCases}
                              </div>
                            </div>
                            <div className="bg-gray-900 p-3 rounded-lg">
                              <div className="text-gray-400 mb-1">Runtime</div>
                              <div className="font-mono text-lg font-bold">
                                {testResults.runtime?.toFixed(2)}ms
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className={`flex items-center gap-2 ${testResults.success ? 'text-green-400' : 'text-red-400'}`}>
                            {testResults.success ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            <span className="font-bold text-lg">
                              {testResults.success ? 'All test cases passed!' : 'Some test cases failed'}
                            </span>
                          </div>
                          
                          {testResults.testCases && (
                            <div className="space-y-2">
                              {testResults.testCases.map((result, index) => (
                                <div key={index} className="bg-gray-900 border border-gray-700 p-3 rounded-lg">
                                  <div className={`flex items-center gap-2 mb-2 ${result.status_id === 3 ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.status_id === 3 ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                    <span className="font-medium">
                                      Test Case {index + 1}
                                    </span>
                                  </div>
                                  
                                  {result.status_id !== 3 && result.stderr && (
                                    <div className="text-red-400 text-sm font-mono bg-red-900/20 p-2 rounded">
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
                        <div className="bg-red-900/20 border border-red-700 p-4 rounded-lg">
                          <div className="text-red-400 font-mono text-sm">
                            {testResults.error}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-12">
                      <div className="space-y-3">
                        <Play size={32} className="mx-auto opacity-50" />
                        <h3 className="text-lg font-medium">No Results Yet</h3>
                        <p>Run your code to see the results here</p>
                      </div>
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
