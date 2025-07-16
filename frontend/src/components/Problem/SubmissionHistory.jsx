import { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import { FaEye, FaTimes, FaCopy } from 'react-icons/fa';

const SubmissionHistoryDark = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!problemId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        console.log('API Response:', res.data);
        
        // Ensure we have an array of submissions
        setSubmissions(Array.isArray(res.data) ? res.data : []);
        
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError(err.response?.data?.message || 'Failed to fetch submissions');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [problemId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-IN', { 
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatMemory = (mem) => {
    if (mem == null || mem === undefined) return 'N/A';
    const memValue = Number(mem);
    if (isNaN(memValue)) return 'N/A';
    return memValue < 1024 ? `${memValue}KB` : `${(memValue / 1024).toFixed(2)}MB`;
  };

  const formatRuntime = (time) => {
    if (time == null || time === undefined) return 'N/A';
    const timeValue = Number(time);
    if (isNaN(timeValue)) return 'N/A';
    return `${timeValue}ms`;
  };

  const getStatusColor = (status) => {
    if (!status) return 'text-gray-400';
    
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'correct':
      case 'success':
        return 'text-green-500';
      case 'wrong answer':
      case 'incorrect':
        return 'text-red-500';
      case 'time limit exceeded':
      case 'tle':
        return 'text-yellow-500';
      case 'runtime error':
      case 'error':
        return 'text-orange-500';
      case 'compilation error':
        return 'text-purple-500';
      case 'memory limit exceeded':
      case 'mle':
        return 'text-blue-500';
      case 'pending':
      case 'running':
        return 'text-gray-300';
      default:
        return 'text-gray-400';
    }
  };

  const handleViewCode = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubmission(null);
    setCopied(false);
  };

  const handleCopyCode = async () => {
    if (selectedSubmission?.code) {
      try {
        await navigator.clipboard.writeText(selectedSubmission.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = selectedSubmission.code;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const renderCodeWithLineNumbers = (code) => {
    if (!code) return <div className="text-gray-400 p-4">No code available</div>;
    
    const lines = code.split('\n');
    const maxLineNumberWidth = String(lines.length).length;
    
    return (
      <div className="flex font-mono text-sm">
        {/* Line numbers */}
        <div className="bg-[#0d1117] text-gray-500 text-right pr-3 py-2 select-none border-r border-gray-700" 
             style={{ minWidth: `${maxLineNumberWidth * 0.6 + 1}rem` }}>
          {lines.map((_, index) => (
            <div key={index} className="leading-6 h-6">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Code content */}
        <div className="flex-1 bg-[#161b22] text-gray-300 pl-4 py-2 overflow-x-auto">
          {lines.map((line, index) => (
            <div key={index} className="leading-6 h-6 whitespace-pre">
              {line || ' '}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  return (
    <>
      <div className="w-full bg-[#111] text-white p-4 rounded-md">
        <div className="overflow-x-auto border-t border-yellow-500">
          <table className="min-w-full text-sm mt-1">
            <thead>
              <tr className="text-yellow-500 text-left border-b border-yellow-500">
                <th className="py-2 px-4">Time (IST)</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Lang</th>
                <th className="py-2 px-4">Runtime</th>
                <th className="py-2 px-4">Memory</th>
                <th className="py-2 px-4">Code</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                      <span className="ml-2">Loading submissions...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="text-red-400">
                      <div className="mb-2">Error: {error}</div>
                      <button 
                        onClick={() => window.location.reload()}
                        className="text-yellow-400 hover:underline text-sm"
                      >
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No submissions found for this problem.
                  </td>
                </tr>
              ) : (
                submissions.map((sub, i) => (
                  <tr
                    key={sub.id || i}
                    className="border-b border-gray-700 hover:bg-[#1e1e1e] transition-colors"
                  >
                    <td className="py-2 px-4">{formatDate(sub.createdAt || sub.submittedAt)}</td>
                    <td className="py-2 px-4">
                      <span className={getStatusColor(sub.status)}>{sub.status || 'Unknown'}</span>
                    </td>
                    <td className="py-2 px-4 text-gray-300">{sub.language || 'N/A'}</td>
                    <td className="py-2 px-4">{formatRuntime(sub.runtime || sub.executionTime)}</td>
                    <td className="py-2 px-4">{formatMemory(sub.memory || sub.memoryUsed)}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleViewCode(sub)}
                        className="text-yellow-400 hover:text-yellow-300 hover:underline flex items-center gap-1 transition-colors"
                        disabled={!sub.code}
                      >
                        <FaEye />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedSubmission && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-[#0d1117] border border-gray-700 rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-white text-lg font-semibold">Submission Code</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className={getStatusColor(selectedSubmission.status)}>
                    {selectedSubmission.status || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Language:</span>
                  <span className="text-yellow-400">{selectedSubmission.language || 'N/A'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-gray-800"
                  title="Copy code"
                  disabled={!selectedSubmission.code}
                >
                  <FaCopy />
                </button>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded hover:bg-gray-800"
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto">
              {renderCodeWithLineNumbers(selectedSubmission.code)}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-700 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                <span>Runtime: {formatRuntime(selectedSubmission.runtime || selectedSubmission.executionTime)}</span>
                <span>Memory: {formatMemory(selectedSubmission.memory || selectedSubmission.memoryUsed)}</span>
                <span>Submitted: {formatDate(selectedSubmission.createdAt || selectedSubmission.submittedAt)}</span>
              </div>
              {copied && (
                <div className="text-green-400 text-sm animate-pulse">
                  ✓ Code copied to clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmissionHistoryDark;