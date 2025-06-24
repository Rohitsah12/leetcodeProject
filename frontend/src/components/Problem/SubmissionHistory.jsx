import { useState, useEffect } from 'react';
import axiosClient from '../../utils/axiosClient';
import { FaEye } from 'react-icons/fa';

const SubmissionHistoryDark = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!problemId) return;
      try {
        const res = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        console.log(submissions);
        console.log(res.data);
        
        
       setSubmissions(Array.isArray(res.data) ? res.data : []);

      } catch (err) {
        console.error('Error fetching:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [problemId]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', { hour12: false });
  };

  const formatMemory = (mem) => {
    if (mem == null) return 'N/A';
    return mem < 1024 ? `${mem}KB` : `${(mem / 1024).toFixed(2)}MB`;
  };

  const formatRuntime = (time) => {
    return time != null ? `${time}ms` : 'N/A';
  };

  return (
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
                <td colSpan="6" className="text-center py-4">Loading...</td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">No submissions found.</td>
              </tr>
            ) : (
              submissions.map((sub, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-700 hover:bg-[#1e1e1e] transition-colors"
                >
                  <td className="py-2 px-4">{formatDate(sub.createdAt)}</td>
                  <td className="py-2 px-4">
                    <span className="text-green-500">{sub.status || 'Unknown'}</span>
                  </td>
                  <td className="py-2 px-4 text-gray-300">{sub.language || 'N/A'}</td>
                  <td className="py-2 px-4">{formatRuntime(sub.runtime)}</td>
                  <td className="py-2 px-4">{formatMemory(sub.memory)}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => alert(sub.code || 'No code')}
                      className="text-yellow-400 hover:underline flex items-center gap-1"
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
  );
};

export default SubmissionHistoryDark;
