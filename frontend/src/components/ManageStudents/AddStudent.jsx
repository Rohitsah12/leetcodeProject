import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../utils/axiosClient';
import CollegeNavbar from '../../components/Landing/CollegeNavbar';
import { GraduationCap, User, Github, AlertCircle, Check, X } from 'lucide-react';

const AddStudent = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        doocode: data.doocode,
        github: data.github || undefined,
        year: data.year
      };

      const response = await axiosClient.post('/college/addStudent', payload);
      
      setModalMessage(response.data.message || 'Student added successfully!');
      setIsSuccess(true);
      setIsModalOpen(true);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      'Failed to add student';
      setModalMessage(errorMsg);
      setIsSuccess(false);
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      navigate('/college/managestudents');
    }
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
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6 md:p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Add New Student
          </h2>
          <p className="text-neutral-400 text-center mb-8 flex items-center justify-center">
            <GraduationCap className="mr-2 text-orange-500" size={20} />
            Register students to the college database
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Year Selection */}
            <div>
              <label className="block text-neutral-300 mb-2 font-medium flex items-center">
                <GraduationCap className="mr-2 text-orange-500" size={18} />
                Academic Year
              </label>
              <div className="relative">
                <select
                  {...register("year", { required: "Year is required" })}
                  className={`w-full bg-black  border ${
                    errors.year ? 'border-red-500' : 'border-orange-500/50'
                  } rounded-lg py-3 px-4 pl-10 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                >
                  <option value="">Select Year</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year} >
                      {year}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                  <GraduationCap size={20} />
                </div>
              </div>
              {errors.year && (
                <p className="text-red-500 mt-1 text-sm flex items-center">
                  <AlertCircle className="mr-1" size={16} />
                  {errors.year.message}
                </p>
              )}
            </div>
            
            {/* Doocode Profile */}
            <div>
              <label className="block text-neutral-300 mb-2 font-medium flex items-center">
                <User className="mr-2 text-orange-500" size={18} />
                Doocode Profile <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("doocode", { 
                    required: "Doocode profile is required",
                    pattern: {
                      value: /^(https?:\/\/)?(localhost:\d+\/myprofile\/[a-f0-9]+|[a-f0-9]{24})$/,
                      message: "Enter valid Doocode URL"
                    }
                  })}
                  placeholder="http://localhost:5173/myprofile/<userid>"
                  className={`w-full bg-black/30 border ${
                    errors.doocode ? 'border-red-500' : 'border-orange-500/50'
                  } rounded-lg py-3 px-4 pl-10 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                  <User size={20} />
                </div>
              </div>
              {errors.doocode && (
                <p className="text-red-500 mt-1 text-sm flex items-center">
                  <AlertCircle className="mr-1" size={16} />
                  {errors.doocode.message}
                </p>
              )}
              <p className="text-neutral-500 text-sm mt-1 flex items-center">
                <span className="mr-1">💡</span> Enter full Doocode URL (e.g., http://localhost:5173/myprofile/userid)
              </p>
            </div>
            
            {/* Github Profile */}
            <div>
              <label className="block text-neutral-300 mb-2 font-medium flex items-center">
                <Github className="mr-2 text-orange-500" size={18} />
                Github Profile (Optional)
              </label>
              <div className="relative">
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
                  } rounded-lg py-3 px-4 pl-10 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500">
                  <Github size={20} />
                </div>
              </div>
              {errors.github && (
                <p className="text-red-500 mt-1 text-sm flex items-center">
                  <AlertCircle className="mr-1" size={16} />
                  {errors.github.message}
                </p>
              )}
              <p className="text-neutral-500 text-sm mt-1 flex items-center">
                <span className="mr-1">💡</span> Enter full GitHub URL (e.g., https://github.com/username)
              </p>
            </div>
            
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 flex items-center ${
                  isSubmitting 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:from-orange-600 hover:to-orange-800 transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <User className="mr-2" size={20} />
                    Add Student
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Success/Error Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/80 border border-orange-500/50 rounded-xl max-w-md w-full p-6 md:p-8 shadow-xl">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {isSuccess ? (
                  <Check className="h-8 w-8 text-green-500" />
                ) : (
                  <X className="h-8 w-8 text-red-500" />
                )}
              </div>
              
              <h3 className={`text-xl font-bold mt-4 ${isSuccess ? 'text-green-500' : 'text-red-500'} flex items-center justify-center`}>
                {isSuccess ? (
                  <Check className="mr-2" size={24} />
                ) : (
                  <AlertCircle className="mr-2" size={24} />
                )}
                {isSuccess ? 'Success!' : 'Error!'}
              </h3>
              
              <p className="text-neutral-300 mt-2">
                {modalMessage}
              </p>
              
              <button
                onClick={closeModal}
                className={`mt-6 w-full py-3 font-semibold rounded-lg flex items-center justify-center ${
                  isSuccess 
                    ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800'
                } text-white transition-all duration-300`}
              >
                <Check className="mr-2" size={18} />
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStudent;