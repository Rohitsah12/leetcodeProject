import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Landing/Navbar';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

// Updated Zod schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).min(1, 'At least one tag required'),
  companies: z.array(z.string().min(1, 'Company cannot be empty')).optional(),
  hints: z.array(z.string().min(1, 'Hint cannot be empty')).optional(),
  constraints: z.array(z.string().min(1, 'Constraint cannot be empty')).optional(),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function CreateProblem() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [markdownValue, setMarkdownValue] = useState('');
  
  // Load saved form data from localStorage
  const savedFormData = localStorage.getItem('createProblemForm');
  const defaultValues = savedFormData ? JSON.parse(savedFormData) : {
    tags: [],
    companies: [],
    hints: [],
    constraints: [],
    startCode: [
      { language: 'C++', initialCode: '' },
      { language: 'Java', initialCode: '' },
      { language: 'JavaScript', initialCode: '' }
    ],
    referenceSolution: [
      { language: 'C++', completeCode: '' },
      { language: 'Java', completeCode: '' },
      { language: 'JavaScript', completeCode: '' }
    ]
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues
  });

  // Watch all form values
  const formData = watch();

  // Save form data to localStorage
  useEffect(() => {
    localStorage.setItem('createProblemForm', JSON.stringify(formData));
  }, [formData]);

  // Initialize markdown editor with saved value
  useEffect(() => {
    if (savedFormData) {
      setMarkdownValue(JSON.parse(savedFormData).description || '');
    }
  }, []);

  // Update form value when markdown changes
  useEffect(() => {
    setValue('description', markdownValue);
  }, [markdownValue, setValue]);

  // Clear saved form data
  const clearFormData = () => {
    localStorage.removeItem('createProblemForm');
    reset();
    setMarkdownValue('');
  };

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const tags = watch('tags') || [];
  const companies = watch('companies') || [];
  const hints = watch('hints') || [];
  const constraints = watch('constraints') || [];

  // Generic function to handle adding items to arrays
  const handleAddItem = (e, fieldName) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newItem = e.target.value.trim();
      if (newItem) {
        const currentItems = watch(fieldName) || [];
        if (!currentItems.includes(newItem)) {
          setValue(fieldName, [...currentItems, newItem]);
          e.target.value = '';
        }
      }
    }
  };

  // Generic function to remove items from arrays
  const removeItem = (index, fieldName) => {
    const currentItems = [...(watch(fieldName) || [])];
    currentItems.splice(index, 1);
    setValue(fieldName, currentItems);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axiosClient.post('/problem/create', data);
      localStorage.removeItem('createProblemForm');
      alert('Problem created successfully!');
      navigate('/admin');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
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
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Create New Problem
          </motion.h1>
          <p className="text-neutral-300">
            Add a new coding challenge to the platform
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <motion.div 
            className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 shadow-lg shadow-orange-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-orange-500/30">
              <h2 className="text-xl font-semibold text-orange-400">
                Basic Information
              </h2>
              <button
                type="button"
                onClick={clearFormData}
                className="btn btn-xs bg-gray-700 hover:bg-gray-600 text-white"
              >
                Clear Form
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Title</span>
                </label>
                <input
                  {...register('title')}
                  className={`input bg-black/30 border border-orange-500/30 text-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                    errors.title && 'border-red-500'
                  }`}
                />
                {errors.title && (
                  <span className="text-red-400 text-sm mt-1">{errors.title.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Description</span>
                </label>
                
                <div className={`relative rounded-lg overflow-hidden ${
                  errors.description ? 'border border-red-500' : ''
                }`}>
                  <div className="bg-black/30 border border-orange-500/30 rounded-lg overflow-hidden">
                    <MDEditor
                      value={markdownValue}
                      onChange={setMarkdownValue}
                      height={300}
                      preview="live"
                      data-color-mode="dark"
                      style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: 'none'
                      }}
                      textareaProps={{
                        placeholder: 'Enter problem description using Markdown...'
                      }}
                      previewOptions={{
                        components: {
                          code: ({ inline, children, className, ...props }) => {
                            if (inline) {
                              return <code className="bg-orange-900/30 text-orange-300 px-1 rounded">{children}</code>;
                            }
                            return (
                              <pre className="bg-black/50 p-4 rounded-lg my-2 overflow-x-auto">
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </pre>
                            );
                          }
                        }
                      }}
                    />
                  </div>
                  
                  {errors.description && (
                    <span className="text-red-400 text-sm mt-1 block">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-neutral-300">Difficulty</span>
                  </label>
                  <select
                    {...register('difficulty')}
                    className={`select bg-black/30 border border-orange-500/30 text-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                      errors.difficulty && 'border-red-500'
                    }`}
                  >
                    <option value="easy" className="bg-black text-green-400">Easy</option>
                    <option value="medium" className="bg-black text-yellow-400">Medium</option>
                    <option value="hard" className="bg-black text-red-400">Hard</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-neutral-300">Tags</span>
                  </label>
                  <div className={`bg-black/30 border ${
                    errors.tags ? 'border-red-500' : 'border-orange-500/30'
                  } rounded-lg p-2`}>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="flex items-center bg-orange-500/20 text-orange-300 px-2 py-1 rounded-md text-sm"
                        >
                          {tag}
                          <button 
                            type="button"
                            onClick={() => removeItem(index, 'tags')}
                            className="ml-1 text-orange-500 hover:text-orange-300"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add tags (press Enter or comma)"
                      onKeyDown={(e) => handleAddItem(e, 'tags')}
                      className="input bg-transparent border-0 p-0 h-8 text-neutral-200 w-full focus:outline-none"
                    />
                  </div>
                  {errors.tags && (
                    <span className="text-red-400 text-sm mt-1">{errors.tags.message}</span>
                  )}
                </div>
              </div>
              
              {/* Companies */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Companies</span>
                </label>
                <div className="bg-black/30 border border-orange-500/30 rounded-lg p-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {companies.map((company, index) => (
                      <span 
                        key={index}
                        className="flex items-center bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md text-sm"
                      >
                        {company}
                        <button 
                          type="button"
                          onClick={() => removeItem(index, 'companies')}
                          className="ml-1 text-purple-500 hover:text-purple-300"
                          aria-label={`Remove ${company}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add companies (press Enter or comma)"
                    onKeyDown={(e) => handleAddItem(e, 'companies')}
                    className="input bg-transparent border-0 p-0 h-8 text-neutral-200 w-full focus:outline-none"
                  />
                </div>
              </div>
              
              {/* Hints */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Hints</span>
                </label>
                <div className="bg-black/30 border border-orange-500/30 rounded-lg p-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {hints.map((hint, index) => (
                      <span 
                        key={index}
                        className="flex items-center bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md text-sm"
                      >
                        {hint}
                        <button 
                          type="button"
                          onClick={() => removeItem(index, 'hints')}
                          className="ml-1 text-blue-500 hover:text-blue-300"
                          aria-label={`Remove ${hint}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add hints (press Enter or comma)"
                    onKeyDown={(e) => handleAddItem(e, 'hints')}
                    className="input bg-transparent border-0 p-0 h-8 text-neutral-200 w-full focus:outline-none"
                  />
                </div>
              </div>
              
              {/* Constraints */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-neutral-300">Constraints</span>
                </label>
                <div className="bg-black/30 border border-orange-500/30 rounded-lg p-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {constraints.map((constraint, index) => (
                      <span 
                        key={index}
                        className="flex items-center bg-green-500/20 text-green-300 px-2 py-1 rounded-md text-sm"
                      >
                        {constraint}
                        <button 
                          type="button"
                          onClick={() => removeItem(index, 'constraints')}
                          className="ml-1 text-green-500 hover:text-green-300"
                          aria-label={`Remove ${constraint}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add constraints (press Enter or comma)"
                    onKeyDown={(e) => handleAddItem(e, 'constraints')}
                    className="input bg-transparent border-0 p-0 h-8 text-neutral-200 w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Test Cases Card */}
          <motion.div 
            className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 shadow-lg shadow-orange-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-orange-400 mb-4 pb-2 border-b border-orange-500/30">
              Test Cases
            </h2>
            
            {/* Visible Test Cases */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-neutral-300">Visible Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="btn bg-orange-600 hover:bg-orange-700 border-none text-white"
                >
                  Add Visible Case
                </button>
              </div>
              
              <div className="space-y-4">
                {visibleFields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className="bg-black/30 border border-orange-500/30 p-4 rounded-lg space-y-3"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeVisible(index)}
                        className="btn btn-xs bg-red-600 hover:bg-red-700 border-none text-white"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Input</label>
                      <input
                        {...register(`visibleTestCases.${index}.input`)}
                        className="input bg-black/40 border border-orange-500/30 text-neutral-200 w-full"
                      />
                      {errors.visibleTestCases?.[index]?.input && (
                        <span className="text-red-400 text-sm">{errors.visibleTestCases[index].input.message}</span>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Output</label>
                      <input
                        {...register(`visibleTestCases.${index}.output`)}
                        className="input bg-black/40 border border-orange-500/30 text-neutral-200 w-full"
                      />
                      {errors.visibleTestCases?.[index]?.output && (
                        <span className="text-red-400 text-sm">{errors.visibleTestCases[index].output.message}</span>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Explanation</label>
                      <textarea
                        {...register(`visibleTestCases.${index}.explanation`)}
                        className="textarea bg-black/40 border border-orange-500/30 text-neutral-200 w-full"
                      />
                      {errors.visibleTestCases?.[index]?.explanation && (
                        <span className="text-red-400 text-sm">{errors.visibleTestCases[index].explanation.message}</span>
                      )}
                    </div>
                  </div>
                ))}
                {errors.visibleTestCases && (
                  <span className="text-red-400 text-sm">{errors.visibleTestCases.message}</span>
                )}
              </div>
            </div>

            {/* Hidden Test Cases */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-neutral-300">Hidden Test Cases</h3>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="btn bg-orange-600 hover:bg-orange-700 border-none text-white"
                >
                  Add Hidden Case
                </button>
              </div>
              
              <div className="space-y-4">
                {hiddenFields.map((field, index) => (
                  <div 
                    key={field.id} 
                    className="bg-black/30 border border-orange-500/30 p-4 rounded-lg space-y-3"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeHidden(index)}
                        className="btn btn-xs bg-red-600 hover:bg-red-700 border-none text-white"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Input</label>
                      <input
                        {...register(`hiddenTestCases.${index}.input`)}
                        className="input bg-black/40 border border-orange-500/30 text-neutral-200 w-full"
                      />
                      {errors.hiddenTestCases?.[index]?.input && (
                        <span className="text-red-400 text-sm">{errors.hiddenTestCases[index].input.message}</span>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Output</label>
                      <input
                        {...register(`hiddenTestCases.${index}.output`)}
                        className="input bg-black/40 border border-orange-500/30 text-neutral-200 w-full"
                      />
                      {errors.hiddenTestCases?.[index]?.output && (
                        <span className="text-red-400 text-sm">{errors.hiddenTestCases[index].output.message}</span>
                      )}
                    </div>
                  </div>
                ))}
                {errors.hiddenTestCases && (
                  <span className="text-red-400 text-sm">{errors.hiddenTestCases.message}</span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Code Templates Card */}
          <motion.div 
            className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 shadow-lg shadow-orange-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-orange-400 mb-4 pb-2 border-b border-orange-500/30">
              Code Templates
            </h2>
            
            <div className="space-y-8">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-5">
                  <h3 className="font-medium text-neutral-300 text-lg">
                    {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                  </h3>
                  
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Initial Code</label>
                    <div className="bg-black/40 border border-orange-500/30 rounded-lg p-3">
                      <textarea
                        {...register(`startCode.${index}.initialCode`)}
                        className="w-full bg-transparent text-neutral-200 font-mono text-sm focus:outline-none"
                        rows={6}
                      />
                      {errors.startCode?.[index]?.initialCode && (
                        <span className="text-red-400 text-sm">{errors.startCode[index].initialCode.message}</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Reference Solution</label>
                    <div className="bg-black/40 border border-orange-500/30 rounded-lg p-3">
                      <textarea
                        {...register(`referenceSolution.${index}.completeCode`)}
                        className="w-full bg-transparent text-neutral-200 font-mono text-sm focus:outline-none"
                        rows={6}
                      />
                      {errors.referenceSolution?.[index]?.completeCode && (
                        <span className="text-red-400 text-sm">{errors.referenceSolution[index].completeCode.message}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              type="button"
              onClick={clearFormData}
              className="btn bg-gray-700 hover:bg-gray-600 text-white py-3 text-lg font-semibold"
            >
              Clear Form
            </button>
            
            <button 
              type="submit" 
              className="btn bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 border-none text-white py-3 text-lg font-semibold flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creating...
                </>
              ) : 'Create Problem'}
            </button>
          </motion.div>
        </form>
      </motion.div>

      <div className='border-t border-orange-500/30 text-center p-4 mt-8 text-neutral-400'>
        <span>Copyright © 2025</span>
      </div>
    </div>
  );
}

export default CreateProblem;