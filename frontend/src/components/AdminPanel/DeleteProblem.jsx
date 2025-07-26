import { useEffect, useState } from 'react';
import axiosClient from '../../utils/axiosClient';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Landing/Navbar';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
  Home,
  Lightbulb
} from 'lucide-react';

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, problemTitle, isLoading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl" />

            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <AlertTriangle className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="text-center">
              <motion.h3
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Delete Problem
              </motion.h3>

              <motion.div
                className="text-gray-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="mb-3">Are you sure you want to delete this problem?</p>
                <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <p className="text-orange-400 font-semibold text-sm break-words">
                    "{problemTitle}"
                  </p>
                </div>
                <p className="text-red-400 text-sm mt-3 font-medium">
                  This action cannot be undone!
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex gap-4 justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </motion.div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, problemTitle }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-gradient-to-br from-green-900/90 to-green-800/90 border border-green-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl" />

            {/* Success animation */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="text-center">
              <motion.h3
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Problem Deleted Successfully!
              </motion.h3>

              <motion.div
                className="text-green-100 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="mb-3">The problem has been permanently deleted.</p>
                <div className="bg-green-800/30 p-3 rounded-lg border border-green-600/30">
                  <p className="text-green-200 font-medium text-sm break-words">
                    "{problemTitle}"
                  </p>
                </div>
              </motion.div>

              <motion.button
                onClick={onClose}
                className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Error Modal Component
const ErrorModal = ({ isOpen, onClose, errorMessage }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-gradient-to-br from-red-900/90 to-red-800/90 border border-red-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl" />

            {/* Error icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <X className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="text-center">
              <motion.h3
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Delete Failed
              </motion.h3>

              <motion.div
                className="text-red-100 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="mb-3">Failed to delete the problem.</p>
                <div className="bg-red-800/30 p-3 rounded-lg border border-red-600/30">
                  <p className="text-red-200 text-sm">
                    {errorMessage || 'An unexpected error occurred. Please try again.'}
                  </p>
                </div>
              </motion.div>

              <motion.button
                onClick={onClose}
                className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DeleteProblem = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  
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

  const handleDeleteClick = (problem) => {
    setSelectedProblem(problem);
    setShowConfirmModal(true);
  };

  const handleConfirmedDelete = async () => {
    if (!selectedProblem) return;
    
    setDeleteLoading(true);
    setDeleteError('');
    
    try {
      await axiosClient.delete(`/problem/delete/${selectedProblem._id}`);
      
      // Remove from problems list
      setProblems(problems.filter(problem => problem._id !== selectedProblem._id));
      
      // Close confirmation modal and show success modal
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err.response?.data?.message || err.message || 'Failed to delete problem');
      setShowConfirmModal(false);
      setShowErrorModal(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedProblem(null);
    setDeleteError('');
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedProblem(null);
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
    setSelectedProblem(null);
    setDeleteError('');
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
      )) ||
      problem.difficulty.toLowerCase().includes(searchLower)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            onClick={() => navigate('/admin')}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-orange-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-orange-400" />
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-2">
              Problem Manager
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Manage and delete coding problems. Search by title, tags, or difficulty.
            </p>
          </motion.div>

          <motion.button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={16} />
            <span className="hidden sm:inline">Back to Admin</span>
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search problems by title, tags, or difficulty..."
              className="w-full py-3 pl-12 pr-12 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-200 placeholder-gray-500 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {searchTerm ? (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/30">
              Showing <span className="text-red-400 font-bold">{filteredProblems.length}</span> of <span className="text-amber-500 font-bold">{problems.length}</span> problems
            </div>
            {searchTerm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-400"
              >
                Searching for: <span className="text-red-400">{debouncedSearchTerm}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Problems Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden shadow-2xl"
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
                        className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
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
                              <Lightbulb className="h-5 w-5 text-orange-500" />
                            </motion.div>
                            <div>
                              <div className="font-medium text-white">{problem.title}</div>
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
                            onClick={() => handleDeleteClick(problem)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-lg"
                            title="Delete problem"
                          >
                            <Trash2 size={14} />
                            Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-700/50"
                    >
                      <td colSpan="5" className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <Search className="h-16 w-16 text-gray-500 mb-4" />
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
                    : 'bg-gray-800 hover:bg-red-900/30 text-red-400 border border-red-500/30 transition-colors'
                }`}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
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
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg'
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentPage === totalPages
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg'
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
                    : 'bg-gray-800 hover:bg-red-900/30 text-red-400 border border-red-500/30 transition-colors'
                }`}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmedDelete}
        problemTitle={selectedProblem?.title || ''}
        isLoading={deleteLoading}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        problemTitle={selectedProblem?.title || ''}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={handleErrorClose}
        errorMessage={deleteError}
      />
    </div>
  );
};

export default DeleteProblem;
