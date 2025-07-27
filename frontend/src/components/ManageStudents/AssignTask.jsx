import React from "react";
import CollegeNavbar from "../Landing/CollegeNavbar";
import { FaTasks, FaCode, FaClock, FaUsers, FaChartLine, FaRocket, FaGraduationCap, FaLightbulb, FaCalendarAlt, FaAward } from 'react-icons/fa';
import { MdAssignment, MdSchedule, MdAnalytics, MdNotifications } from 'react-icons/md';

const AssignTask = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CollegeNavbar />

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <FaTasks className="text-white text-4xl" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Task Assignment
            <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get ready for the most comprehensive DSA task assignment system designed specifically for colleges. 
            Empower your students with structured learning paths and real-time progress tracking.
          </p>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaRocket className="text-orange-400 text-2xl" />
              <span className="text-xl font-semibold text-white">Launching Soon</span>
            </div>
            <p className="text-gray-300">
              We're putting the finishing touches on our revolutionary task assignment platform. 
              Stay tuned for an amazing experience!
            </p>
          </div>
        </div>

        {/* Features Preview Grid */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            What's <span className="text-orange-400">Coming</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Daily DSA Challenges */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaCode className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Daily DSA Challenges</h3>
              <p className="text-gray-300 mb-4">
                Automatically assign level-appropriate Data Structures & Algorithms problems to keep students engaged daily.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Difficulty progression system
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Topic-wise categorization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Automated scheduling
                </li>
              </ul>
            </div>

            {/* Batch Management */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Batch-wise Assignment</h3>
              <p className="text-gray-300 mb-4">
                Organize and assign tasks to specific batches with customized difficulty levels and timelines.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Batch-specific assignments
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Custom difficulty settings
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Timeline management
                </li>
              </ul>
            </div>

            {/* Real-time Tracking */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-time Progress</h3>
              <p className="text-gray-300 mb-4">
                Monitor student submissions and progress in real-time with comprehensive analytics dashboard.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Live submission tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Progress visualization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Performance analytics
                </li>
              </ul>
            </div>

            {/* Smart Scheduling */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaCalendarAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Scheduling</h3>
              <p className="text-gray-300 mb-4">
                Intelligent scheduling system that adapts to student performance and learning pace.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Adaptive scheduling
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Deadline management
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Reminder notifications
                </li>
              </ul>
            </div>

            {/* Achievement System */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaAward className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Achievement System</h3>
              <p className="text-gray-300 mb-4">
                Gamified learning experience with badges, leaderboards, and achievement tracking.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Progress badges
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Leaderboard system
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Milestone rewards
                </li>
              </ul>
            </div>

            {/* Custom Templates */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaLightbulb className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Custom Templates</h3>
              <p className="text-gray-300 mb-4">
                Create and save custom assignment templates for different courses and skill levels.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Reusable templates
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Course customization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Template sharing
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Development <span className="text-orange-400">Timeline</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                {/* Phase 1 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-white mb-2">Phase 1: Core Features</h3>
                      <p className="text-gray-300 text-sm">Basic task assignment and batch management</p>
                      <span className="text-orange-400 font-semibold text-sm">Q1 2025</span>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-4 border-black flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>

                {/* Phase 2 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-4 border-black flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-white mb-2">Phase 2: Analytics</h3>
                      <p className="text-gray-300 text-sm">Real-time tracking and progress analytics</p>
                      <span className="text-orange-400 font-semibold text-sm">Q2 2025</span>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-white mb-2">Phase 3: AI Integration</h3>
                      <p className="text-gray-300 text-sm">Smart recommendations and adaptive learning</p>
                      <span className="text-orange-400 font-semibold text-sm">Q3 2025</span>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-4 border-black flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Signup */}
        <div className="text-center bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-3xl p-12">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdNotifications className="text-white text-2xl" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay in the Loop
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be the first to know when our task assignment system goes live. 
            We'll notify you the moment it's ready for your college!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-8 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-orange-500/25">
              Notify Me
            </button>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            No spam, just important updates about the launch.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;
