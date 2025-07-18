import { useParams } from 'react-router';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../../utils/axiosClient';
import { motion } from 'framer-motion';
import Navbar from '../Landing/Navbar';

function UploadVideo() {
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm();

  const selectedFile = watch('videoFile')?.[0];

  // Fetch problem details on mount
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/getProblemById/${problemId}`);
        setProblem(data);
      } catch (err) {
        console.error('Failed to fetch problem details:', err);
      }
    };
    
    fetchProblem();
  }, [problemId]);

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0];
    
    setUploading(true);
    setUploadProgress(0);
    clearErrors();
    setUploadedVideo(null);
    setIsSuccessVisible(false);

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
      const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('public_id', public_id);
      formData.append('api_key', api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post('/video/save', {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      setIsSuccessVisible(true);
      reset(); // Reset form after successful upload
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('root', {
        type: 'manual',
        message: err.response?.data?.message || 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black "
    style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent mb-2">
            Upload Video Solution
          </h1>
          <p className="text-gray-400">Add a video explanation for the problem</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
          >
            <h2 className="text-xl font-bold text-orange-400 mb-4">Problem Details</h2>
            
            {problem ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm">Problem Title</h3>
                  <p className="text-lg font-medium">{problem.title}</p>
                </div>
                
                <div className="flex space-x-4">
                  <div>
                    <h3 className="text-gray-400 text-sm">Difficulty</h3>
                    <span className={`inline-block py-1 px-3 rounded-full text-sm font-bold ${
                      problem.difficulty === 'Easy' 
                        ? 'bg-green-900/30 text-green-300 border border-green-800' 
                        : problem.difficulty === 'Medium' 
                          ? 'bg-amber-900/30 text-amber-300 border border-amber-800' 
                          : 'bg-red-900/30 text-red-300 border border-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-400 text-sm">Problem ID</h3>
                    <p className="text-sm font-mono text-gray-300">{problemId}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-400 text-sm">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(Array.isArray(problem.tags) ? problem.tags : [problem.tags]).map((tag, i) => (
                      <span 
                        key={i}
                        className="text-xs py-1 px-3 rounded-full bg-gray-900/50 border border-orange-900 text-orange-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-700 h-12 w-12"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-4 border-t border-gray-700">
              <h3 className="text-orange-400 font-medium mb-2">Upload Guidelines</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Video must be in MP4 format</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Maximum file size: 100MB</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Video should clearly explain the solution</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Keep videos under 10 minutes</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Upload Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
          >
            <h2 className="text-xl font-bold text-orange-400 mb-6">Upload Video</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* File Upload Area */}
              <div className="form-control w-full">
                <label className="block text-gray-300 mb-2">Select Video File</label>
                
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    errors.videoFile 
                      ? 'border-red-500 bg-red-900/10' 
                      : selectedFile 
                        ? 'border-green-500 bg-green-900/10' 
                        : 'border-gray-600 hover:border-orange-500 hover:bg-gray-700/30'
                  }`}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input
                    id="fileInput"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    {...register('videoFile', {
                      required: 'Please select a video file',
                      validate: {
                        isVideo: (files) => {
                          if (!files || !files[0]) return 'Please select a video file';
                          const file = files[0];
                          return file.type.startsWith('video/') || 'Please select a valid video file';
                        },
                        fileSize: (files) => {
                          if (!files || !files[0]) return true;
                          const file = files[0];
                          const maxSize = 100 * 1024 * 1024; // 100MB
                          return file.size <= maxSize || 'File size must be less than 100MB';
                        }
                      }
                    })}
                    disabled={uploading}
                  />
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    {selectedFile ? (
                      <div>
                        <p className="font-medium text-gray-200">{selectedFile.name}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {formatFileSize(selectedFile.size)} • {selectedFile.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-200">Drag & drop or click to select</p>
                        <p className="text-sm text-gray-400 mt-1">Supports MP4, MOV, AVI files up to 100MB</p>
                      </div>
                    )}
                    
                    {errors.videoFile && (
                      <p className="text-red-400 mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.videoFile.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Uploading your video...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  </div>
                  
                  <div className="text-center text-gray-400 text-sm">
                    Please don't close this window while uploading
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {errors.root && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-900/30 border border-red-700 rounded-lg flex"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-red-300">Upload Failed</p>
                    <p className="text-red-400 text-sm mt-1">{errors.root.message}</p>
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              {uploadedVideo && isSuccessVisible && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-900/30 border border-green-700 rounded-lg flex"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-green-300">Upload Successful!</p>
                    <div className="text-green-400 text-sm mt-1 space-y-1">
                      <p>Duration: {formatDuration(uploadedVideo.duration)}</p>
                      <p>Uploaded at: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <button 
                    className="ml-auto text-gray-400 hover:text-gray-200"
                    onClick={() => setIsSuccessVisible(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.div>
              )}

              {/* Upload Button */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  whileHover={{ scale: uploading ? 1 : 1.03 }}
                  whileTap={{ scale: uploading ? 1 : 0.98 }}
                  className={`w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center ${
                    uploading || !selectedFile
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white'
                  }`}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Video
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default UploadVideo;