import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { Flame, UserCircle, Calendar, Trophy, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import Navbar from '../components/Landing/navbar';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useParams } from 'react-router';

const MyProfile = () => {
  const { user: authUser } = useSelector(state => state.auth);
  const {id}=useParams()
  const [profile, setProfile] = useState(null);
  const [heatmap, setHeatmap] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [problemStats, setProblemStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setApiErrors({});
        
        const profileRes = await axiosClient.get(`/userProfile/profile/${id}`);
        setProfile(profileRes.data);
        
        // Fetch problem details for solved problems
        const problemSolvedIds = profileRes.data?.problemSolved || [];
        let problemStats = { total: 0, easy: 0, medium: 0, hard: 0 };

        if (problemSolvedIds.length > 0) {
          // Fetch all solved problems in a single request
          const problemsRes = await axiosClient.post('/problem/by-ids', {
            problemIds: problemSolvedIds
          });
          
          const solvedProblems = problemsRes.data || [];
          
          // Calculate stats
          problemStats = {
            total: solvedProblems.length,
            easy: solvedProblems.filter(p => p.difficulty === 'easy').length,
            medium: solvedProblems.filter(p => p.difficulty === 'medium').length,
            hard: solvedProblems.filter(p => p.difficulty === 'hard').length
          };
        }

        setProblemStats(problemStats);
        
        // Fetch heatmap and submissions in parallel
        const [heatmapRes, submissionsRes] = await Promise.allSettled([
          axiosClient.get('/userProfile/heatmap'),
          axiosClient.get('/userProfile/submissions')
        ]);

        console.log(heatmapRes.value?.data);
        
        // Handle heatmap response
        if (heatmapRes.status === 'fulfilled') {
          setHeatmap(heatmapRes.value.data);
        } else {
          console.error('Heatmap error:', heatmapRes.reason);
          setApiErrors(prev => ({ ...prev, heatmap: 'Failed to load heatmap data' }));
        }
        
        // Handle submissions response
        if (submissionsRes.status === 'fulfilled') {
          setSubmissions(submissionsRes.value.data);
        } else {
          console.error('Submissions error:', submissionsRes.reason);
          setApiErrors(prev => ({ ...prev, submissions: 'Failed to load submission history' }));
        }
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setApiErrors(prev => ({ ...prev, profile: 'Failed to load profile data' }));
      } finally {
        setLoading(false);
      }
    };
    
    if (authUser) {
      fetchProfileData();
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setImageUploading(true);
      
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your_cloudinary_upload_preset');
      
      const cloudinaryRes = await axiosClient.post(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
        formData
      );
      
      const imageUrl = cloudinaryRes.data.secure_url;
      
      // Update profile in backend
      await axiosClient.put('/userProfile/profile/image', { profileImage: imageUrl });
      
      setProfile({ ...profile, profileImage: imageUrl });
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setImageUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <span className="badge badge-success gap-1"><CheckCircle size={14} /> Accepted</span>;
      case 'pending': return <span className="badge badge-warning gap-1"><Clock size={14} /> Pending</span>;
      case 'wrong': return <span className="badge badge-error gap-1"><XCircle size={14} /> Wrong</span>;
      case 'error': return <span className="badge badge-error gap-1"><XCircle size={14} /> Error</span>;
      default: return <span className="badge badge-info gap-1">Unknown</span>;
    }
  };

  // Generate heatmap data for react-calendar-heatmap
  const heatmapValues = useMemo(() => {
    if (!heatmap || Object.keys(heatmap).length === 0) return [];
    
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 11); // Show 12 months of data
    startDate.setDate(1);
    
    const values = [];
    const current = new Date(startDate);
    
    while (current <= today) {
      const dateStr = current.toISOString().split('T')[0];
      values.push({
        date: dateStr,
        count: heatmap[dateStr] || 0
      });
      current.setDate(current.getDate() + 1);
    }
    
    return values;
  }, [heatmap]);

  // Custom class for heatmap values
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
        {/* Hero Section */}
        {profile ? (
          <div className="rounded-3xl p-8 mb-10 shadow-xl border border-orange-500">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-6 md:mb-0 md:mr-8">
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
                <label className="absolute bottom-2 right-2 bg-orange-500 rounded-full p-2 cursor-pointer shadow-md hover:bg-orange-600 transition">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                    disabled={imageUploading}
                  />
                  {imageUploading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-orange-500 mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-300 mb-6">{profile.emailId}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 min-w-[200px] border border-orange-500">
                    <div className="text-gray-300 mb-1 flex items-center justify-center">
                      <Flame className="mr-2 text-orange-500" size={20} /> Current Streak
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-orange-500">{profile.streak?.count || 0} days</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Last solved: {profile.streak?.lastStreakDate || 'New User'}
                    </div>
                  </div>
                  

                  
                  <div className="bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 min-w-[200px] border border-orange-500">
                    <div className="text-gray-300 mb-1 flex items-center justify-center">
                      <Star className="mr-2 text-orange-500" size={20} /> Coding Score
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-2xl font-bold text-orange-500">{codingScore}</div>
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
        
        {/* Heatmap Section with react-calendar-heatmap */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-orange-500 border-b border-orange-500 pb-2">
            Activity Heatmap
          </h2>
          <div className="rounded-2xl p-6 shadow-md border border-orange-500">
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
                  startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
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

                <div className="flex justify-between text-xs text-gray-400">
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
          <div className="rounded-2xl shadow-md overflow-hidden border border-orange-500">
            {apiErrors.submissions ? (
              <div className="text-center py-6 text-orange-300">
                <p>{apiErrors.submissions}</p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="  min-w-full divide-y divide-gray-700">
                  <thead className="bg-orange-200 sticky top-0" >
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">
                        Problem
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">
                        Language
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">
                        Runtime
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-orange-500 uppercase tracking-wider">
                        Memory
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {submissions.length > 0 ? (
                      submissions.map((submission) => (
                        <tr key={submission._id} className="hover:bg-gray-800 transition-colors">
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
      
      {/* Footer */}
      <footer className=" border-t border-orange-500 mt-10 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 DooCode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MyProfile;