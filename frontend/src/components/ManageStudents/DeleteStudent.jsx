import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../utils/axiosClient';
import CollegeNavbar from '../../components/Landing/CollegeNavbar';
import { Trash2, Loader, AlertCircle, User, X, Check, Search } from 'lucide-react';
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

const DeleteStudent = () => {
  const [selectedYear, setSelectedYear] = useState('1st Year');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  
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
            // Fetch the name using the endpoint
            const nameResponse = await axiosClient.get(`/userProfile/profileName/${student.doocode}`);
            
            return {
              ...student,
              firstName: nameResponse.data.firstName || 'Unknown',
              lastName: nameResponse.data.lastName || '',
            };
          } catch (error) {
            console.error(`Error fetching name for ${student.doocode}:`, error)            
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

  // Open delete confirmation modal
  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  // Close delete modal without action
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  // Actually delete the student after confirmation
  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    try {
      setDeletingId(studentToDelete._id);
      setSuccessMessage('');
      setError('');
      
      await axiosClient.delete(`/college/deleteStudent/${studentToDelete._id}`);
      
      // Remove deleted student from state
      setStudents(students.filter(student => student._id !== studentToDelete._id));
      setSuccessMessage('Student deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete student. Please try again.');
      console.error('Error deleting student:', err);
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setStudentToDelete(null);
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
            Delete Students
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Select an academic year to view and manage student records
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
                    onClick={() => openDeleteModal(student)}
                    disabled={deletingId === student._id}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 ${
                      deletingId === student._id
                        ? 'bg-orange-600 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    <Trash2 className="mr-2" size={18} />
                    Delete
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
            Deleting a student will permanently remove their record from the system
          </p>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && studentToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/80 border border-orange-500/50 rounded-xl max-w-md w-full p-6 md:p-8 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold mt-4 text-red-500">
                Confirm Deletion
              </h3>
              
              <p className="text-neutral-300 mt-4">
                Are you sure you want to delete the student:
              </p>
              
              <p className="text-orange-500 font-semibold mt-2 text-lg">
                {studentToDelete.firstName} {studentToDelete.lastName}
              </p>
              
              <p className="text-neutral-500 mt-2 text-sm">
                This action cannot be undone.
              </p>
              
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={closeDeleteModal}
                  className="flex items-center justify-center px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-all duration-300"
                >
                  <X className="mr-2" size={18} />
                  Cancel
                </button>
                
                <button
                  onClick={confirmDelete}
                  disabled={deletingId === studentToDelete._id}
                    className={`flex items-center justify-center px-6 py-3 rounded-lg transition-all duration-300 ${
                      deletingId === studentToDelete._id
                        ? 'bg-orange-600 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                  {deletingId === studentToDelete._id ? (
                    <Loader className="animate-spin mr-2" size={18} />
                  ) : (
                    <Trash2 className="mr-2" size={18} />
                  )}
                  Delete
                </button>
              </div>
            </div>
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

export default DeleteStudent;