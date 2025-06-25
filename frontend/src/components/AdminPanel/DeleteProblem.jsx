import { useEffect, useState } from 'react';
import axiosClient from '../../utils/axiosClient';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Landing/navbar';

const DeleteProblem = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const itemsPerPage = 15;

  // Fetch all problems on mount
  useEffect(() => {
    fetchProblems();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  // Filter problems based on search term
  const filteredProblems = problems.filter(problem => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      problem.title.toLowerCase().includes(searchLower) ||
      (problem.tags && 
        (Array.isArray(problem.tags) 
          ? problem.tags.some(tag => tag.toLowerCase().includes(searchLower))
          : problem.tags.toLowerCase().includes(searchLower)
      ) ||
      problem.difficulty.toLowerCase().includes(searchLower)
    )

    );
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.2 }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 border-4 border-orange-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="alert alert-error shadow-lg my-4 max-w-4xl mx-auto bg-red-900 text-red-100 border border-red-800"
      >
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 py-8 px-4"
    style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-2">
            Problem Manager
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage and delete coding problems. Search by title, tags, or difficulty.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search problems by title, tags, or difficulty..."
              className="w-full py-3 px-6 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-200 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {searchTerm ? (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="p-1 rounded-full hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm  px-4 py-2 rounded-lg border border-gray-700">
              Showing <span className="text-orange-400 font-bold">{filteredProblems.length}</span> of <span className="text-amber-500 font-bold">{problems.length}</span> problems
            </div>
            {searchTerm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-400"
              >
                Searching for: <span className="text-orange-400">{debouncedSearchTerm}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Problems Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="py-4 text-center w-12">#</th>
                  <th className="py-4">Title</th>
                  <th className="py-4 w-32">Difficulty</th>
                  <th className="py-4 w-56">Tags</th>
                  <th className="py-4 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {currentProblems.length > 0 ? (
                    currentProblems.map((problem, index) => (
                      <motion.tr
                        key={problem._id}
                        variants={itemVariants}
                        exit="exit"
                        className="border-b border-gray-700/50 hover:bg-gray-800/30"
                      >
                        <th className="text-center text-gray-400 font-normal">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </th>
                        <td className="font-medium">
                          <div className="flex items-center">
                            <motion.div 
                              whileHover={{ rotate: 10 }}
                              className="bg-gray-700 border border-gray-600 rounded-lg w-10 h-10 flex items-center justify-center mr-3"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </motion.div>
                            <div>
                              <div className="font-medium">{problem.title}</div>
                              <div className="text-xs text-gray-400">ID: {problem._id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className={`inline-block py-1 px-3 rounded-full text-sm font-bold ${
                              problem.difficulty === 'easy' 
                                ? 'bg-green-900/30 text-green-300 border border-green-800' 
                                : problem.difficulty === 'medium' 
                                  ? 'bg-amber-900/30 text-amber-300 border border-amber-800' 
                                  : 'bg-red-900/30 text-red-300 border border-red-800'
                            }`}
                          >
                            {problem.difficulty}
                          </motion.span>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {(Array.isArray(problem.tags) ? problem.tags : [problem.tags]).map((tag, i) => (
                              <motion.span 
                                key={i}
                                whileHover={{ y: -2 }}
                                className="text-xs py-1 px-3 rounded-full bg-gray-900/50 border border-orange-900 text-orange-300"
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        </td>
                        <td className="text-center">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(problem._id)}
                            className="bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-red-100 py-1.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center"
                            title="Delete problem"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-700/50 hover:bg-gray-800/30"
                    >
                      <td colSpan="5" className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="text-lg text-gray-400">No problems found</h3>
                          <p className="text-gray-500 mt-1">
                            {debouncedSearchTerm 
                              ? `No matches for "${debouncedSearchTerm}"`
                              : 'No problems available'}
                          </p>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8"
          >
            <div className="flex items-center space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg flex items-center ${
                  currentPage === 1 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-800 hover:bg-orange-900/30 text-orange-400 border border-orange-500/30'
                }`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentPage === totalPages
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </motion.button>
              )}
              
              <button 
                className={`px-4 py-2 rounded-lg flex items-center ${
                  currentPage === totalPages 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-800 hover:bg-orange-900/30 text-orange-400 border border-orange-500/30'
                }`}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DeleteProblem;