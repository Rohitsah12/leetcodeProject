import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Landing/Navbar';
import Footer from '../Landing/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';


// Zod schema for form validation
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


// Arrow Left Icon SVG Component
const ArrowLeftIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H6"/>
  </svg>
);


// Help Icon SVG Component
const HelpIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);


// Success Icon SVG Component
const SuccessIcon = () => (
  <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


// Error Icon SVG Component
const ErrorIcon = () => (
  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


// Two Sum example data to pre-fill the form
const twoSumExampleData = {
  title: "Two Sum",
  description: "# Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.\n\nYou can return the answer in any order.\n\n## Example 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\n## Example 2:\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\n## Example 3:\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\n## Follow-up:\nCan you come up with an algorithm that is less than O(n²) time complexity?",
  difficulty: "easy",
  tags: ["Array", "Hash Table"],
  companies: ["Google", "Amazon"],
  hints: ["A really brute force way would be to search for all possible pairs of numbers but that would be too slow.", "The best way to maintain a mapping of each element in the array to its index is a hash table."],
  constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists."],
  visibleTestCases: [
    { input: "2 7 11 15\n9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
    { input: "3 2 4\n6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]." },
    { input: "3 3\n6", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]." }
  ],
  hiddenTestCases: [
    { input: "1 2 3 4 5\n9", output: "[3,4]" },
    { input: "-1 -2 -3 -4 -5\n-8", output: "[2,4]" },
    { input: "0 4 3 0\n0", output: "[0,3]" },
    { input: "-3 4 3 90\n0", output: "[0,2]" },
    { input: "1 1 1 1 1 4 1 1 1 1 1 7 1 1 1 1 1\n11", output: "[5,11]" }
  ],
  startCode: [
    { language: "C++", initialCode: "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        \n    }\n};" },
    { language: "Java", initialCode: "import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}" },
    { language: "JavaScript", initialCode: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your code here\n    \n};" }
  ],
  referenceSolution: [
    { language: "C++", completeCode: "#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <algorithm>\n#include <unordered_map>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> numMap;\n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            if (numMap.find(complement) != numMap.end()) {\n                return {numMap[complement], i};\n            }\n            numMap[nums[i]] = i;\n        }\n        return {};\n    }\n};\n\nint main() {\n    std::ios_base::sync_with_stdio(false);\n    std::cin.tie(NULL);\n    string line;\n    getline(cin, line);\n    stringstream ss(line);\n    vector<int> nums;\n    int num;\n    while (ss >> num) {\n        nums.push_back(num);\n    }\n    int target;\n    cin >> target;\n    Solution sol;\n    vector<int> result = sol.twoSum(nums, target);\n    sort(result.begin(), result.end());\n    cout << \"[\";\n    for (size_t i = 0; i < result.size(); ++i) {\n        cout << result[i];\n        if (i < result.size() - 1) {\n            cout << \",\";\n        }\n    }\n    cout << \"]\" << endl;\n    return 0;\n}" },
    { language: "Java", completeCode: "import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    static class Solution {\n        public int[] twoSum(int[] nums, int target) {\n            Map<Integer, Integer> numMap = new HashMap<>();\n            for (int i = 0; i < nums.length; i++) {\n                int complement = target - nums[i];\n                if (numMap.containsKey(complement)) {\n                    return new int[]{numMap.get(complement), i};\n                }\n                numMap.put(nums[i], i);\n            }\n            return new int[]{}; \n        }\n    }\n\n    public static void main(String[] args) throws IOException {\n        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));\n        String[] numsStr = reader.readLine().trim().split(\" \");\n        int[] nums = new int[numsStr.length];\n        for (int i = 0; i < numsStr.length; i++) {\n            nums[i] = Integer.parseInt(numsStr[i]);\n        }\n        int target = Integer.parseInt(reader.readLine().trim());\n\n        Solution sol = new Solution();\n        int[] result = sol.twoSum(nums, target);\n        \n        Arrays.sort(result);\n        \n        System.out.println(Arrays.toString(result).replaceAll(\"\\\\s\", \"\"));\n    }\n}" },
    { language: "JavaScript", completeCode: "const readline = require('readline');\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout,\n    terminal: false\n});\n\nlet lines = [];\nrl.on('line', (line) => {\n    lines.push(line);\n    if (lines.length === 2) {\n        rl.close();\n    }\n});\n\nrl.on('close', () => {\n    const nums = lines[0].split(' ').map(Number);\n    const target = Number(lines[1]);\n\n    var twoSum = function(nums, target) {\n        const numMap = new Map();\n        for (let i = 0; i < nums.length; i++) {\n            const complement = target - nums[i];\n            if (numMap.has(complement)) {\n                return [numMap.get(complement), i];\n            }\n            numMap.set(nums[i], i);\n        }\n        return [];\n    };\n\n    const result = twoSum(nums, target);\n    result.sort((a,b) => a - b);\n    console.log(JSON.stringify(result));\n});" }
  ]
};


// Define empty form values
const emptyFormValues = {
  title: '',
  description: '',
  difficulty: 'easy',
  tags: [],
  companies: [],
  hints: [],
  constraints: [],
  visibleTestCases: [],
  hiddenTestCases: [],
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


function CreateProblem() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pendingFormData, setPendingFormData] = useState(null);
  
  // Get initial form values
  const getInitialValues = () => {
    const savedFormData = localStorage.getItem('createProblemForm');
    return savedFormData ? JSON.parse(savedFormData) : emptyFormValues;
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
    defaultValues: getInitialValues()
  });


  const formData = watch();
  const markdownValue = watch('description');


  useEffect(() => {
    // Only save to localStorage if form has data
    const hasData = Object.values(formData).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      return false;
    });
    
    if (hasData) {
      localStorage.setItem('createProblemForm', JSON.stringify(formData));
    }
  }, [formData]);


  // Fixed clear form function
  const clearFormData = () => {
    // Remove from localStorage first
    localStorage.removeItem('createProblemForm');
    // Reset form to empty values
    reset(emptyFormValues);
  };


  const fillWithExample = () => {
    reset(twoSumExampleData);
    setIsHelpModalOpen(false);
  };


  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: 'visibleTestCases' });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: 'hiddenTestCases' });


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


  const removeItem = (index, fieldName) => {
    const currentItems = [...(watch(fieldName) || [])];
    currentItems.splice(index, 1);
    setValue(fieldName, currentItems);
  };


  const onSubmit = (data) => {
    setPendingFormData(data);
    setIsConfirmModalOpen(true);
  };


  const confirmSubmit = async () => {
    setIsConfirmModalOpen(false);
    setIsLoading(true);
    
    try {
      const response = await axiosClient.post('/problem/create', pendingFormData);
      localStorage.removeItem('createProblemForm');
      setSuccessMessage(response.data?.message || 'Problem created successfully!');
      setIsSuccessModalOpen(true);
      
      // Auto close success modal and navigate after 3 seconds
      setTimeout(() => {
        setIsSuccessModalOpen(false);
        navigate('/admin');
      }, 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred while creating the problem.';
      setErrorMessage(errorMsg);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
      setPendingFormData(null);
    }
  };


  // Helper component for array input fields
  const ArrayInput = ({ fieldName, placeholder, color }) => {
    const items = watch(fieldName) || [];
    const colorClasses = {
      orange: 'bg-orange-500/20 text-orange-300',
      purple: 'bg-purple-500/20 text-purple-300',
      blue: 'bg-blue-500/20 text-blue-300',
      green: 'bg-green-500/20 text-green-300'
    };
    const buttonColorClasses = {
      orange: 'text-orange-500 hover:text-orange-300',
      purple: 'text-purple-500 hover:text-purple-300',
      blue: 'text-blue-500 hover:text-blue-300',
      green: 'text-green-500 hover:text-green-300'
    };


    return (
      <div className={`bg-black/30 border ${errors[fieldName] ? 'border-red-500' : 'border-orange-500/30'} rounded-lg p-2`}>
        <div className="flex flex-wrap gap-2 mb-2">
          {items.map((item, index) => (
            <span key={index} className={`flex items-center ${colorClasses[color]} px-2 py-1 rounded-md text-sm`}>
              {item}
              <button type="button" onClick={() => removeItem(index, fieldName)} className={`ml-1 ${buttonColorClasses[color]}`}>&times;</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          onKeyDown={(e) => handleAddItem(e, fieldName)}
          className="input bg-transparent border-0 p-0 h-8 text-neutral-200 w-full focus:outline-none"
        />
      </div>
    );
  };


  return (
    <div className="min-h-screen" style={{ backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Navbar />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to Admin Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors duration-200 group"
          >
            <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back to Admin Panel</span>
          </button>
        </motion.div>

        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4">
            <motion.h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              Create New Problem
            </motion.h1>
            <motion.button type="button" onClick={() => setIsHelpModalOpen(true)} className="text-orange-400 hover:text-orange-200 transition-colors" aria-label="Help" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <HelpIcon />
            </motion.button>
          </div>
          <p className="text-neutral-300">Add a new coding challenge to the platform</p>
        </div>


        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <motion.div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 shadow-lg shadow-orange-500/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-orange-500/30">
              <h2 className="text-xl font-semibold text-orange-400">Basic Information</h2>
              <button type="button" onClick={clearFormData} className="btn btn-xs bg-red-600 hover:bg-red-700 text-white border-none">
                Clear Form
              </button>
            </div>
            <div className="space-y-5">
              <div className="form-control">
                <label className="label"><span className="label-text text-neutral-300">Title</span></label>
                <input {...register('title')} className={`input bg-black/30 border border-orange-500/30 text-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${errors.title && 'border-red-500'}`} />
                {errors.title && <span className="text-red-400 text-sm mt-1">{errors.title.message}</span>}
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-neutral-300">Description</span></label>
                <div className={`relative rounded-lg overflow-hidden ${errors.description ? 'border border-red-500' : ''}`}>
                  <div className="bg-black/30 border border-orange-500/30 rounded-lg overflow-hidden">
                    <MDEditor
                      value={markdownValue}
                      onChange={(val) => setValue('description', val || '', { shouldValidate: true })}
                      height={300}
                      preview="live"
                      data-color-mode="dark"
                      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', border: 'none' }}
                      textareaProps={{ placeholder: 'Enter problem description using Markdown...' }}
                    />
                  </div>
                  {errors.description && <span className="text-red-400 text-sm mt-1 block">{errors.description.message}</span>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control">
                  <label className="label"><span className="label-text text-neutral-300">Difficulty</span></label>
                  <select {...register('difficulty')} className={`select bg-black/30 border border-orange-500/30 text-neutral-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${errors.difficulty && 'border-red-500'}`}>
                    <option value="easy" className="bg-black text-green-400">Easy</option>
                    <option value="medium" className="bg-black text-yellow-400">Medium</option>
                    <option value="hard" className="bg-black text-red-400">Hard</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text text-neutral-300">Tags</span></label>
                  <ArrayInput fieldName="tags" placeholder="Add tags (press Enter or comma)" color="orange" />
                  {errors.tags && <span className="text-red-400 text-sm mt-1">{errors.tags.message}</span>}
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-neutral-300">Companies</span></label>
                <ArrayInput fieldName="companies" placeholder="Add companies (press Enter or comma)" color="purple" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-neutral-300">Hints</span></label>
                <ArrayInput fieldName="hints" placeholder="Add hints (press Enter or comma)" color="blue" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-neutral-300">Constraints</span></label>
                <ArrayInput fieldName="constraints" placeholder="Add constraints (press Enter or comma)" color="green" />
              </div>
            </div>
          </motion.div>


          {/* Test Cases Card */}
          <motion.div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 shadow-lg shadow-orange-500/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-semibold text-orange-400 mb-4 pb-2 border-b border-orange-500/30">Test Cases</h2>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-neutral-300">Visible Test Cases</h3>
                <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn bg-orange-600 hover:bg-orange-700 border-none text-white">Add Visible Case</button>
              </div>
              <div className="space-y-4">
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="bg-black/30 border border-orange-500/30 p-4 rounded-lg space-y-3">
                    <div className="flex justify-end"><button type="button" onClick={() => removeVisible(index)} className="btn btn-xs bg-red-600 hover:bg-red-700 border-none text-white">Remove</button></div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Input</label>
                      <textarea {...register(`visibleTestCases.${index}.input`)} className="textarea bg-black/40 border border-orange-500/30 text-neutral-200 w-full font-mono" rows={2}/>
                      {errors.visibleTestCases?.[index]?.input && <span className="text-red-400 text-sm">{errors.visibleTestCases[index].input.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Output</label>
                      <input {...register(`visibleTestCases.${index}.output`)} className="input bg-black/40 border border-orange-500/30 text-neutral-200 w-full font-mono" />
                      {errors.visibleTestCases?.[index]?.output && <span className="text-red-400 text-sm">{errors.visibleTestCases[index].output.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Explanation</label>
                      <textarea {...register(`visibleTestCases.${index}.explanation`)} className="textarea bg-black/40 border border-orange-500/30 text-neutral-200 w-full" rows={2}/>
                      {errors.visibleTestCases?.[index]?.explanation && <span className="text-red-400 text-sm">{errors.visibleTestCases[index].explanation.message}</span>}
                    </div>
                  </div>
                ))}
                {errors.visibleTestCases && <span className="text-red-400 text-sm">{errors.visibleTestCases.message || errors.visibleTestCases.root?.message}</span>}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-neutral-300">Hidden Test Cases</h3>
                <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn bg-orange-600 hover:bg-orange-700 border-none text-white">Add Hidden Case</button>
              </div>
              <div className="space-y-4">
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="bg-black/30 border border-orange-500/30 p-4 rounded-lg space-y-3">
                    <div className="flex justify-end"><button type="button" onClick={() => removeHidden(index)} className="btn btn-xs bg-red-600 hover:bg-red-700 border-none text-white">Remove</button></div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Input</label>
                      <textarea {...register(`hiddenTestCases.${index}.input`)} className="textarea bg-black/40 border border-orange-500/30 text-neutral-200 w-full font-mono" rows={2}/>
                      {errors.hiddenTestCases?.[index]?.input && <span className="text-red-400 text-sm">{errors.hiddenTestCases[index].input.message}</span>}
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Output</label>
                      <input {...register(`hiddenTestCases.${index}.output`)} className="input bg-black/40 border border-orange-500/30 text-neutral-200 w-full font-mono" />
                      {errors.hiddenTestCases?.[index]?.output && <span className="text-red-400 text-sm">{errors.hiddenTestCases[index].output.message}</span>}
                    </div>
                  </div>
                ))}
                {errors.hiddenTestCases && <span className="text-red-400 text-sm">{errors.hiddenTestCases.message || errors.hiddenTestCases.root?.message}</span>}
              </div>
            </div>
          </motion.div>


          {/* Code Templates Card */}
          <motion.div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 shadow-lg shadow-orange-500/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h2 className="text-xl font-semibold text-orange-400 mb-4 pb-2 border-b border-orange-500/30">Code Templates</h2>
            <div className="space-y-8">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-5">
                  <h3 className="font-medium text-neutral-300 text-lg">{index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}</h3>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Initial Code</label>
                    <div className="bg-black/40 border border-orange-500/30 rounded-lg p-3">
                      <textarea {...register(`startCode.${index}.initialCode`)} className="w-full bg-transparent text-neutral-200 font-mono text-sm focus:outline-none" rows={6} />
                      {errors.startCode?.[index]?.initialCode && <span className="text-red-400 text-sm">{errors.startCode[index].initialCode.message}</span>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Reference Solution</label>
                    <div className="bg-black/40 border border-orange-500/30 rounded-lg p-3">
                      <textarea {...register(`referenceSolution.${index}.completeCode`)} className="w-full bg-transparent text-neutral-200 font-mono text-sm focus:outline-none" rows={10} />
                      {errors.referenceSolution?.[index]?.completeCode && <span className="text-red-400 text-sm">{errors.referenceSolution[index].completeCode.message}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>


          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4">
            <button type="submit" className="btn bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 border-none text-white py-3 text-lg font-semibold flex-1" disabled={isLoading}>
              {isLoading ? <><span className="loading loading-spinner"></span>Creating...</> : 'Create Problem'}
            </button>
          </motion.div>
        </form>
      </motion.div>


      <Footer />


      {/* Help Modal */}
      <AnimatePresence>
        {isHelpModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setIsHelpModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-neutral-900 border border-orange-500/30 rounded-2xl p-6 shadow-lg shadow-orange-500/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-orange-400">How to Create a Problem</h2>
                <button onClick={() => setIsHelpModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>
              <div className="space-y-4 text-neutral-300">
                <p>Follow these guidelines to ensure your problem is set up correctly for the online judge.</p>
                
                <details className="bg-black/30 p-3 rounded-lg border border-orange-500/20">
                  <summary className="cursor-pointer font-semibold text-orange-300">Test Case Input Formatting</summary>
                  <div className="mt-2 space-y-2 text-sm">
                    <p>For problems requiring multiple inputs (like an array and a target number), format the `Input` field with each piece of data on a new line.</p>
                    <p><strong>Example (Two Sum):</strong></p>
                    <pre className="bg-black/50 p-2 rounded text-xs font-mono">
                      2 7 11 15{'\n'}
                      9
                    </pre>
                    <p>The first line is the space-separated array, and the second line is the target number.</p>
                  </div>
                </details>


                <details className="bg-black/30 p-3 rounded-lg border border-orange-500/20">
                  <summary className="cursor-pointer font-semibold text-orange-300">Reference Solution Code</summary>
                  <div className="mt-2 space-y-2 text-sm">
                    <p>Your `Reference Solution` code must be a complete, runnable program that reads from standard input (`stdin`) and prints to standard output (`stdout`).</p>
                    <p>It must include all necessary boilerplate to handle I/O, not just the function definition.</p>
                    <p><strong>Example (JavaScript):</strong></p>
                    <pre className="bg-black/50 p-2 rounded text-xs font-mono overflow-x-auto">
{`const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });


// Read input lines
let lines = [];
rl.on('line', (line) => lines.push(line));


rl.on('close', () => {
    const nums = lines[0].split(' ').map(Number);
    const target = Number(lines[1]);


    // Your solution logic here
    const result = twoSum(nums, target);
    
    // Print the final result to stdout
    console.log(JSON.stringify(result));
});


// The function to be tested
function twoSum(nums, target) {
    // ... implementation
};`}
                    </pre>
                  </div>
                </details>


                <div className="pt-4 border-t border-orange-500/20">
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Need a Template?</h3>
                  <p className="text-sm mb-3">Click the button below to fill the entire form with a complete, correctly formatted example based on the "Two Sum" problem. You can then edit the fields as needed.</p>
                  <button onClick={fillWithExample} className="btn bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 border-none text-white w-full">
                    Fill with 'Two Sum' Example
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-neutral-900 border border-orange-500/30 rounded-2xl p-6 shadow-lg shadow-orange-500/20 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-orange-400 mb-2">Confirm Problem Creation</h3>
                <p className="text-neutral-300 mb-6">Are you sure you want to create this problem? This action cannot be undone.</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsConfirmModalOpen(false)}
                    className="btn bg-gray-600 hover:bg-gray-700 text-white flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSubmit}
                    className="btn bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 border-none text-white flex-1"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-neutral-900 border border-green-500/30 rounded-2xl p-6 shadow-lg shadow-green-500/20 max-w-md w-full"
            >
              <div className="text-center">
                <SuccessIcon />
                <h3 className="text-xl font-bold text-green-400 mb-2">Success!</h3>
                <p className="text-neutral-300 mb-4">{successMessage}</p>
                <p className="text-sm text-neutral-400">Redirecting to admin panel...</p>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setIsSuccessModalOpen(false);
                      navigate('/admin');
                    }}
                    className="btn bg-green-600 hover:bg-green-700 text-white"
                  >
                    Go to Admin Panel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Error Modal */}
      <AnimatePresence>
        {isErrorModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-neutral-900 border border-red-500/30 rounded-2xl p-6 shadow-lg shadow-red-500/20 max-w-md w-full"
            >
              <div className="text-center">
                <ErrorIcon />
                <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
                <p className="text-neutral-300 mb-6">{errorMessage}</p>
                <button
                  onClick={() => setIsErrorModalOpen(false)}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default CreateProblem;
