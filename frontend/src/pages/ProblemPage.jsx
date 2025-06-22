import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Landing/Navbar';

function ProblemPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all problems
        const problemsResponse = await axiosClient.get('/problem/getAllProblem');
        setProblems(problemsResponse.data);
        
        // Fetch solved problems only if user is authenticated
        if (isAuthenticated && user) {
          try {
            const solvedResponse = await axiosClient.get('/problem/problemSolvedByUser');
            setSolvedProblems(solvedResponse.data);
          } catch (solvedError) {
            console.error('Error fetching solved problems:', solvedError);
          }
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    
    // For status filter, check if the problem is solved by the user
    let statusMatch = true;
    if (filters.status === 'solved') {
      statusMatch = solvedProblems.some((sp) => sp._id === problem._id);
    } else if (filters.status === 'unsolved') {
      statusMatch = !solvedProblems.some((sp) => sp._id === problem._id);
    }
    
    return difficultyMatch && tagMatch && statusMatch;
  });

  // Function to get badge color based on difficulty
  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-start mb-6">
          <select
            className="select select-bordered bg-white/10 text-white border-white/20 backdrop-blur"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
            <option value="unsolved">Unsolved Problems</option>
          </select>

          <select
            className="select select-bordered bg-white/10 text-white border-white/20 backdrop-blur"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered bg-white/10 text-white border-white/20 backdrop-blur"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">All Tags</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
            <option value="tree">Tree</option>
            <option value="string">String</option>
            <option value="hashTable">Hash Table</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center mt-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="alert alert-error max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* No Problems Found */}
        {!loading && !error && filteredProblems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl">No problems found matching your filters</p>
            <button 
              className="btn btn-primary mt-4"
              onClick={() => setFilters({ difficulty: 'all', tag: 'all', status: 'all' })}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Problem Cards */}
        {!loading && !error && filteredProblems.length > 0 && (
          <div className="grid gap-5">
            {filteredProblems.map((problem) => (
              <div
                key={problem._id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-5 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold hover:text-primary transition">
                    <NavLink to={`/problem/${problem._id}`}>
                      {problem.title}
                    </NavLink>
                  </h3>
                  {solvedProblems.some((sp) => sp._id === problem._id) && (
                    <div className="badge badge-success gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)} capitalize`}>
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info capitalize">
                    {problem.tags}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemPage;