import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Homepage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const accessAdminPanel = () => {
    navigate('/admin');
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch =
      filters.status === 'all' ||
      (filters.status === 'solved' && solvedProblems.some((sp) => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Navbar */}
      <nav className="navbar bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4 shadow-md">
        <div className="flex-1">
          <NavLink to="/" className="text-xl font-bold tracking-wide text-white hover:text-primary">
            DooCode
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end z-10">
            <div tabIndex={0} className="btn btn-ghost text-white">
              {user?.firstName}
            </div>
            <ul className="mt-3 p-2 shadow menu dropdown-content rounded-box w-52 bg-white/10 backdrop-blur text-white border border-white/10">
              <li><button onClick={handleLogout}>Signout</button></li>
              {user?.role === 'admin' && (
                <li><NavLink to="/admin">Admin</NavLink></li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main */}
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
          </select>
        </div>

        {/* Problem Cards */}
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
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success';
    case 'medium': return 'badge-warning';
    case 'hard': return 'badge-error';
    default: return 'badge-neutral';
  }
};

export default Homepage;
