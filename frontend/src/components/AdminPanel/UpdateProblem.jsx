// src/pages/UpdateProblem.jsx
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../../utils/axiosClient";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/Footer";
import { motion, AnimatePresence } from "framer-motion";
import MDEditor from "@uiw/react-md-editor";
import {
  PlusCircle,
  Trash2,
  Tag,
  Briefcase,
  Lightbulb,
  List,
  Code,
  Database,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl" />

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <Save className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="text-center">
              <motion.h3
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h3>

              <motion.p
                className="text-gray-300 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {message}
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex gap-4 justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Confirm
                    </>
                  )}
                </button>
              </motion.div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Success Modal Component
const SuccessModal = ({ isOpen, onClose, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-gradient-to-br from-green-900/90 to-green-800/90 border border-green-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl" />

            {/* Success animation */}
            <div className="flex justify-center mb-6">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="text-center">
              <motion.h3
                className="text-2xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h3>

              <motion.p
                className="text-green-100 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {message}
              </motion.p>

              <motion.button
                onClick={onClose}
                className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Zod Schema
const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag required"),
  companies: z
    .array(z.string().min(1, "Company cannot be empty"))
    .optional()
    .default([]),
  hints: z
    .array(z.string().min(1, "Hint cannot be empty"))
    .optional()
    .default([]),
  constraints: z
    .array(z.string().min(1, "Constraint cannot be empty"))
    .optional()
    .default([]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explaination: z.string().min(1, "Explanation is required"),
      })
    )
    .min(1, "At least one visible test case required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case required"),
  startCode: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      })
    )
    .length(3, "All three languages required"),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      })
    )
    .length(3, "All three languages required"),
});

// Main Component
export default function UpdateProblem() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [initialData, setInitialData] = useState(null);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(problemSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      tags: [],
      companies: [],
      hints: [],
      constraints: [],
      visibleTestCases: [{ input: "", output: "", explaination: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [
        { language: "C++", initialCode: "" },
        { language: "Java", initialCode: "" },
        { language: "JavaScript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" },
        { language: "JavaScript", completeCode: "" },
      ],
    },
  });

  // Field arrays
  const {
    fields: vis,
    append: addVis,
    remove: remVis,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hid,
    append: addHid,
    remove: remHid,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  // Controlled markdown → description
  useEffect(() => {
    setValue("description", markdown);
  }, [markdown, setValue]);

  // Fetch and prefill data
  useEffect(() => {
    async function loadProblem() {
      if (!problemId) {
        setError("No problem ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching problem with ID:", problemId);
        const { data } = await axiosClient.get(
          `/problem/ProblemById/${problemId}`
        );

        if (!data) {
          throw new Error("No problem data received");
        }

        setInitialData(data);
        setMarkdown(data.description || "");

        // Prepare form data with proper fallbacks
        const formData = {
          title: data.title || "",
          description: data.description || "",
          difficulty: data.difficulty || "easy",
          tags: Array.isArray(data.tags) ? data.tags : [],
          companies: Array.isArray(data.companies) ? data.companies : [],
          hints: Array.isArray(data.hints) ? data.hints : [],
          constraints: Array.isArray(data.constraints) ? data.constraints : [],

          visibleTestCases:
            Array.isArray(data.visibleTestCases) &&
            data.visibleTestCases.length > 0
              ? data.visibleTestCases.map((testCase) => ({
                  input: testCase.input || "",
                  output: testCase.output || "",
                  explaination:
                    testCase.explanation || testCase.explaination || "",
                }))
              : [{ input: "", output: "", explaination: "" }],

          hiddenTestCases:
            Array.isArray(data.hiddenTestCases) &&
            data.hiddenTestCases.length > 0
              ? data.hiddenTestCases.map((testCase) => ({
                  input: testCase.input || "",
                  output: testCase.output || "",
                }))
              : [{ input: "", output: "" }],

          startCode:
            Array.isArray(data.startCode) && data.startCode.length === 3
              ? data.startCode.map((code) => ({
                  language: code.language,
                  initialCode: code.initialCode || "",
                }))
              : [
                  {
                    language: "C++",
                    initialCode:
                      data.startCode?.find((s) => s.language === "C++")
                        ?.initialCode || "",
                  },
                  {
                    language: "Java",
                    initialCode:
                      data.startCode?.find((s) => s.language === "Java")
                        ?.initialCode || "",
                  },
                  {
                    language: "JavaScript",
                    initialCode:
                      data.startCode?.find((s) => s.language === "JavaScript")
                        ?.initialCode || "",
                  },
                ],

          referenceSolution:
            Array.isArray(data.referenceSolution) &&
            data.referenceSolution.length === 3
              ? data.referenceSolution.map((solution) => ({
                  language: solution.language,
                  completeCode: solution.completeCode || "",
                }))
              : [
                  {
                    language: "C++",
                    completeCode:
                      data.referenceSolution?.find((s) => s.language === "C++")
                        ?.completeCode || "",
                  },
                  {
                    language: "Java",
                    completeCode:
                      data.referenceSolution?.find((s) => s.language === "Java")
                        ?.completeCode || "",
                  },
                  {
                    language: "JavaScript",
                    completeCode:
                      data.referenceSolution?.find(
                        (s) => s.language === "JavaScript"
                      )?.completeCode || "",
                  },
                ],
        };

        reset(formData);
      } catch (err) {
        console.error("Error loading problem:", err);
        setError(
          `Failed to load problem: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    }

    loadProblem();
  }, [problemId, reset]);

  // Generic tag-like input handler
  function handleAdd(e, field) {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val) {
        const arr = watch(field) || [];
        if (!arr.includes(val)) {
          setValue(field, [...arr, val]);
          e.target.value = "";
        }
      }
    }
  }

  function handleRemove(idx, field) {
    const arr = [...(watch(field) || [])];
    arr.splice(idx, 1);
    setValue(field, arr);
  }

  // Form submission handler - show confirmation modal
  function onSubmit(formData) {
    setPendingFormData(formData);
    setShowConfirmModal(true);
  }

  // Actual submission after confirmation
  async function handleConfirmedSubmit() {
    if (!pendingFormData || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      console.log("Submitting form data:", pendingFormData);

      const cleanData = {
        ...pendingFormData,
        companies: pendingFormData.companies || [],
        hints: pendingFormData.hints || [],
        constraints: pendingFormData.constraints || [],
      };

      console.log("Sending update request to:", `/problem/update/${problemId}`);

      const response = await axiosClient.put(
        `/problem/update/${problemId}`,
        cleanData
      );

      console.log("Update response:", response.data);

      // Close confirmation modal and show success modal
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error("Error updating problem:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update problem";
      setError(errorMessage);
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
      setPendingFormData(null);
    }
  }

  // Handle success modal close
  function handleSuccessClose() {
    setShowSuccessModal(false);
    navigate("/admin");
  }

  // Handle cancel confirmation
  function handleCancelConfirmation() {
    setShowConfirmModal(false);
    setPendingFormData(null);
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ ease: "linear", duration: 1, repeat: Infinity }}
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white">Loading problem data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !initialData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white mb-4">{error}</p>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Go Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')",
        backgroundSize: "cover",
      }}
    >
      <Navbar />

      <motion.main
        className="container mx-auto p-6 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Update Problem: {initialData?.title || "Loading..."}
          </h1>
        </div>

        {/* Error display */}
        {error && (
          <motion.div
            className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ---- BASIC INFO ---- */}
          <motion.section
            className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-orange-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-orange-400 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-300 font-medium">Title *</span>
                <input
                  {...register("title")}
                  className={`w-full p-3 mt-1 bg-gray-900 rounded-lg border transition-colors ${
                    errors.title
                      ? "border-red-500 focus:border-red-400"
                      : "border-gray-700 focus:border-orange-500"
                  }`}
                  placeholder="Enter problem title..."
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-gray-300 font-medium">Description *</span>
                <div className="mt-1">
                  <MDEditor
                    value={markdown}
                    onChange={setMarkdown}
                    height={250}
                    preview="live"
                    data-color-mode="dark"
                    textareaProps={{
                      placeholder:
                        "Enter problem description using Markdown...",
                    }}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </label>

              <label className="block">
                <span className="text-gray-300 font-medium">Difficulty *</span>
                <select
                  {...register("difficulty")}
                  className={`w-full p-3 mt-1 bg-gray-900 rounded-lg border transition-colors ${
                    errors.difficulty ? "border-red-500" : "border-gray-700"
                  }`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {errors.difficulty && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.difficulty.message}
                  </p>
                )}
              </label>
            </div>
          </motion.section>

          {/* ---- TAGS & META ---- */}
          <motion.section
            className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-orange-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-orange-400">
              Tags & Metadata
            </h2>

            {[
              {
                name: "tags",
                icon: <Tag size={18} className="text-orange-400" />,
                required: true,
              },
              {
                name: "companies",
                icon: <Briefcase size={18} className="text-indigo-400" />,
                required: false,
              },
              {
                name: "hints",
                icon: <Lightbulb size={18} className="text-yellow-400" />,
                required: false,
              },
              {
                name: "constraints",
                icon: <List size={18} className="text-red-400" />,
                required: false,
              },
            ].map(({ name, icon, required }) => {
              const arr = watch(name) || [];
              const err = errors[name]?.message;
              return (
                <div key={name} className="mb-6">
                  <span className="flex items-center gap-2 text-gray-300 mb-2 font-medium">
                    {icon}
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                    {required && <span className="text-red-400">*</span>}
                  </span>
                  <div
                    className={`flex flex-wrap gap-2 p-3 bg-gray-900 rounded-lg border min-h-[50px] transition-colors ${
                      err
                        ? "border-red-500"
                        : "border-gray-700 focus-within:border-orange-500"
                    }`}
                  >
                    {arr.map((v, i) => (
                      <motion.span
                        key={i}
                        className="flex items-center gap-1 bg-orange-600/20 text-orange-300 px-3 py-1 rounded-full text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        {v}
                        <button
                          type="button"
                          onClick={() => handleRemove(i, name)}
                          className="ml-1 hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                    <input
                      placeholder={`Add ${name}... (Press Enter or comma)`}
                      className="flex-1 min-w-[200px] bg-transparent outline-none text-gray-200 placeholder-gray-500"
                      onKeyDown={(e) => handleAdd(e, name)}
                    />
                  </div>
                  {err && <p className="text-red-400 text-sm mt-1">{err}</p>}
                </div>
              );
            })}
          </motion.section>

          {/* ---- TEST CASES ---- */}
          <motion.section
            className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-orange-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6 text-orange-400">
              Test Cases
            </h2>

            {/* Visible Test Cases */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code size={18} className="text-green-400" />
                  <span className="text-gray-300 font-medium">
                    Visible Test Cases
                  </span>
                  <span className="text-red-400">*</span>
                  <span className="text-sm text-gray-500">
                    ({vis.length} cases)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addVis({ input: "", output: "", explaination: "" })
                  }
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <PlusCircle size={16} />
                  Add Case
                </button>
              </div>

              <div className="space-y-4">
                {vis.map((field, i) => (
                  <motion.div
                    key={field.id}
                    className="bg-gray-900/50 p-4 rounded-lg border border-gray-700"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-400">
                        Visible Test Case #{i + 1}
                      </h4>
                      {vis.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remVis(i)}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Input
                        </label>
                        <textarea
                          {...register(`visibleTestCases.${i}.input`)}
                          placeholder="Enter input..."
                          className="w-full p-2 bg-gray-800 rounded border border-gray-600 text-sm font-mono"
                          rows={3}
                        />
                        {errors.visibleTestCases?.[i]?.input && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.visibleTestCases[i].input.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Output
                        </label>
                        <textarea
                          {...register(`visibleTestCases.${i}.output`)}
                          placeholder="Expected output..."
                          className="w-full p-2 bg-gray-800 rounded border border-gray-600 text-sm font-mono"
                          rows={3}
                        />
                        {errors.visibleTestCases?.[i]?.output && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.visibleTestCases[i].output.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Explanation
                        </label>
                        <textarea
                          {...register(`visibleTestCases.${i}.explaination`)}
                          placeholder="Explain the test case..."
                          className="w-full p-2 bg-gray-800 rounded border border-gray-600 text-sm"
                          rows={3}
                        />
                        {errors.visibleTestCases?.[i]?.explaination && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.visibleTestCases[i].explaination.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hidden Test Cases */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Database size={18} className="text-red-400" />
                  <span className="text-gray-300 font-medium">
                    Hidden Test Cases
                  </span>
                  <span className="text-red-400">*</span>
                  <span className="text-sm text-gray-500">
                    ({hid.length} cases)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => addHid({ input: "", output: "" })}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <PlusCircle size={16} />
                  Add Case
                </button>
              </div>

              <div className="space-y-4">
                {hid.map((field, i) => (
                  <motion.div
                    key={field.id}
                    className="bg-gray-900/50 p-4 rounded-lg border border-gray-700"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-400">
                        Hidden Test Case #{i + 1}
                      </h4>
                      {hid.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remHid(i)}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Input
                        </label>
                        <textarea
                          {...register(`hiddenTestCases.${i}.input`)}
                          placeholder="Enter input..."
                          className="w-full p-2 bg-gray-800 rounded border border-gray-600 text-sm font-mono"
                          rows={3}
                        />
                        {errors.hiddenTestCases?.[i]?.input && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.hiddenTestCases[i].input.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Output
                        </label>
                        <textarea
                          {...register(`hiddenTestCases.${i}.output`)}
                          placeholder="Expected output..."
                          className="w-full p-2 bg-gray-800 rounded border border-gray-600 text-sm font-mono"
                          rows={3}
                        />
                        {errors.hiddenTestCases?.[i]?.output && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.hiddenTestCases[i].output.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ---- CODE TEMPLATES ---- */}
          <motion.section
            className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-orange-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-6 text-orange-400">
              Code Templates
            </h2>

            <div className="space-y-8">
              {/* Start Code */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-300">
                  Initial Code Templates
                </h3>
                {watch("startCode")?.map((_, i) => (
                  <div key={i} className="mb-6">
                    <h4 className="text-md font-medium mb-2 text-gray-400">
                      {watch(`startCode.${i}.language`)}
                    </h4>
                    <textarea
                      {...register(`startCode.${i}.initialCode`)}
                      rows={6}
                      className="w-full bg-gray-900 p-3 rounded-lg border border-gray-700 placeholder-gray-500 font-mono text-sm focus:border-orange-500 transition-colors"
                      placeholder={`Enter initial ${watch(`startCode.${i}.language`)} code template...`}
                    />
                    {errors.startCode?.[i]?.initialCode && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.startCode[i].initialCode.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Reference Solutions */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-300">
                  Reference Solutions
                </h3>
                {watch("referenceSolution")?.map((_, i) => (
                  <div key={i} className="mb-6">
                    <h4 className="text-md font-medium mb-2 text-gray-400">
                      {watch(`referenceSolution.${i}.language`)}
                    </h4>
                    <textarea
                      {...register(`referenceSolution.${i}.completeCode`)}
                      rows={8}
                      className="w-full bg-gray-900 p-3 rounded-lg border border-gray-700 placeholder-gray-500 font-mono text-sm focus:border-orange-500 transition-colors"
                      placeholder={`Enter complete ${watch(`referenceSolution.${i}.language`)} solution...`}
                    />
                    {errors.referenceSolution?.[i]?.completeCode && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.referenceSolution[i].completeCode.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ---- SUBMIT SECTION ---- */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              type="button"
              onClick={() => navigate("/admin")}
              disabled={submitting}
              className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || Object.keys(errors).length > 0}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={16} />
              Update Problem
            </button>
          </motion.div>
        </form>
      </motion.main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelConfirmation}
        onConfirm={handleConfirmedSubmit}
        title="Confirm Update"
        message={`Are you sure you want to update "${initialData?.title}"? This action will modify the existing problem with your changes.`}
        isLoading={submitting}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Problem Updated Successfully!"
        message="Your changes have been saved and the problem has been updated successfully."
      />

      <Footer />
    </div>
  );
}
