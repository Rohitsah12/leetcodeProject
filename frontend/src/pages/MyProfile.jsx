import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { Flame, UserCircle, Calendar, CheckCircle, XCircle, Clock, Star, Trophy, Target, Zap, Award, TrendingUp, BarChart3 } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useParams } from 'react-router';

// Helper function to get local date string in YYYY-MM-DD format
const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MyProfile = () => {
  const { user: authUser } = useSelector(state => state.auth);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [heatmap, setHeatmap] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [problemStats, setProblemStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });
  const [loading, setLoading] = useState(true);
  const [apiErrors, setApiErrors] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setApiErrors({});

        const profileRes = await axiosClient.get(`/userProfile/profile/${id}`);
        setProfile(profileRes.data);
        console.log(profileRes.data);
        
        const problemSolvedIds = profileRes.data?.problemSolved || [];
        let problemStats = { total: 0, easy: 0, medium: 0, hard: 0 };

        if (problemSolvedIds.length > 0) {
          const problemsRes = await axiosClient.post('/problem/by-ids', {
            problemIds: problemSolvedIds
          });

          const solvedProblems = problemsRes.data || [];

          problemStats = {
            total: solvedProblems.length,
            easy: solvedProblems.filter(p => p.difficulty === 'easy').length,
            medium: solvedProblems.filter(p => p.difficulty === 'medium').length,
            hard: solvedProblems.filter(p => p.difficulty === 'hard').length
          };
        }

        setProblemStats(problemStats);

        const [heatmapRes, submissionsRes] = await Promise.allSettled([
          axiosClient.get('/userProfile/heatmap'),
          axiosClient.get('/userProfile/submissions')
        ]);

        if (heatmapRes.status === 'fulfilled') {
          setHeatmap(heatmapRes.value.data);
        } else {
          setApiErrors(prev => ({ ...prev, heatmap: 'Failed to load heatmap data' }));
        }

        if (submissionsRes.status === 'fulfilled') {
          setSubmissions(submissionsRes.value.data);
        } else {
          setApiErrors(prev => ({ ...prev, submissions: 'Failed to load submission history' }));
        }
      } catch (error) {
        setApiErrors(prev => ({ ...prev, profile: 'Failed to load profile data' }));
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchProfileData();
    }
  }, [authUser]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <span className="badge badge-success gap-1"><CheckCircle size={14} /> Accepted</span>;
      case 'pending': return <span className="badge badge-warning gap-1"><Clock size={14} /> Pending</span>;
      case 'wrong': return <span className="badge badge-error gap-1"><XCircle size={14} /> Wrong</span>;
      case 'error': return <span className="badge badge-error gap-1"><XCircle size={14} /> Error</span>;
      default: return <span className="badge badge-info gap-1">Unknown</span>;
    }
  };

  const heatmapValues = useMemo(() => {
    if (!heatmap || Object.keys(heatmap).length === 0) return [];
    
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);
    
    const values = [];
    const current = new Date(startDate);
    
    // Generate all dates using local timezone
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 1);
    
    while (current < endDate) {
      // Use local date string instead of ISO string
      const dateStr = getLocalDateString(current);
      const count = heatmap[dateStr] || 0;
      
      values.push({
        date: dateStr,
        count: count
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    // Also add any dates from heatmap that might be missing
    Object.keys(heatmap).forEach(dateKey => {
      let parsedDate;
      try {
        parsedDate = new Date(dateKey + 'T00:00:00'); // Parse as local time
        if (!isNaN(parsedDate.getTime()) && parsedDate >= startDate && parsedDate <= today) {
          const normalizedDateStr = getLocalDateString(parsedDate);
          
          // Check if we already have this date in our values
          const existingIndex = values.findIndex(v => v.date === normalizedDateStr);
          if (existingIndex >= 0) {
            // Update with the actual count from heatmap
            values[existingIndex].count = heatmap[dateKey];
          } else {
            // Add new entry
            values.push({
              date: normalizedDateStr,
              count: heatmap[dateKey]
            });
          }
        }
      } catch (e) {
        // Skip invalid date keys
      }
    });
    
    // Sort by date
    values.sort((a, b) => new Date(a.date + 'T00:00:00') - new Date(b.date + 'T00:00:00'));
    
    return values;
  }, [heatmap]);

  const getHeatmapClass = (value) => {
    if (!value || value.count === 0) return 'color-empty';
    if (value.count <= 2) return 'color-scale-1';
    if (value.count <= 4) return 'color-scale-2';
    if (value.count <= 6) return 'color-scale-3';
    return 'color-scale-4';
  };

  const codingScore = useMemo(() => {
    return problemStats.easy * 2 + problemStats.medium * 3 + problemStats.hard * 5;
  }, [problemStats]);

  // Calculate percentages for difficulty distribution
  const difficultyPercentages = useMemo(() => {
    if (problemStats.total === 0) return { easy: 0, medium: 0, hard: 0 };
    return {
      easy: Math.round((problemStats.easy / problemStats.total) * 100),
      medium: Math.round((problemStats.medium / problemStats.total) * 100),
      hard: Math.round((problemStats.hard / problemStats.total) * 100)
    };
  }, [problemStats]);

  // Get user rank based on total problems solved
  const getUserRank = (totalSolved) => {
    if (totalSolved >= 500) return { rank: 'Master', color: 'text-purple-400', icon: Trophy };
    if (totalSolved >= 200) return { rank: 'Expert', color: 'text-blue-400', icon: Award };
    if (totalSolved >= 100) return { rank: 'Advanced', color: 'text-green-400', icon: Target };
    if (totalSolved >= 50) return { rank: 'Intermediate', color: 'text-yellow-400', icon: Zap };
    return { rank: 'Beginner', color: 'text-orange-400', icon: Star };
  };

  const userRank = getUserRank(problemStats.total);
  const RankIcon = userRank.icon;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {profile ? (
          <div className="rounded-3xl p-8 mb-10 shadow-xl border border-orange-500">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-40 h-40 rounded-full border-4 border-orange-500 shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full border-4 border-orange-500 flex items-center justify-center bg-gray-800">
                    <UserCircle size={80} className="text-orange-500" />
                  </div>
                )}
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold text-orange-500 mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-300 mb-2">{profile.emailId}</p>
                
                {/* User Rank */}
                <div className="flex items-center justify-center md:justify-start mb-6">
                  <RankIcon className={`mr-2 ${userRank.color}`} size={20} />
                  <span className={`text-lg font-semibold ${userRank.color}`}>
                    {userRank.rank}
                  </span>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 min-w-[180px] border border-orange-500">
                    <div className="text-gray-300 mb-1 flex items-center justify-center">
                      <Flame className="mr-2 text-orange-500" size={18} /> Current Streak
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-orange-500">{profile.streak?.count || 0} days</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Last solved: {profile.streak?.lastStreakDate || 'New User'}
                    </div>
                  </div>

                  <div className="bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 min-w-[180px] border border-orange-500">
                    <div className="text-gray-300 mb-1 flex items-center justify-center">
                      <Star className="mr-2 text-orange-500" size={18} /> Coding Score
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-orange-500">{codingScore}</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Based on problem difficulty
                    </div>
                  </div>


                  <div className="bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 min-w-[180px] border border-green-500">
                    <div className="text-gray-300 mb-1 flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div> Easy
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-green-400">{problemStats.easy}</div>
                    </div>

                  </div>

                  <div className="bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 min-w-[180px] border border-yellow-500">
                    <div className="text-gray-300 mb-1 flex items-center justify-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div> Medium
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-yellow-400">{problemStats.medium}</div>
                    </div>

                  </div>

                  <div className="bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 min-w-[180px] border border-red-500">
                    <div className="text-gray-300 mb-1 flex items-center justify-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> Hard
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-red-400">{problemStats.hard}</div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 mb-10 shadow-xl border border-orange-500 text-center">
            <h1 className="text-2xl text-orange-500 mb-4">Profile Not Found</h1>
            <p className="text-gray-300">
              {apiErrors.profile || "We couldn't load your profile information"}
            </p>
          </div>
        )}



        {/* Heatmap Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-orange-500 border-b border-orange-500 pb-2 flex items-center">
            <Calendar className="mr-3" size={24} />
            Activity Heatmap
          </h2>
          <div className="rounded-2xl p-6 shadow-md border border-orange-500 ">
            {apiErrors.heatmap ? (
              <div className="text-center py-4 text-orange-300">
                <Calendar className="mx-auto mb-2" size={24} />
                <p>Error loading heatmap data</p>
                <p className="text-sm text-gray-400 mt-1">{apiErrors.heatmap}</p>
              </div>
            ) : heatmapValues.length === 0 ? (
              <div className="text-center py-4 text-orange-300">
                <Calendar className="mx-auto mb-2" size={24} />
                <p>No coding activity data available</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start solving problems to see your activity heatmap!
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <style>
                  {`
                    .react-calendar-heatmap .color-empty { fill: #1a1a1a; }
                    .react-calendar-heatmap .color-scale-1 { fill: #f97316; }
                    .react-calendar-heatmap .color-scale-2 { fill: #ea580c; }
                    .react-calendar-heatmap .color-scale-3 { fill: #c2410c; }
                    .react-calendar-heatmap .color-scale-4 { fill: #9a3412; }

                    .react-calendar-heatmap text {
                      fill: #a1a1aa;
                      font-size: 8px;
                    }

                    .react-calendar-heatmap .react-calendar-heatmap-small-text {
                      font-size: 6px;
                    }

                    .react-calendar-heatmap rect:hover {
                      stroke: #f97316;
                      stroke-width: 1px;
                    }
                  `}
                </style>

                <CalendarHeatmap
                  startDate={new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)}
                  endDate={new Date()}
                  values={heatmapValues}
                  classForValue={getHeatmapClass}
                  showWeekdayLabels={true}
                  gutterSize={1}
                  titleForValue={(value) => 
                    value && value.date 
                      ? `${new Date(value.date).toLocaleDateString()}: ${value.count} submission${value.count !== 1 ? 's' : ''}`
                      : 'No data'
                  }
                  tooltipDataAttrs={(value) => {
                    if (!value || !value.date) return {};
                    return {
                      'data-tip': `${new Date(value.date).toLocaleDateString()}: ${value.count} submission${value.count !== 1 ? 's' : ''}`,
                      'data-for': 'heatmap-tooltip'
                    };
                  }}
                />

                <div className="flex justify-between text-xs text-gray-400 mt-4">
                  <div>Less</div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-900 m-1 border border-orange-500"></div>
                    <div className="w-4 h-4 bg-orange-500 m-1"></div>
                    <div className="w-4 h-4 bg-orange-600 m-1"></div>
                    <div className="w-4 h-4 bg-orange-700 m-1"></div>
                  </div>
                  <div>More</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submission History */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-orange-500 border-b border-orange-500 pb-2">
            Submission History
          </h2>
          <div className="rounded-2xl shadow-md overflow-hidden border border-orange-500 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {apiErrors.submissions ? (
              <div className="text-center py-6 text-orange-300">
                <p>{apiErrors.submissions}</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-orange-900 bg-opacity-30 sticky top-0">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                        Problem
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                        Language
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                        Runtime
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-400 uppercase tracking-wider">
                        Memory
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {submissions.length > 0 ? (
                      submissions.map((submission) => (
                        <tr key={submission._id} className="bg-black hover:bg-gray-800 hover:bg-opacity-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {submission.problemId?.title || 'Unknown Problem'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(submission.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {submission.language}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {submission.runtime || 0} ms
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {((submission.memory || 0) / 1024).toFixed(2)} MB
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-400">
                          No submissions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-orange-500 mt-10 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 DooCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MyProfile;