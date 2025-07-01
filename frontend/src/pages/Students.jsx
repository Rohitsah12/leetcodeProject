import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../utils/axiosClient';
import CollegeNavbar from '../components/Landing/CollegeNavbar';
import { Loader, AlertCircle, User, X, Search, Github, ChevronLeft, Trophy } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Custom hook for debounced search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Students = () => {
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'list'
  const [selectedCategory, setSelectedCategory] = useState(null); // 'overall' or year
  const [allStudents, setAllStudents] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [topStudents, setTopStudents] = useState({
    overall: [],
    firstYear: [],
    secondYear: [],
    thirdYear: [],
    fourthYear: []
  });
  
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  // Debounce search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return allStudents;
    }

    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    return allStudents.filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const firstName = student.firstName.toLowerCase();
      const lastName = student.lastName.toLowerCase();
      
      return fullName.includes(searchLower) || 
             firstName.includes(searchLower) || 
             lastName.includes(searchLower);
    });
  }, [allStudents, debouncedSearchTerm]);

  useEffect(() => {
    if (viewMode === 'dashboard') {
      fetchAllStudents();
    }
  }, [viewMode]);

  // Fetch all students for all years
  const fetchAllStudents = async () => {
    try {
      setDashboardLoading(true);
      setError('');
      
      // Fetch students for all years
      const responses = await Promise.all(
        yearOptions.map(year => 
          axiosClient.get(`/college/getAllStudents/${year}`)
        )
      );
      
      // Combine all students into one array
      let combinedStudents = [];
      responses.forEach((response, index) => {
        const studentsWithYear = response.data.data.map(student => ({
          ...student,
          year: yearOptions[index]
        }));
        combinedStudents = [...combinedStudents, ...studentsWithYear];
      });
      
      // Fetch additional details for all students
      const studentsWithDetails = await Promise.all(
        combinedStudents.map(async (student) => {
          try {
            // Fetch user profile to get name
            const profileResponse = await axiosClient.get(`/userProfile/profileName/${student.doocode}`);
            
            // Fetch problems solved count
            let solvedCount = 0;
            try {
              const solvedResponse = await axiosClient.get(`/problem/problemSolvedByUser/${student.doocode}`);
              solvedCount = solvedResponse.data.length || 0;
            } catch (solvedError) {
              console.error('Error fetching solved problems:', solvedError);
            }
            
            return {
              ...student,
              firstName: profileResponse.data.firstName || 'Unknown',
              lastName: profileResponse.data.lastName || '',
              solvedCount
            };
          } catch (error) {
            console.error(`Error fetching details for student:`, error);
            return {
              ...student,
              firstName: 'Unknown',
              lastName: '',
              solvedCount: 0
            };
          }
        })
      );
      
      // Sort all students by solvedCount descending
      studentsWithDetails.sort((a, b) => b.solvedCount - a.solvedCount);
      setAllStudents(studentsWithDetails);
      
      // Calculate top students for each category
      calculateTopStudents(studentsWithDetails);
    } catch (err) {
      setError('Failed to fetch students. Please try again later.');
      console.error('Error fetching students:', err);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Calculate top students for each category
  const calculateTopStudents = (students) => {
    // Overall top students (top 3 from all)
    const overall = [...students].slice(0, 3);
    
    // Year-wise top students
    const firstYear = students.filter(s => s.year === '1st Year').slice(0, 3);
    const secondYear = students.filter(s => s.year === '2nd Year').slice(0, 3);
    const thirdYear = students.filter(s => s.year === '3rd Year').slice(0, 3);
    const fourthYear = students.filter(s => s.year === '4th Year').slice(0, 3);
    
    setTopStudents({
      overall,
      firstYear,
      secondYear,
      thirdYear,
      fourthYear
    });
  };

  // Fetch students for a specific category when viewing list
  const fetchStudentsForList = async (category) => {
    try {
      setListLoading(true);
      setError('');
      setSearchTerm('');
      
      if (category === 'overall') {
        // Already have all students, just sort them
        setAllStudents([...allStudents].sort((a, b) => b.solvedCount - a.solvedCount));
      } else {
        // Fetch students for specific year
        const response = await axiosClient.get(`/college/getAllStudents/${category}`);
        
        // Fetch details for these students
        const studentsWithDetails = await Promise.all(
          response.data.data.map(async (student) => {
            try {
              // Fetch user profile to get name
              const profileResponse = await axiosClient.get(`/userProfile/profileName/${student.doocode}`);
              
              // Fetch problems solved count
              let solvedCount = 0;
              try {
                const solvedResponse = await axiosClient.get(`/problem/problemSolvedByUser/${student.doocode}`);
                solvedCount = solvedResponse.data.length || 0;
              } catch (solvedError) {
                console.error('Error fetching solved problems:', solvedError);
              }
              
              return {
                ...student,
                year: category,
                firstName: profileResponse.data.firstName || 'Unknown',
                lastName: profileResponse.data.lastName || '',
                solvedCount
              };
            } catch (error) {
              console.error(`Error fetching details for student:`, error);
              return {
                ...student,
                year: category,
                firstName: 'Unknown',
                lastName: '',
                solvedCount: 0
              };
            }
          })
        );
        
        // Sort by solvedCount descending
        studentsWithDetails.sort((a, b) => b.solvedCount - a.solvedCount);
        setAllStudents(studentsWithDetails);
      }
    } catch (err) {
      setError('Failed to fetch students. Please try again later.');
      console.error('Error fetching students:', err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list' && selectedCategory) {
      fetchStudentsForList(selectedCategory);
    }
  }, [viewMode, selectedCategory]);

  // Clear search function
  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleViewAll = (category) => {
    setSelectedCategory(category);
    setViewMode('list');
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setSelectedCategory(null);
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <CollegeNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Student Directory
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            {viewMode === 'dashboard' 
              ? 'Top performers across different academic years' 
              : `Viewing all ${selectedCategory === 'overall' ? 'students' : selectedCategory + ' students'}`}
          </p>
        </div>
        
        {viewMode === 'dashboard' ? (
          <DashboardView 
            topStudents={topStudents} 
            loading={dashboardLoading}
            error={error}
            onViewAll={handleViewAll}
          />
        ) : (
          <ListView 
            category={selectedCategory}
            students={allStudents}
            filteredStudents={filteredStudents}
            loading={listLoading}
            error={error}
            searchTerm={searchTerm}
            onBack={handleBackToDashboard}
            onSearchChange={setSearchTerm}
            onClearSearch={clearSearch}
          />
        )}
      </div>
    </div>
  );
};

// Dashboard View Component
const DashboardView = ({ topStudents, loading, error, onViewAll }) => {
  const categories = [
    { id: 'overall', title: 'Overall Top Students', students: topStudents.overall },
    { id: '1st Year', title: '1st Year Top Students', students: topStudents.firstYear },
    { id: '2nd Year', title: '2nd Year Top Students', students: topStudents.secondYear },
    { id: '3rd Year', title: '3rd Year Top Students', students: topStudents.thirdYear },
    { id: '4th Year', title: '4th Year Top Students', students: topStudents.fourthYear },
  ];

  return (
    <div className="mb-10">
      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 flex items-center justify-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}
      
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-orange-500/20 transition-shadow duration-300"
          >
            <div className="p-4 bg-black/60 border-b border-orange-500/30">
              <h3 className="text-lg font-semibold text-orange-400 flex items-center">
                <Trophy className="mr-2" size={20} />
                {category.title}
              </h3>
            </div>
            
            <div className="p-4">
              {loading ? (
                <div className="flex justify-center items-center py-6">
                  <Loader className="animate-spin text-orange-500" size={30} />
                </div>
              ) : category.students.length === 0 ? (
                <div className="text-center py-6 text-neutral-500">
                  <p>No students found</p>
                </div>
              ) : (
                <>
                  {category.students.map((student, index) => (
                    <div key={student._id} className="flex items-center mb-4 last:mb-0">
                      <div className="w-8 h-8 flex items-center justify-center bg-orange-500/20 rounded-full mr-3">
                        <span className="text-orange-400 font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-200 truncate">
                          {student.firstName} {student.lastName}
                        </p>
                        <div className="flex justify-between text-sm text-neutral-400">
                          <span className="truncate max-w-[100px]">{student.doocode}</span>
                          <span className="flex items-center">
                            <Trophy className="mr-1" size={14} />
                            {student.solvedCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={() => onViewAll(category.id)}
                    className="w-full mt-4 py-2 bg-orange-600/30 hover:bg-orange-600/40 border border-orange-500/30 text-orange-300 rounded-lg transition-colors flex items-center justify-center"
                  >
                    View All
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// List View Component
const ListView = ({ 
  category, 
  students, 
  filteredStudents, 
  loading, 
  error, 
  searchTerm, 
  onBack, 
  onSearchChange, 
  onClearSearch 
}) => {
  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-orange-400 hover:text-orange-300 mb-6 transition-colors"
      >
        <ChevronLeft className="mr-1" size={20} />
        Back to Dashboard
      </button>
      
      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black/40 border border-orange-500/30 rounded-lg py-3 pl-10 pr-10 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          {searchTerm && (
            <button
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-neutral-500 text-sm mt-2 text-center">
            {filteredStudents.length === 0 
              ? `No students found matching "${searchTerm}"` 
              : `Found ${filteredStudents.length} student${filteredStudents.length !== 1 ? 's' : ''} matching "${searchTerm}"`
            }
          </p>
        )}
      </div>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 flex items-center justify-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}
      
      {/* Student List */}
      <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-black/60 border-b border-orange-500/30">
          <div className="col-span-1 text-neutral-400 font-medium text-sm">Rank</div>
          <div className="col-span-3 text-neutral-400 font-medium text-sm">Student Name</div>
          <div className="col-span-3 text-neutral-400 font-medium text-sm">Doocode Profile</div>
          <div className="col-span-3 text-neutral-400 font-medium text-sm">GitHub Profile</div>
          <div className="col-span-2 text-neutral-400 font-medium text-sm">Problems Solved</div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-orange-500" size={40} />
          </div>
        )}
        
        {/* Empty State */}
        {!loading && students.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <p>No students found for {category}</p>
          </div>
        )}

        {/* No Search Results */}
        {!loading && students.length > 0 && filteredStudents.length === 0 && searchTerm && (
          <div className="text-center py-12 text-neutral-500">
            <Search className="mx-auto mb-4 text-neutral-600" size={48} />
            <p className="text-lg mb-2">No students found</p>
            <p className="text-sm">Try adjusting your search term</p>
            <button
              onClick={onClearSearch}
              className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
        
        {/* Student Rows */}
        {!loading && filteredStudents.length > 0 && filteredStudents.map((student, index) => (
          <div 
            key={student._id} 
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-orange-500/10 hover:bg-black/30 transition-colors duration-200"
          >
            <div className="col-span-1 text-neutral-300 flex items-center">
              <div className="w-6 h-6 flex items-center justify-center bg-orange-500/20 rounded-full">
                <span className="text-orange-400 text-sm font-bold">{index + 1}</span>
              </div>
            </div>
            
            <div className="col-span-3 text-neutral-300 flex items-center">
              <User className="mr-2 text-orange-500" size={18} />
              <span>
                {searchTerm ? (
                  <HighlightText 
                    text={`${student.firstName} ${student.lastName}`} 
                    highlight={searchTerm} 
                  />
                ) : (
                  `${student.firstName} ${student.lastName}`
                )}
              </span>
            </div>
            
            <div className="col-span-3">
              {student.doocode ? (
                <NavLink 
                  to={`/myprofile/${student.doocode}`}
                  className="text-orange-500 hover:text-orange-400 transition-colors duration-300 flex items-center"
                  target="_blank"
                >
                  <span className="truncate max-w-xs">
                    {student.doocode}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                </NavLink>
              ) : (
                <span className="text-neutral-500">No profile</span>
              )}
            </div>
            
            <div className="col-span-3">
              {student.github ? (
                <a 
                  href={student.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                >
                  <Github className="mr-2" size={18} />
                  <span className="truncate max-w-xs">
                    {student.github.replace('https://github.com/', '')}
                  </span>
                </a>
              ) : (
                <span className="text-neutral-500">Not linked</span>
              )}
            </div>
            
            <div className="col-span-2 flex items-center justify-center">
              <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                {student.solvedCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to highlight search terms in text
const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => (
        regex.test(part) ? (
          <mark key={index} className="bg-orange-500/30 text-orange-200 px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      ))}
    </span>
  );
};

export default Students;