import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../utils/axiosClient';
import CollegeNavbar from '../../components/Landing/CollegeNavbar';
import { Edit, Loader, AlertCircle, User, X, Check, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";

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

const UpdateStudent = () => {
  const [selectedYear, setSelectedYear] = useState('1st Year');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  // Debounce search term with 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return students;
    }

    const searchLower = debouncedSearchTerm.toLowerCase().trim();
    return students.filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const firstName = student.firstName.toLowerCase();
      const lastName = student.lastName.toLowerCase();
      
      return fullName.includes(searchLower) || 
             firstName.includes(searchLower) || 
             lastName.includes(searchLower);
    });
  }, [students, debouncedSearchTerm]);

  useEffect(() => {
    fetchStudents(selectedYear);
  }, [selectedYear]);

  // Clear search when year changes
  useEffect(() => {
    setSearchTerm('');
  }, [selectedYear]);

  const fetchStudents = async (year) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axiosClient.get(`/college/getAllStudents/${year}`);
      
      // Fetch names for each student
      const studentsWithNames = await Promise.all(
        response.data.data.map(async (student) => {
          try {
            const nameResponse = await axiosClient.get(`/userProfile/profileName/${student.doocode}`);
            return {
              ...student,
              firstName: nameResponse.data.firstName || 'Unknown',
              lastName: nameResponse.data.lastName || '',
            };
          } catch (error) {
            console.error(`Error fetching name for ${student.doocode}:`, error);            
            return {
              ...student,
              firstName: 'Unknown',
              lastName: '',
            };
          }
        })
      );
      
      setStudents(studentsWithNames);
    } catch (err) {
      setError('Failed to fetch students. Please try again later.');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open update modal and pre-fill form
  const openUpdateModal = (student) => {
    setSelectedStudent(student);
    reset({
      doocode: student.doocode,
      year: student.year,
      github: student.github || ''
    });
    setShowUpdateModal(true);
  };

  // Close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedStudent(null);
    setError('');
  };

  // Submit updated student data
  const onSubmit = async (data) => {
    if (!selectedStudent) return;
    
    try {
      setIsUpdating(true);
      setError('');
      setSuccessMessage('');
      
      const payload = {
        doocode: data.doocode,
        year: data.year,
        github: data.github || undefined
      };
      
      const response = await axiosClient.put(
        `/college/updateStudent/${selectedStudent._id}`,
        payload
      );
      
      setSuccessMessage('Student updated successfully!');
      
      // Refresh student list after a short delay
      setTimeout(() => {
        fetchStudents(selectedYear);
        closeUpdateModal();
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.error || 
                       'Failed to update student';
      setError(errorMsg);
      console.error('Error updating student:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to extract just the ID from a full Doocode URL
  const extractDoocodeId = (url) => {
    if (!url) return ''; // Handle undefined/null URLs
    const match = url.match(/myprofile\/([a-f0-9]+)$/);
    return match ? match[1] : url;
  };

  // Clear search function
  const clearSearch = () => {
    setSearchTerm('');
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
            Update Students
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Select an academic year to view and update student records
          </p>
        </div>
        
        {/* Year Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {yearOptions.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedYear === year
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-black/40 border border-orange-500/30 text-neutral-300 hover:bg-orange-500/20'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-orange-500/30 rounded-lg py-3 pl-10 pr-10 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
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
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-center">
            {successMessage}
          </div>
        )}
        
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
            <div className="col-span-1 text-neutral-400 font-medium text-sm">#</div>
            <div className="col-span-5 text-neutral-400 font-medium text-sm">Student Name</div>
            <div className="col-span-4 text-neutral-400 font-medium text-sm">Doocode Profile</div>
            <div className="col-span-2 text-neutral-400 font-medium text-sm">Action</div>
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
              <p>No students found for {selectedYear}</p>
            </div>
          )}

          {/* No Search Results */}
          {!loading && students.length > 0 && filteredStudents.length === 0 && searchTerm && (
            <div className="text-center py-12 text-neutral-500">
              <Search className="mx-auto mb-4 text-neutral-600" size={48} />
              <p className="text-lg mb-2">No students found</p>
              <p className="text-sm">Try adjusting your search term</p>
              <button
                onClick={clearSearch}
                className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
          
          {/* Student Rows */}
          {!loading && filteredStudents.length > 0 && filteredStudents.map((student, index) => {
            // Extract just the ID from the Doocode URL
            const doocodeId = extractDoocodeId(student.doocode);
            
            return (
              <div 
                key={student._id} 
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-orange-500/10 hover:bg-black/30 transition-colors duration-200"
              >
                <div className="col-span-1 text-neutral-300 flex items-center">
                  {/* Show original index if searching, otherwise sequential */}
                  {searchTerm ? students.findIndex(s => s._id === student._id) + 1 : index + 1}
                </div>
                
                <div className="col-span-5 text-neutral-300 flex items-center">
                  <User className="mr-2 text-orange-500" size={18} />
                  <span>
                    {searchTerm ? (
                      // Highlight search term in name
                      <HighlightText 
                        text={`${student.firstName} ${student.lastName}`} 
                        highlight={searchTerm} 
                      />
                    ) : (
                      `${student.firstName} ${student.lastName}`
                    )}
                  </span>
                </div>
                
                <div className="col-span-4">
                  {doocodeId ? (
                    <NavLink 
                      to={`/myprofile/${doocodeId}`}
                      className="text-orange-500 hover:text-orange-400 transition-colors duration-300 flex items-center"
                    >
                      <span className="truncate max-w-xs">
                        {doocodeId}
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
                
                <div className="col-span-2 flex items-center">
                  <button
                    onClick={() => openUpdateModal(student)}
                    className="flex items-center justify-center px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-all duration-300"
                  >
                    <Edit className="mr-2" size={18} />
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Info Footer */}
        <div className="mt-8 text-center text-neutral-500 text-sm">
          <p className="flex items-center justify-center">
            <AlertCircle className="mr-2" size={16} />
            Update student details as needed
          </p>
        </div>
      </div>
      
      {/* Update Student Modal */}
      {showUpdateModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/80 border border-orange-500/50 rounded-xl max-w-2xl w-full p-6 md:p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Update Student
              </h2>
              <button 
                onClick={closeUpdateModal}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-black/30 border border-orange-500/30 rounded-lg">
              <div className="flex items-center mb-4">
                <User className="text-orange-500 mr-2" size={20} />
                <h3 className="text-lg font-medium text-neutral-300">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Doocode Profile */}
              <div>
                <label className="block text-neutral-300 mb-2 font-medium">
                  Doocode Profile <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("doocode", { 
                    required: "Doocode profile is required",
                    pattern: {
                      value: /^(https?:\/\/)?(localhost:\d+\/myprofile\/[a-f0-9]+|[a-f0-9]{24})$/,
                      message: "Enter valid Doocode URL"
                    }
                  })}
                  placeholder={`${frontendUrl}/myprofile/68571f161296ad5e570bdb69`}
                  className={`w-full bg-black/30 border ${
                    errors.doocode ? 'border-red-500' : 'border-orange-500/50'
                  } rounded-lg py-3 px-4 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                {errors.doocode && (
                  <p className="text-red-500 mt-1 text-sm">{errors.doocode.message}</p>
                )}
                <p className="text-neutral-500 text-sm mt-1">
                  Enter full Doocode URL (e.g., {`{frontendUrl}/myprofile/68571f161296ad5e570bdb69`})
                </p>
              </div>
              
              {/* Year Selection */}
              <div>
                <label className="block text-neutral-300 mb-2 font-medium">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("year", { required: "Year is required" })}
                  className={`w-full bg-black/30 border ${
                    errors.year ? 'border-red-500' : 'border-orange-500/50'
                  } rounded-lg py-3 px-4 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                >
                  <option value="">Select Year</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="text-red-500 mt-1 text-sm">{errors.year.message}</p>
                )}
              </div>
              
              {/* Github Profile */}
              <div>
                <label className="block text-neutral-300 mb-2 font-medium">
                  Github Profile (Optional)
                </label>
                <input
                  type="text"
                  {...register("github", {
                    pattern: {
                      value: /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/,
                      message: "Enter a valid GitHub profile URL"
                    }
                  })}
                  placeholder="https://github.com/username"
                  className={`w-full bg-black/30 border ${
                    errors.github ? 'border-red-500' : 'border-orange-500/50'
                  } rounded-lg py-3 px-4 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                {errors.github && (
                  <p className="text-red-500 mt-1 text-sm">{errors.github.message}</p>
                )}
                <p className="text-neutral-500 text-sm mt-1">
                  Enter full GitHub URL (e.g., https://github.com/username)
                </p>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  disabled={isUpdating}
                  className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-all duration-300 flex items-center"
                >
                  <X className="mr-2" size={18} />
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center ${
                    isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:from-orange-600 hover:to-orange-800'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <Loader className="animate-spin mr-2" size={18} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2" size={18} />
                      Update Student
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Modal error message */}
            {error && (
              <div className="mt-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 flex items-center">
                <AlertCircle className="mr-2" size={18} />
                {error}
              </div>
            )}
          </div>
        </div>
      )}
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

export default UpdateStudent;