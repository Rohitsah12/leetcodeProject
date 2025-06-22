import React, { useEffect, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Landing/Navbar';
import debounce from 'lodash.debounce';
import { Funnel, X } from 'lucide-react';

function ProblemPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [companies, setCompanies] = useState([]);
  const [topics, setTopics] = useState([]);
  const [showCompaniesModal, setShowCompaniesModal] = useState(false);
  const [showTopicsModal, setShowTopicsModal] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [topicSearch, setTopicSearch] = useState('');
  
  // Initialize filters with proper structure
  const initialFilters = {
    difficulty: [],
    status: [],
    company: [],
    topic: []
  };
  
  const [filters, setFilters] = useState(initialFilters);

  const difficulties = ['easy', 'medium', 'hard'];
  const statuses = ['solved', 'unsolved'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch problems, companies, and topics in parallel
        const [problemsResponse, companiesResponse, topicsResponse] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          axiosClient.get('/problem/getCompanies'),
          axiosClient.get('/problem/getTopics')
        ]);
        
        // Ensure problems have companies array
        const problemsWithCompanies = problemsResponse.data.map(problem => ({
          ...problem,
          companies: problem.companies || []
        }));
        
        setProblems(problemsWithCompanies);
        setCompanies(companiesResponse.data);
        setTopics(topicsResponse.data);

        if (isAuthenticated && user) {
          try {
            const solvedResponse = await axiosClient.get('/problem/problemSolvedByUser');
            const solvedIds = solvedResponse.data.map(problem => problem._id);
            setSolvedProblems(solvedIds);
          } catch (solvedError) {
            console.error('Error fetching solved problems:', solvedError);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const list = prev[type];
      return {
        ...prev,
        [type]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value]
      };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(initialFilters);
  };

  const filteredProblems = problems.filter((problem) => {
    // Handle difficulty filter
    const difficultyMatch = 
      filters.difficulty.length === 0 || 
      filters.difficulty.includes(problem.difficulty.toLowerCase());
    
    // Handle solved status
    const isSolved = solvedProblems.includes(problem._id);
    const statusMatch =
      filters.status.length === 0 ||
      (filters.status.includes('solved') && isSolved) ||
      (filters.status.includes('unsolved') && !isSolved);
    
    // Handle company filter
    const companyMatch =
      filters.company.length === 0 || 
      filters.company.some(comp => 
        problem.companies.map(c => c.toLowerCase()).includes(comp.toLowerCase())
      );
    
    // Handle topic filter
    const topicMatch =
      filters.topic.length === 0 || 
      filters.topic.some(tag => 
        problem.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
      );

    const searchMatch = problem.title.toLowerCase().includes(search.toLowerCase());

    return difficultyMatch && statusMatch && companyMatch && topicMatch && searchMatch;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (sortOrder === 'default') return 0;
    
    const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
    const aOrder = difficultyOrder[a.difficulty.toLowerCase()] || 0;
    const bOrder = difficultyOrder[b.difficulty.toLowerCase()] || 0;
    
    return aOrder - bOrder;
  });

  const getBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Get only first 6 companies and topics for display
  const visibleCompanies = companies.slice(0, 6);
  const visibleTopics = topics.slice(0, 6);

  // Calculate company counts and create searchable company list
  const companiesWithCounts = companies.map(company => {
    const count = problems.filter(problem => 
      problem.companies && problem.companies.some(c => c.toLowerCase() === company.toLowerCase())
    ).length;
    return { name: company, count };
  });

  // Calculate topic counts and create searchable topic list
  const topicsWithCounts = topics.map(topic => {
    const count = problems.filter(problem => 
      problem.tags && problem.tags.some(tag => tag.toLowerCase() === topic.toLowerCase())
    ).length;
    return { name: topic, count };
  });

  // Filter companies based on search
  const filteredCompanies = companiesWithCounts.filter(company =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  // Filter topics based on search
  const filteredTopics = topicsWithCounts.filter(topic =>
    topic.name.toLowerCase().includes(topicSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white" style={{ 
      backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }}>
      <Navbar />

      <div className='max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6'>
        {/* Filters */}
        <div className='w-full md:w-64 bg-black/30 p-4 rounded-xl h-fit overflow-y-auto max-h-[80vh]'>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 m-0">
              <Funnel style={{ color: 'orange' }} />
              Filters
            </h2>
            <button 
              onClick={clearAllFilters}
              className="text-lg hover:text-orange-500 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className='font-semibold'>Companies</h3>
              {companies.length > 6 && (
                <button 
                  onClick={() => setShowCompaniesModal(true)}
                  className="text-orange-500 text-sm hover:underline"
                >
                  Show all
                </button>
              )}
            </div>
            {visibleCompanies.length > 0 ? (
              visibleCompanies.map((company) => (
                <div key={company} className="mb-1">
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input 
                      type='checkbox' 
                      className='checkbox bg-gray-700 border-gray-600 focus:ring-orange-500 focus:ring-2' 
                      checked={filters.company.includes(company)} 
                      onChange={() => toggleFilter('company', company)} 
                    />
                    <span className="text-sm">{company}</span>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No companies available</p>
            )}
          </div>

          <div className='mt-4'>
            <div className="flex justify-between items-center mb-2">
              <h3 className='font-semibold'>Topics</h3>
              {topics.length > 6 && (
                <button 
                  onClick={() => setShowTopicsModal(true)}
                  className="text-orange-500 text-sm hover:underline"
                >
                  Show all
                </button>
              )}
            </div>
            {visibleTopics.length > 0 ? (
              visibleTopics.map((topic) => (
                <div key={topic} className="mb-1">
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input 
                      type='checkbox' 
                      className='checkbox bg-gray-700 border-gray-600 focus:ring-orange-500 focus:ring-2' 
                      checked={filters.topic.includes(topic)} 
                      onChange={() => toggleFilter('topic', topic)} 
                    />
                    <span className="text-sm">{capitalize(topic)}</span>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No topics available</p>
            )}
          </div>

          <div className='mt-4'>
            <h3 className='font-semibold mb-2'>Difficulty</h3>
            <div className="space-y-1">
              {difficulties.map((level) => (
                <div key={level} className="flex items-center">
                  <label className='flex items-center gap-2 cursor-pointer w-full'>
                    <input 
                      type='checkbox' 
                      className='checkbox bg-gray-700 border-gray-600 focus:ring-orange-500 focus:ring-2' 
                      checked={filters.difficulty.includes(level)} 
                      onChange={() => toggleFilter('difficulty', level)} 
                    />
                    <span className="text-sm flex-1">{capitalize(level)}</span>
                    <span className={`inline-block w-3 h-3 rounded-full ${getBadgeColor(level)}`}></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-4'>
            <h3 className='font-semibold mb-2'>Status</h3>
            <div className="space-y-1">
              {statuses.map((s) => (
                <div key={s} className="flex items-center">
                  <label className='flex items-center gap-2 cursor-pointer w-full'>
                    <input 
                      type='checkbox' 
                      className='checkbox bg-gray-700 border-gray-600 focus:ring-orange-500 focus:ring-2' 
                      checked={filters.status.includes(s)} 
                      onChange={() => toggleFilter('status', s)} 
                    />
                    <span className="text-sm flex-1">{capitalize(s)}</span>
                    <span className={`inline-block w-3 h-3 rounded-full ${s === 'solved' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Problem List */}
        <div className='flex-1'>
          <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
            <input 
              type='text' 
              placeholder='Search problems...' 
              className='input input-bordered w-full bg-black placeholder-gray-400 border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500' 
              onChange={handleSearchChange} 
            />
            <div className="flex gap-4 w-full md:w-auto">
              <select 
                className='select select-bordered w-full bg-black border-gray-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500' 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value='default'>Sort: Default</option>
                <option value='difficulty'>Sort by Difficulty</option>
              </select>
              <button 
                className="btn bg-black border-gray-700 hover:bg-gray-800 md:hidden"
                onClick={() => document.querySelector('.filters-section').classList.toggle('hidden')}
              >
                <Funnel size={18} color="orange" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div
                className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
                style={{ borderTopColor: '#FFA500', borderBottomColor: 'rgba(255, 165, 0, 0.2)' }}
              ></div>
              <p className="mt-4 text-gray-400">Loading problems...</p>
            </div>
          ) : error ? (
            <div className="alert bg-red-900/50 border border-red-700 shadow-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="ml-2">{error}</span>
                <button 
                  className="btn btn-sm bg-red-700 border-red-600 hover:bg-red-600 ml-4" 
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : problems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">No problems available</h3>
              <p className="text-gray-400 mt-2">There are no problems in the database yet</p>
            </div>
          ) : sortedProblems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold">No problems found</h3>
              <p className="text-gray-400 mt-2">Try changing your filters or search query</p>
              <button 
                className="btn mt-4 bg-black border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4'>
              {sortedProblems.map((problem) => (
                <div 
                  key={problem._id} 
                  className='border border-gray-700 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300 hover:border-orange-500'
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.7), rgba(60, 60, 60, 0.3))',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div className="flex-1">
                    <NavLink to={`/problem/${problem._id}`}
                      className="text-lg font-semibold transition-colors duration-200 cursor-pointer hover:text-orange-500"
                    >
                      {problem.title}
                    </NavLink>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {/* Companies */}
                      {problem.companies && problem.companies.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Companies:</span>
                          <div className="flex flex-wrap gap-1">
                            {problem.companies.slice(0, 3).map((company, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-700/50 rounded-full"
                              >
                                {company}
                              </span>
                            ))}
                            {problem.companies.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full">
                                +{problem.companies.length - 3} 
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {problem.tags && problem.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Topics:</span>
                          <div className="flex flex-wrap gap-1">
                            {problem.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-700/50 rounded-full"
                              >
                                {capitalize(tag)}
                              </span>
                            ))}
                            {problem.tags.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full">
                                +{problem.tags.length - 3} 
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                  
                  <div className='flex gap-4 items-center mt-3 md:mt-0'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(problem.difficulty)}`}>
                      {capitalize(problem.difficulty)}
                    </span>
                    
                    {isAuthenticated && (
                      <span className={`text-sm px-2 py-1 rounded ${solvedProblems.includes(problem._id) ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
                        {solvedProblems.includes(problem._id) ? 'Solved' : 'Unsolved'}
                      </span>
                    )}
                    
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="px-4 py-2 rounded transition-colors duration-200 flex items-center gap-1"
                      style={{
                        color: '#FFA500',
                        border: '1px solid #FFA500',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFA500';
                        e.currentTarget.style.color = 'black';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.color = '#FFA500';
                      }}
                    >
                      Solve
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Companies Modal */}
        {showCompaniesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#27272a]/80 backdrop-blur-md rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-[#3b3b3b]">
              <div className="sticky top-0 p-6 border-b border-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Select Companies</h3>
                  <button 
                    onClick={() => setShowCompaniesModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search select companies..."
                    className="w-full p-3 pl-10 border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-3 gap-4">
                  {filteredCompanies.map((company) => (
                    <div key={company.name} className="mb-2">
                      <label className='flex items-center gap-3 cursor-pointer text-white '>
                        <input 
                          type='checkbox' 
                          className='w-4 h-4 text-orange-500 border-white rounded focus:ring-orange-500 focus:ring-2' 
                          checked={filters.company.includes(company.name)} 
                          onChange={() => toggleFilter('company', company.name)} 
                        />
                        <span className="text-sm flex-1">{company.name} ({company.count})</span>
                      </label>
                    </div>
                  ))}
                </div>
                {filteredCompanies.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No companies found matching your search.
                  </div>
                )}
              </div>
              <div className="sticky bottom-0  p-2 border-t border-gray-700 flex justify-end gap-3">
                <button 
                  onClick={() => setShowCompaniesModal(false)}
                  className="px-6 py-1 m-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowCompaniesModal(false)}
                  className="px-6 py-1 m-1 bg-orange-500 text-black rounded hover:bg-orange-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Topics Modal */}
        {showTopicsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4  ">
            <div className="bg-[#27272a]/80 backdrop-blur-md rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto border border-[#3b3b3b]">
              <div className="sticky top-0 p-3 border-b border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Select Topics</h3>
                  <button 
                    onClick={() => setShowTopicsModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search select topics..."
                    className="w-full p-3 pl-10  border border-white rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    value={topicSearch}
                    onChange={(e) => setTopicSearch(e.target.value)}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-3 gap-3">
                  {filteredTopics.map((topic) => (
                    <div key={topic.name} className="mb-2">
                      <label className='flex items-center gap-3 cursor-pointer text-white hover:bg-gray-700  rounded'>
                        <input 
                          type='checkbox' 
                          className='w-4 h-4 text-orange-500  border-white  rounded focus:ring-orange-500 focus:ring-2' 
                          checked={filters.topic.includes(topic.name)} 
                          onChange={() => toggleFilter('topic', topic.name)} 
                        />
                        <span className="text-sm flex-1">{capitalize(topic.name)} ({topic.count})</span>
                      </label>
                    </div>
                  ))}
                </div>
                {filteredTopics.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No topics found matching your search.
                  </div>
                )}
              </div>
              <div className="sticky p-1 bottom-0 border-t border-gray-700 flex justify-end gap-3">
                <button 
                  onClick={() => setShowTopicsModal(false)}
                  className="px-6 m-1 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowTopicsModal(false)}
                  className="px-6 m-1 py-1 bg-orange-500 text-black rounded hover:bg-orange-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemPage;