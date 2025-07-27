import React from 'react'
import CollegeNavbar from '../components/Landing/CollegeNavbar'
import { FaUsers, FaChartLine, FaTasks, FaGraduationCap, FaBriefcase, FaRocket, FaClock, FaAward, FaBuilding, FaCode, FaArrowRight } from 'react-icons/fa'
import { MdDashboard, MdAnalytics, MdAssignment, MdPeople, MdTrendingUp } from 'react-icons/md'
import { NavLink } from 'react-router-dom'

const CollegeLanding = () => {
  return (
    <div className='min-h-screen'
    style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <CollegeNavbar />
      
      {/* Hero Section */}
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center mb-16'>
          <h1 className='text-5xl md:text-6xl font-bold text-white mb-6'>
            Transform Your College's
            <span className='block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent'>
              Coding Culture
            </span>
          </h1>
          <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
            Empower your institution with comprehensive coding education management. 
            Track progress, assign challenges, and build the next generation of developers.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <NavLink 
              to="/collegeLogin"
              className='bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 px-8 rounded-full hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 flex items-center gap-2'
            >
              <FaRocket />
              Get Started Now
            </NavLink>
            <button className='border-2 border-orange-500 text-orange-500 font-semibold py-4 px-8 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center gap-2 justify-center'>
              <FaCode />
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
          {/* Student Management */}
          <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <FaUsers className='text-white text-2xl' />
            </div>
            <h3 className='text-2xl font-bold text-white mb-4'>Student Management</h3>
            <p className='text-gray-300 mb-6'>
              Organize students batch-wise, track individual progress, and manage coding assignments seamlessly.
            </p>
            <ul className='text-gray-400 space-y-2'>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Batch-wise organization
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Individual student profiles
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Real-time progress tracking
              </li>
            </ul>
          </div>

          {/* DSA Assignments */}
          <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <FaTasks className='text-white text-2xl' />
            </div>
            <h3 className='text-2xl font-bold text-white mb-4'>Daily DSA Challenges</h3>
            <p className='text-gray-300 mb-6'>
              Assign level-appropriate Data Structures & Algorithms problems daily to keep students engaged and learning.
            </p>
            <ul className='text-gray-400 space-y-2'>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Daily problem assignments
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Difficulty level management
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Automated progress tracking
              </li>
            </ul>
          </div>

          {/* Analytics Dashboard */}
          <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <MdAnalytics className='text-white text-2xl' />
            </div>
            <h3 className='text-2xl font-bold text-white mb-4'>Advanced Analytics</h3>
            <p className='text-gray-300 mb-6'>
              Comprehensive dashboard with detailed insights into student performance and coding progress.
            </p>
            <ul className='text-gray-400 space-y-2'>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Real-time performance metrics
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Visual progress reports
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Comparative analysis
              </li>
            </ul>
          </div>

          {/* Placement Assistance */}
          <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <FaBriefcase className='text-white text-2xl' />
            </div>
            <h3 className='text-2xl font-bold text-white mb-4'>Placement Coordination</h3>
            <p className='text-gray-300 mb-6'>
              Streamline placement activities by easily sharing top-performing student profiles with companies.
            </p>
            <ul className='text-gray-400 space-y-2'>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Top performer identification
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Profile sharing with companies
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Placement success tracking
              </li>
            </ul>
          </div>

          {/* Real-time Monitoring */}
          <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <FaClock className='text-white text-2xl' />
            </div>
            <h3 className='text-2xl font-bold text-white mb-4'>Real-time Monitoring</h3>
            <p className='text-gray-300 mb-6'>
              Monitor student activities and assignment submissions in real-time for immediate feedback and support.
            </p>
            <ul className='text-gray-400 space-y-2'>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Live activity tracking
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Instant notifications
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Quick intervention tools
              </li>
            </ul>
          </div>

          {/* Best Student Recognition */}
          <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'>
              <FaAward className='text-white text-2xl' />
            </div>
            <h3 className='text-2xl font-bold text-white mb-4'>Excellence Recognition</h3>
            <p className='text-gray-300 mb-6'>
              Identify and showcase your best-performing students with comprehensive performance analytics.
            </p>
            <ul className='text-gray-400 space-y-2'>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Leaderboard system
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Achievement badges
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                Performance certificates
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works Section */}
        <div className='mb-20'>
          <h2 className='text-4xl font-bold text-center text-white mb-16'>
            How IndieCode <span className='text-orange-400'>Transforms</span> Your College
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-2xl font-bold'>1</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Setup & Organization</h3>
              <p className='text-gray-300'>
                Organize your students into batches and set up coding assignments tailored to their skill levels.
              </p>
            </div>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-2xl font-bold'>2</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Monitor & Track</h3>
              <p className='text-gray-300'>
                Track student progress in real-time and analyze their coding performance with detailed analytics.
              </p>
            </div>
            <div className='text-center'>
              <div className='w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <span className='text-white text-2xl font-bold'>3</span>
              </div>
              <h3 className='text-xl font-bold text-white mb-4'>Placement Success</h3>
              <p className='text-gray-300'>
                Leverage top student profiles to attract companies and boost placement success rates.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 mb-20'>
          <h2 className='text-4xl font-bold text-center text-white mb-12'>
            Why Choose <span className='text-orange-400'>IndieCode</span> for Your College?
          </h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <MdTrendingUp className='text-white text-xl' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-white mb-2'>Improved Learning Outcomes</h3>
                  <p className='text-gray-300'>Structured daily challenges ensure consistent skill development and better coding proficiency.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaChartLine className='text-white text-xl' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-white mb-2'>Data-Driven Decisions</h3>
                  <p className='text-gray-300'>Make informed decisions with comprehensive analytics and performance insights.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaBriefcase className='text-white text-xl' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-white mb-2'>Enhanced Placement Rates</h3>
                  <p className='text-gray-300'>Showcase top talent to companies with detailed performance profiles and analytics.</p>
                </div>
              </div>
            </div>
            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaClock className='text-white text-xl' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-white mb-2'>Time-Efficient Management</h3>
                  <p className='text-gray-300'>Automate assignment distribution and progress tracking to save valuable time.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaGraduationCap className='text-white text-xl' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-white mb-2'>Student Engagement</h3>
                  <p className='text-gray-300'>Keep students motivated with gamified challenges and recognition systems.</p>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                  <FaBuilding className='text-white text-xl' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-white mb-2'>Institutional Growth</h3>
                  <p className='text-gray-300'>Build a stronger reputation with improved coding culture and industry connections.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='text-center bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-3xl p-12'>
          <h2 className='text-4xl font-bold text-white mb-6'>
            Ready to Transform Your College's Coding Culture?
          </h2>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Join the revolution in coding education. Contact our support team to get your college login credentials and start building excellence today.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <NavLink 
              to="/collegeLogin"
              className='bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 px-8 rounded-full hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/25 flex items-center gap-2 justify-center'
            >
              <FaBuilding />
              College Login
              <FaArrowRight />
            </NavLink>
            <button className='border-2 border-orange-500 text-orange-500 font-semibold py-4 px-8 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center gap-2 justify-center'>
              Contact Support
            </button>
          </div>
          <p className='text-sm text-gray-400 mt-6'>
            Need credentials? Contact our support team at support@indiecode.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default CollegeLanding
