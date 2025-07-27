import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { Gift, Star, Trophy, Award, CheckCircle, Lock, Zap } from 'lucide-react';
import Navbar from '../components/Landing/Navbar';
import Footer from '../components/Landing/Footer';

const Redeem = () => {
  const { user: authUser } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);
  const [problemStats, setProblemStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });
  const [loading, setLoading] = useState(true);
  const [redeemedItems, setRedeemedItems] = useState([]);

  // Goodies configuration
  const goodies = [
    {
      id: 'pen',
      name: 'IndieCode Pen',
      description: 'Premium quality pen with IndieCode branding',
      requiredScore: 1000,
      image: 'https://res.cloudinary.com/dltqzdtfh/image/upload/v1753590684/indiecodepen_uncyyg.png',
      category: 'Writing',
      color: 'from-blue-500 to-blue-600',
      icon: Award
    },
    {
      id: 'cap',
      name: 'IndieCode Cap',
      description: 'Stylish cap with embroidered IndieCode logo',
      requiredScore: 1500,
      image: 'https://res.cloudinary.com/dltqzdtfh/image/upload/v1753591002/indiecodecap_fgb55o.png',
      category: 'Apparel',
      color: 'from-green-500 to-green-600',
      icon: Trophy
    },
    {
      id: 'tshirt',
      name: 'IndieCode T-Shirt',
      description: 'Premium cotton t-shirt with unique IndieCode design',
      requiredScore: 2000,
      image: 'https://res.cloudinary.com/dltqzdtfh/image/upload/v1753591109/indiecodetshirt_s1oz9t.png',
      category: 'Apparel',
      color: 'from-purple-500 to-purple-600',
      icon: Star
    },
    {
      id: 'notebook',
      name: 'IndieCode Notebook',
      description: 'High-quality notebook for coding notes and algorithms',
      requiredScore: 2500,
      image: 'https://res.cloudinary.com/dltqzdtfh/image/upload/v1753591197/indiecodenotebook_bbnura.png',
      category: 'Stationery',
      color: 'from-yellow-500 to-yellow-600',
      icon: Award
    },
    {
      id: 'all_goodies',
      name: 'IndieCode Complete Bundle',
      description: 'All IndieCode goodies in one amazing package',
      requiredScore: 3000,
      image: 'https://res.cloudinary.com/dltqzdtfh/image/upload/v1753591300/indiecodebundle_d8tgiq.png',
      category: 'Bundle',
      color: 'from-orange-500 to-red-600',
      icon: Gift,
      isBundle: true
    }
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        if (!authUser?._id) return;

        const profileRes = await axiosClient.get(`/userProfile/profile/${authUser._id}`);
        setProfile(profileRes.data);
        
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

        // TODO: Fetch redeemed items from backend
        // const redeemedRes = await axiosClient.get('/userProfile/redeemed-items');
        // setRedeemedItems(redeemedRes.data);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser]);

  const codingScore = useMemo(() => {
    return problemStats.easy * 2 + problemStats.medium * 3 + problemStats.hard * 5;
  }, [problemStats]);

  const handleRedeem = async (goodie) => {
    try {
      // TODO: Implement actual redemption API call
      // const response = await axiosClient.post('/userProfile/redeem', {
      //   goodieId: goodie.id,
      //   requiredScore: goodie.requiredScore
      // });
      
      // For now, just show success message
      alert(`Successfully redeemed ${goodie.name}! We'll contact you soon for delivery details.`);
      setRedeemedItems(prev => [...prev, goodie.id]);
    } catch (error) {
      console.error('Redemption error:', error);
      alert('Failed to redeem item. Please try again.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 3000) return 'text-red-400';
    if (score >= 2500) return 'text-purple-400';
    if (score >= 2000) return 'text-blue-400';
    if (score >= 1500) return 'text-green-400';
    if (score >= 1000) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getProgressPercentage = (requiredScore) => {
    return Math.min((codingScore / requiredScore) * 100, 100);
  };

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
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="text-white text-3xl" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            Redeem <span className="text-orange-400">Goodies</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Earn points by solving problems and redeem amazing IndieCode merchandise!
          </p>
        </div>

        {/* Score Display */}
        <div className="bg-white/5 backdrop-blur-md border border-orange-500 rounded-3xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your Coding Score</h2>
          
          <div className="flex justify-center items-center mb-6">
            <Zap className="text-orange-500 mr-3" size={32} />
            <span className={`text-6xl font-bold ${getScoreColor(codingScore)}`}>
              {codingScore}
            </span>
            <span className="text-gray-400 ml-2 text-lg">points</span>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{problemStats.easy}</div>
              <div className="text-sm text-gray-400">Easy (2pts each)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{problemStats.medium}</div>
              <div className="text-sm text-gray-400">Medium (3pts each)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{problemStats.hard}</div>
              <div className="text-sm text-gray-400">Hard (5pts each)</div>
            </div>
          </div>

          <p className="text-gray-300">
            Keep solving problems to earn more points and unlock amazing rewards!
          </p>
        </div>

        {/* Goodies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goodies.map((goodie) => {
            const isUnlocked = codingScore >= goodie.requiredScore;
            const isRedeemed = redeemedItems.includes(goodie.id);
            const progress = getProgressPercentage(goodie.requiredScore);
            const IconComponent = goodie.icon;

            return (
              <div
                key={goodie.id}
                className={`bg-white/5 backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isUnlocked ? 'border-green-500' : 'border-gray-600'
                } ${isRedeemed ? 'opacity-75' : ''}`}
              >
                {/* Image */}
                <div className="relative h-56 flex items-center justify-center bg-black/20 overflow-hidden">
                  <img
                    src={goodie.image}
                    alt={goodie.name}
                    className="h-full w-auto max-w-full mx-auto object-contain"
                  />
                  {isRedeemed && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center">
                        <CheckCircle className="text-green-400 mx-auto mb-2" size={32} />
                        <span className="text-white font-semibold">Redeemed</span>
                      </div>
                    </div>
                  )}
                  {!isUnlocked && !isRedeemed && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Lock className="text-gray-400" size={32} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${goodie.color} rounded-lg flex items-center justify-center mr-3`}>
                      <IconComponent className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{goodie.name}</h3>
                      <span className="text-sm text-gray-400">{goodie.category}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 text-sm">{goodie.description}</p>

                  {/* Score Requirement */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Required Score</span>
                      <span className={`font-bold ${isUnlocked ? 'text-green-400' : 'text-orange-400'}`}>
                        {goodie.requiredScore} pts
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isUnlocked ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    {!isUnlocked && (
                      <p className="text-xs text-gray-400 mt-1">
                        {goodie.requiredScore - codingScore} more points needed
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleRedeem(goodie)}
                    disabled={!isUnlocked || isRedeemed}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      isRedeemed
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : isUnlocked
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-500/25'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isRedeemed ? 'Already Redeemed' : isUnlocked ? 'Redeem Now' : 'Locked'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* How to Earn Points */}
        <div className="mt-16 bg-white/5 backdrop-blur-md border border-orange-500 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            How to Earn <span className="text-orange-400">Points</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Problems</h3>
              <p className="text-gray-300">Solve easy problems to earn 2 points each</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Medium Problems</h3>
              <p className="text-gray-300">Solve medium problems to earn 3 points each</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">5</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Hard Problems</h3>
              <p className="text-gray-300">Solve hard problems to earn 5 points each</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Redeem;
