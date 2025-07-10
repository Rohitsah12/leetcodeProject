import React, { useRef, useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Timer,
  Fullscreen,
  Share2,
  Minimize2,
  Check,
  X,
  Search,
  Code,
  Edit,
  Clock,
  SparkleIcon,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MessagesSquare,
  Tag,
  Building,
  Plus,
  Copy,
  Settings,
  Monitor,
  WrapText,
  UploadCloud as CloudUpload,
  User,
  UserCircle,
  Pause,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";
import Editorial from "../components/Problem/Editorial";
import SubmissionHistory from "../components/Problem/SubmissionHistory";
import ChatAI from "../components/Problem/ChatAI";
import Editor from "@monaco-editor/react";
import { useSelector } from "react-redux";

const ProblemPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const fullscreenRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showProblemList, setShowProblemList] = useState(false);
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentProblem, setCurrentProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");

  // Timer state
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Code editor state
  const [selectedLanguage, setSelectedLanguage] = useState("c++");
  const [code, setCode] = useState("");
  const [editorOptions, setEditorOptions] = useState({
    fontSize: 12,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: "on",
    lineNumbers: "on",
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    mouseWheelZoom: true,
    theme: "vs-dark",
  });
  const [submitResult, setSubmitResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [_, setSubmissionTime] = useState(0);

  // New state for bottom panel
  const [bottomTab, setBottomTab] = useState("testcases"); // 'testcases' or 'results'
  const [customTestCases, setCustomTestCases] = useState([]);
  const [runResults, setRunResults] = useState(null);

  // Refs for scrolling to sections
  const tagsRef = useRef(null);
  const companiesRef = useRef(null);

  // Resizable panels state
  const [leftWidth, setLeftWidth] = useState(60);
  const [editorHeight, setEditorHeight] = useState(70);
  const [isResizing, setIsResizing] = useState(false);
  const [isVerticalResizing, setIsVerticalResizing] = useState(false);
  const containerRef = useRef(null);

  const [openTags, setOpenTags] = useState(false);
  const [openCompanies, setOpenCompanies] = useState(false);
  const [openHints, setOpenHints] = useState(false);
  const [openDiscussion, setOpenDiscussion] = useState(false);
  const [hintVisibility, setHintVisibility] = useState({});

  const { user } = useSelector((state) => state.auth);

  const languages = [
    { id: "c++", label: "C++" },
    { id: "java", label: "Java" },
    { id: "javascript", label: "JavaScript" },
  ];

  // Timer functions
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    setShowTimer(true);
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const hideTimer = () => {
    setShowTimer(false);
    setIsTimerRunning(false);
  };

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && showTimer) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, showTimer]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Reset problem-specific states when problemId changes
  const resetProblemState = () => {
    setCustomTestCases([]);
    setRunResults(null);
    setSubmitResult(null);
    setBottomTab("testcases");
    setCode("// Loading problem...");
    setHintVisibility({});
    setOpenTags(false);
    setOpenCompanies(false);
    setOpenHints(false);
    setOpenDiscussion(false);
    setActiveLeftTab("description");
  };

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/problem/getAllProblem");
        setProblems(response.data);

        if (response.data.length > 0) {
          const problem = problemId
            ? response.data.find((p) => p._id === problemId)
            : response.data[0];
          setCurrentProblem(problem || response.data[0]);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load problems. Please try again later.");
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [problemId]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        resetProblemState(); // Reset state before fetching new problem

        const response = await axiosClient.get(
          `/problem/ProblemById/${problemId}`
        );

        if (response?.data) {
          setCurrentProblem(response.data);
          console.log(response.data);
          

          // Initialize hint visibility to false
          const hintsVisibility = {};
          if (response.data.hints) {
            response.data.hints.forEach((_, idx) => {
              hintsVisibility[idx] = false;
            });
          }
          setHintVisibility(hintsVisibility);

          // Set initial code
          const initialCode =
            response.data.startCode?.find(
              (sc) => sc.language.toLowerCase() === selectedLanguage
            )?.initialCode || "// Write your code here";
          setCode(initialCode);
        } else {
          console.warn("Empty response data:", response);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load problem. Please try again later.");
        console.error("Error fetching problem:", err);
      } finally {
        setLoading(false);
      }
    };

    if (problemId) fetchProblem();
  }, [problemId, selectedLanguage]);

  const filteredProblems = useMemo(() => {
    if (!searchTerm.trim()) return problems;
    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [problems, searchTerm]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const mouseX = e.clientX - containerRect.left;
        const newLeftWidth = (mouseX / containerWidth) * 100;

        if (newLeftWidth >= 30 && newLeftWidth <= 80) {
          setLeftWidth(newLeftWidth);
        }
      }

      if (isVerticalResizing) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerHeight = containerRect.height;
        const mouseY = e.clientY - containerRect.top;
        const newEditorHeight = (mouseY / containerHeight) * 100;

        if (newEditorHeight >= 30 && newEditorHeight <= 90) {
          setEditorHeight(newEditorHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsVerticalResizing(false);
    };

    if (isResizing || isVerticalResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isVerticalResizing]);

  const toggleFullscreen = () => {
    const elem = fullscreenRef.current;
    if (!isFullscreen) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy URL" + err);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(!!isFs);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  // Navigation handlers for chevron buttons
  const handlePrevProblem = () => {
    if (currentProblem) {
      const currentIndex = problems.findIndex(
        (p) => p._id === currentProblem._id
      );
      if (currentIndex > 0) {
        const prevProblem = problems[currentIndex - 1];
        navigate(`/problem/${prevProblem._id}`);
      }
    }
  };

  const handleNextProblem = () => {
    if (currentProblem) {
      const currentIndex = problems.findIndex(
        (p) => p._id === currentProblem._id
      );
      if (currentIndex < problems.length - 1) {
        const nextProblem = problems[currentIndex + 1];
        navigate(`/problem/${nextProblem._id}`);
      }
    }
  };

  // Handle problem selection from list
  const handleProblemSelect = (problem) => {
    setShowProblemList(false);
    navigate(`/problem/${problem._id}`);
  };

  // Get current problem index for navigation
  const getCurrentProblemIndex = () => {
    if (!currentProblem) return -1;
    return problems.findIndex((p) => p._id === currentProblem._id);
  };

  // Get difficulty color class
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  // Toggle hint visibility
  const toggleHint = (index) => {
    setHintVisibility((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Scroll to section
  const scrollToSection = (section) => {
    if (section === "tags" && tagsRef.current) {
      setOpenTags(true);
      tagsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "companies" && companiesRef.current) {
      setOpenCompanies(true);
      companiesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Handle language change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);

    // Update code when language changes
    if (currentProblem) {
      const initialCode =
        currentProblem.startCode?.find(
          (sc) => sc.language.toLowerCase() === language
        )?.initialCode || "// Write your code here";
      setCode(initialCode);
    }
  };

  // Get Monaco language from selected language
  const getMonacoLanguage = () => {
    switch (selectedLanguage) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "c++":
        return "cpp";
      default:
        return "javascript";
    }
  };

  // Handle run code
  const handleRun = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setRunResults(null);
    setSubmitResult(null);
    setBottomTab("results");

    try {
      const testCases = [
        ...(currentProblem?.visibleTestCases || []).map((tc) => ({
          input: tc.input,
          expected_output: tc.output,
        })),
        ...customTestCases,
      ];

      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
        testCases,
      });

      setRunResults({
        success: response.data.testCases.every((tc) => tc.status_id === 3),
        testCases: response.data.testCases,
      });
    } catch (error) {
      console.error("Error running code:", error);
      setRunResults({
        success: false,
        error: "Internal server error",
        testCases: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Handle submit code
  const handleSubmit = async () => {
    if (!code.trim()) return;

    setIsSubmitting(true);
    setRunResults(null);
    setSubmitResult(null);
    setBottomTab("results");

    try {
      const startTime = Date.now();
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code,
          language: selectedLanguage,
        }
      );

      const endTime = Date.now();
      setSubmissionTime(endTime - startTime);
      setSubmitResult(response.data);
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult({
        accepted: false,
        error: "Internal server error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEditorOption = (option, value) => {
    setEditorOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const TestCasesPanel = () => {
    const [newTestCase, setNewTestCase] = useState({ input: "", expected: "" });

    const handleAddTestCase = () => {
      if (newTestCase.input && newTestCase.expected) {
        setCustomTestCases([...customTestCases, newTestCase]);
        setNewTestCase({ input: "", expected: "" });
      }
    };

    const handleDeleteTestCase = (index) => {
      setCustomTestCases(customTestCases.filter((_, i) => i !== index));
    };

    return (
      <div className="space-y-4">
        <h3 className="font-semibold mb-4 text-lg">Test Cases</h3>

        {/* Visible Test Cases */}
        <div className="mb-6">
          <h4 className="font-medium mb-2">Sample Test Cases</h4>
          <div className="space-y-3">
            {currentProblem?.visibleTestCases?.map((tc, index) => (
              <div
                key={`visible-${index}`}
                className="bg-gray-800/50 p-3 rounded text-sm"
              >
                <div className="font-mono">
                  <div className="flex gap-2">
                    <span className="text-gray-400">Input:</span>
                    <span className="text-orange-300">{tc.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400">Expected:</span>
                    <span className="text-green-300">{tc.output}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Test Cases */}
        <div>
          <h4 className="font-medium mb-2">Custom Test Cases</h4>
          <div className="space-y-3 mb-4">
            {customTestCases.map((tc, index) => (
              <div
                key={`custom-${index}`}
                className="bg-gray-800/50 p-3 rounded text-sm relative"
              >
                <button
                  className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                  onClick={() => handleDeleteTestCase(index)}
                >
                  <X size={16} />
                </button>
                <div className="font-mono">
                  <div className="flex gap-2">
                    <span className="text-gray-400">Input:</span>
                    <span className="text-orange-300">{tc.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400">Expected:</span>
                    <span className="text-green-300">{tc.expected}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Test Case Form */}
          <div className="bg-gray-800/50 p-3 rounded">
            <h4 className="font-medium mb-2">Add Custom Test Case</h4>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400">Input</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-900 rounded text-sm"
                  value={newTestCase.input}
                  onChange={(e) =>
                    setNewTestCase({ ...newTestCase, input: e.target.value })
                  }
                  placeholder="e.g., [1,2,3]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Expected Output</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-900 rounded text-sm"
                  value={newTestCase.expected}
                  onChange={(e) =>
                    setNewTestCase({ ...newTestCase, expected: e.target.value })
                  }
                  placeholder="e.g., 6"
                />
              </div>
              <button
                className="mt-2 px-3 py-1 bg-orange-600 hover:bg-orange-500 rounded text-sm"
                onClick={handleAddTestCase}
              >
                Add Test Case
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Results Panel Component
  const ResultsPanel = () => {
    if (runResults) {
      return (
        <div>
          <h3 className="font-semibold mb-4 text-lg">Test Results</h3>
          <div
            className={`rounded-lg border ${
              runResults.success ? "border-green-700" : "border-red-700"
            } mb-4`}
          >
            <div className="p-4">
              {runResults.success ? (
                <div>
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Check className="w-5 h-5" />
                    <h4 className="font-bold">All test cases passed!</h4>
                  </div>
                  <div className="space-y-3">
                    {runResults.testCases?.map((tc, i) => (
                      <div
                        key={i}
                        className="bg-gray-800/50 p-3 rounded text-xs"
                      >
                        <div className="font-mono">
                          <div className="flex gap-2">
                            <span className="text-gray-400">Input:</span>
                            <span className="text-orange-300">{tc.stdin}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-gray-400">Expected:</span>
                            <span className="text-green-300">
                              {tc.expected_output}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-gray-400">Output:</span>
                            <span className="text-blue-300">{tc.stdout}</span>
                          </div>
                          <div
                            className={`mt-1 ${
                              tc.status_id === 3
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {tc.status_id === 3 ? "✓ Passed" : "✗ Failed"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <X className="w-5 h-5" />
                    <h4 className="font-bold">Test Cases Failed</h4>
                  </div>
                  <div className="space-y-3">
                    {runResults.testCases?.map((tc, i) => (
                      <div
                        key={i}
                        className="bg-gray-800/50 p-3 rounded text-xs"
                      >
                        <div className="font-mono">
                          <div className="flex gap-2">
                            <span className="text-gray-400">Input:</span>
                            <span className="text-orange-300">{tc.stdin}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-gray-400">Expected:</span>
                            <span className="text-green-300">
                              {tc.expected_output}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-gray-400">Output:</span>
                            <span className="text-blue-300">{tc.stdout}</span>
                          </div>
                          <div
                            className={`mt-1 ${
                              tc.status_id === 3
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {tc.status_id === 3
                              ? "✓ Passed"
                              : `✗ Failed (${
                                  tc.status?.description || "Error"
                                })`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (submitResult) {
      return (
        <div>
          <h3 className="font-semibold mb-4 text-lg">Submission Result</h3>
          <div
            className={`rounded-lg border ${
              submitResult.accepted ? "border-green-700" : "border-red-700"
            } mb-4`}
          >
            <div className="p-4">
              {submitResult.accepted ? (
                <div>
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Check className="w-6 h-6" />
                    <h4 className="font-bold text-xl">Accepted</h4>
                  </div>
                  <div className="mb-4">
                    <div className="flex gap-4">
                      <div className="bg-gray-800/50 px-3 py-2 rounded">
                        <div className="text-xs text-gray-400">Runtime</div>
                        <div className="font-mono text-green-400">
                          {submitResult.runtime || "N/A"} ms
                        </div>
                      </div>
                      <div className="bg-gray-800/50 px-3 py-2 rounded">
                        <div className="text-xs text-gray-400">Memory</div>
                        <div className="font-mono text-green-400">
                          {submitResult.memory || "N/A"} KB
                        </div>
                      </div>
                      <div className="bg-gray-800/50 px-3 py-2 rounded">
                        <div className="text-xs text-gray-400">Test Cases</div>
                        <div className="font-mono text-green-400">
                          {submitResult.passedTestCases}/
                          {submitResult.totalTestCases}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="mb-2">
                      Congratulations! Your solution was accepted.
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <X className="w-6 h-6" />
                    <h4 className="font-bold text-xl">Not Accepted</h4>
                  </div>
                  <div className="mb-4">
                    <div className="flex gap-4">
                      <div className="bg-gray-800/50 px-3 py-2 rounded">
                        <div className="text-xs text-gray-400">Runtime</div>
                        <div className="font-mono text-red-400">
                          {submitResult.runtime || "N/A"} ms
                        </div>
                      </div>
                      <div className="bg-gray-800/50 px-3 py-2 rounded">
                        <div className="text-xs text-gray-400">Memory</div>
                        <div className="font-mono text-red-400">
                          {submitResult.memory || "N/A"} KB
                        </div>
                      </div>
                      <div className="bg-gray-800/50 px-3 py-2 rounded">
                        <div className="text-xs text-gray-400">Test Cases</div>
                        <div className="font-mono text-red-400">
                          {submitResult.passedTestCases}/
                          {submitResult.totalTestCases}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="mb-2">
                      Your solution failed to pass all test cases.
                    </div>
                    {submitResult.error ? (
                      <div className="font-semibold text-red-400">
                        Error: {submitResult.error}
                      </div>
                    ) : (
                      <div className="font-semibold text-red-400">
                        {submitResult.totalTestCases -
                          submitResult.passedTestCases}{" "}
                        test case(s) failed
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-gray-500 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mb-2">No results available</div>
          <div className="text-sm">Run your code to see test results</div>
        </div>
      </div>
    );
  };

  const currentIndex = getCurrentProblemIndex();
  if (loading && !currentProblem) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  const leftTabs = [
    {
      id: "description",
      label: "Description",
      icon: <Code className="w-4 h-4" />,
    },
    { id: "editorial", label: "Editorial", icon: <Edit className="w-4 h-4" /> },
    {
      id: "submissions",
      label: "Submissions",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: "chatAI",
      label: "AI Assistant",
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  return (
    <div
      ref={fullscreenRef}
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dltqzdtfh/image/upload/v1750446385/gridbg_uxjjws.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showProblemList && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0"
            onClick={() => setShowProblemList(false)}
          />

          <div className="relative z-50 w-full max-w-md bg-[#27272a]/80 backdrop-blur-md shadow-lg">
            <div className="p-4 border-b ">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Problem List</h2>
                <button
                  onClick={() => setShowProblemList(false)}
                  className="p-1 rounded hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative border rounded">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  className="w-full py-2 pl-10 pr-4 bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-400">🍀</span>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              {loading ? (
                <div className="p-4 text-center text-gray-400">
                  Loading problems...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-400">{error}</div>
              ) : filteredProblems.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No problems found
                </div>
              ) : (
                filteredProblems.map((problem) => (
                  <div
                    key={problem._id}
                    className={`p-2 border-b cursor-pointer hover:text-orange-300 ${
                      currentProblem && currentProblem._id === problem._id
                        ? "text-orange-500"
                        : ""
                    }`}
                    onClick={() => handleProblemSelect(problem)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{problem.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          problem.difficulty === "easy"
                            ? "bg-green-900 text-green-300"
                            : problem.difficulty === "medium"
                            ? "bg-yellow-900 text-yellow-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="bg-black border-b border-gray-800 px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-40">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className="text-white text-lg font-bold px-3 py-1 border-r border-gray-700 hover:text-orange-400"
          >
            IC
          </NavLink>
          <div className="flex items-center gap-2 text-gray-300">
            <span
              className="hover:text-white transition cursor-pointer"
              onClick={() => setShowProblemList(true)}
            >
              Problem List
            </span>
            <ChevronLeft
              className={`hover:text-white cursor-pointer ${
                currentIndex <= 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={currentIndex > 0 ? handlePrevProblem : undefined}
            />
            <ChevronRight
              className={`hover:text-white cursor-pointer ${
                currentIndex >= problems.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={
                currentIndex < problems.length - 1
                  ? handleNextProblem
                  : undefined
              }
            />
          </div>
        </div>

        {/* Center Section - Run/Submit buttons and Timer */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`px-4 py-2 rounded text-sm flex items-center gap-1 ${
              isRunning
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {isRunning ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run
              </>
            )}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded text-sm flex items-center gap-1 ${
              isSubmitting
                ? "bg-orange-700 text-white cursor-not-allowed"
                : "bg-orange-600 text-white hover:bg-orange-500"
            }`}
          >
            <CloudUpload className="w-5 h-5" />
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>

          {/* Timer Section */}
          {!showTimer ? (
            <button
              onClick={startTimer}
              className="px-4 py-2 rounded text-sm flex items-center gap-1 bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              <Timer className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-gray-800 rounded px-3 py-2">
              <button
                onClick={hideTimer}
                className="text-gray-400 hover:text-white"
                title="Hide Timer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={toggleTimer}
                className="text-gray-400 hover:text-white"
                title={isTimerRunning ? "Pause Timer" : "Start Timer"}
              >
                {isTimerRunning ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>

              <span className="font-mono text-white text-sm min-w-[60px] text-center">
                {formatTime(timerSeconds)}
              </span>

              <button
                onClick={resetTimer}
                className="text-gray-400 hover:text-white"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="hover:text-[orange] cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 /> : <Fullscreen />}
          </button>
          <button
            onClick={handleShare}
            className="hover:text-[orange] transition cursor-pointer"
            title="Copy Link"
          >
            {copied ? <Check className="text-green-400" /> : <Share2 />}
          </button>

          <NavLink to={`/myprofile/${user._id}`} title="My Profile">
            <UserCircle className="w-6 h-6 hover:text-[orange]" />
          </NavLink>
        </div>
      </nav>

      {/* Main Content - Resizable Panels */}
      <div ref={containerRef} className="flex h-[calc(100vh-64px)] relative">
        {/* Left Tab - Problem Description */}
        <div
          className="h-full overflow-auto bg-[#0e0e10]/80 backdrop-blur-md p-2"
          style={{ width: `${leftWidth}%` }}
        >
          {currentProblem ? (
            <>
              <nav className="border-b h-10 flex items-center px-4 space-x-4 gap-[20px]">
                {leftTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-1 text-sm cursor-pointer ${
                      activeLeftTab === tab.id
                        ? "text-orange-500 border-b-2 border-orange-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setActiveLeftTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Left Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeLeftTab === "description" && (
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h1 className="text-2xl font-bold">
                        {currentProblem.title}
                      </h1>
                    </div>

                    <div className="flex gap-4 mb-2">
                      <span
                        className={`badge badge-outline ${getDifficultyColor(
                          currentProblem.difficulty
                        )}`}
                      >
                        {currentProblem.difficulty.charAt(0).toUpperCase() +
                          currentProblem.difficulty.slice(1)}
                      </span>
                      <button
                        className="flex items-center gap-1 px-3 py-1 badge bg-[#3c3c3c] cursor-pointer"
                        onClick={() => scrollToSection("tags")}
                      >
                        <Tag className="w-4 h-4" /> Topics
                      </button>
                      {currentProblem.companies &&
                        currentProblem.companies.length > 0 && (
                          <button
                            className="flex items-center gap-1 px-3 py-1 badge text-[orange] bg-[#3c3c3c] cursor-pointer"
                            onClick={() => scrollToSection("companies")}
                          >
                            <Building className="w-4 h-4" /> Companies
                          </button>
                        )}
                    </div>

                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {currentProblem.description}
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                      <div className="space-y-4">
                        {currentProblem.visibleTestCases?.map(
                          (example, index) => (
                            <div
                              key={index}
                              className="border-l p-4 rounded-lg"
                            >
                              <h4 className="font-semibold mb-2">
                                Example {index + 1}:
                              </h4>
                              <div className="space-y-2 text-sm font-mono">
                                <div>
                                  <strong>Input:</strong> {example.input}
                                </div>
                                <div>
                                  <strong>Output:</strong> {example.output}
                                </div>
                                {example.explaination && (
                                  <div>
                                    <strong>Explanation:</strong>{" "}
                                    {example.explaination}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">
                        Constraints:
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {currentProblem.constraints?.map(
                          (constraint, index) => {
                            const colonIndex = constraint.indexOf(":");
                            let condition, description;

                            if (colonIndex !== -1) {
                              condition = constraint
                                .substring(0, colonIndex)
                                .trim();
                              description = constraint
                                .substring(colonIndex + 1)
                                .trim();
                            } else {
                              condition = constraint;
                              description = null;
                            }

                            return (
                              <li
                                key={index}
                                className="text-sm flex items-start"
                              >
                                {description ? (
                                  <>
                                    <span className="font-mono bg-gray-800 px-2 py-0.5 rounded mr-2 flex-shrink-0">
                                      {condition}
                                    </span>
                                    <span className="flex-grow">
                                      {description}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-mono bg-gray-800 px-2 py-0.5 rounded">
                                    {condition}
                                  </span>
                                )}
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>

                    {/* Tags Section */}
                    <div
                      ref={tagsRef}
                      className="mt-8 border-t border-gray-700 pt-2"
                    >
                      <button
                        className="flex justify-between items-center w-full text-lg font-semibold mb-3"
                        onClick={() => setOpenTags(!openTags)}
                      >
                        <span>Topics</span>
                        {openTags ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      {openTags && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {currentProblem.tags?.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Companies Section */}
                    {currentProblem.companies &&
                      currentProblem.companies.length > 0 && (
                        <div
                          ref={companiesRef}
                          className="mt-4 border-t border-gray-700 pt-2"
                        >
                          <button
                            className="flex justify-between items-center w-full text-lg font-semibold mb-3"
                            onClick={() => setOpenCompanies(!openCompanies)}
                          >
                            <span>Companies</span>
                            {openCompanies ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>

                          {openCompanies && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {currentProblem.companies.map(
                                (company, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                                  >
                                    {company}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    {/* Hints Section */}
                    {currentProblem.hints &&
                      currentProblem.hints.length > 0 && (
                        <div className="mt-4 border-t border-gray-700 pt-2">
                          <button
                            className="flex justify-between items-center w-full text-lg font-semibold mb-3"
                            onClick={() => setOpenHints(!openHints)}
                          >
                            <span>Hints</span>
                            {openHints ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>

                          {openHints && (
                            <div className="space-y-3 mb-6">
                              {currentProblem.hints.map((hint, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-800/50 rounded-lg p-4"
                                >
                                  <button
                                    className="w-full flex justify-between items-center"
                                    onClick={() => toggleHint(index)}
                                  >
                                    <span className="font-medium">
                                      Hint {index + 1}
                                    </span>
                                    {hintVisibility[index] ? (
                                      <Minimize2 className="w-4 h-4" />
                                    ) : (
                                      <Plus className="w-4 h-4" />
                                    )}
                                  </button>

                                  {hintVisibility[index] && (
                                    <div className="mt-3 p-3 bg-gray-900/50 rounded text-sm">
                                      {hint}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    {/* Discussion Section */}
                    <div className="mt-4 border-t border-gray-700 pt-2">
                      <button
                        className="flex justify-between items-center w-full text-lg font-semibold mb-3"
                        onClick={() => setOpenDiscussion(!openDiscussion)}
                      >
                        <span>Discussion</span>
                        {openDiscussion ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      {openDiscussion && (
                        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                          <div className="flex items-center gap-3 mb-4">
                            <MessagesSquare className="text-orange-400 w-6 h-6" />
                            <h3 className="text-lg font-semibold">
                              Join the Community Discussion
                            </h3>
                          </div>

                          <p className="text-gray-300 mb-4">
                            Connect with other developers, ask questions, and
                            share solutions on our Discord server.
                          </p>

                          <div className="flex flex-wrap gap-3">
                            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center gap-2">
                              <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M20.3,4.1c-1.6-0.7-3.3-1.2-5-1.5c-0.2,0.4-0.4,0.8-0.6,1.2c-1.8-0.3-3.6-0.3-5.4,0C9,3.4,8.8,3,8.6,2.6 c-1.8,0.3-3.4,0.8-5,1.5C2,10.4,1.4,16.6,2.3,22.7c2.1,1.6,4.3,2.5,6.5,3c0.5-0.7,0.9-1.4,1.3-2.2c-0.7-0.3-1.4-0.6-2-1 c0.2-0.1,0.4-0.3,0.5-0.5c3.8,1.7,8,1.7,11.8,0c0.2,0.2,0.4,0.4,0.5,0.5c-0.7,0.4-1.4,0.7-2.1,1c0.4,0.8,0.8,1.5,1.3,2.2 c2.2-0.5,4.4-1.4,6.5-3C22.6,16.6,22,10.4,20.3,4.1z M8.3,15.9c-1.1,0-2-1-2-2.2s0.9-2.2,2-2.2s2,1,2.1,2.2 C10.4,14.9,9.5,15.9,8.3,15.9z M15.8,15.9c-1.1,0-2-1-2-2.2s0.9-2.2,2-2.2c1.1,0,2,1,2,2.2C17.8,14.9,16.9,15.9,15.8,15.9z" />
                              </svg>
                              Join Discord Server
                            </button>

                            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center gap-2">
                              <MessageSquare className="w-5 h-5" />
                              View Forum (Coming Soon)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              
                {activeLeftTab === "editorial" && (
                  <div className="prose max-w-none">
                    <Editorial
                      secureUrl={currentProblem.secureUrl}
                      thumbnailUrl={currentProblem.thumbnailUrl}
                      duration={currentProblem.duration}
                    />
                  </div>
                )}
                {activeLeftTab === "submissions" && (
                  <div>
                    <SubmissionHistory problemId={currentProblem._id} />
                  </div>
                )}
                {activeLeftTab === "chatAI" && (
                  <div className="prose max-w-none">
                    <ChatAI problem={currentProblem} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 pt-10">
              {loading
                ? "Loading problem data..."
                : error
                ? error
                : problems.length === 0
                ? "No problems available"
                : "Select a problem to view details"}
            </div>
          )}
        </div>

        {/* Vertical Resizer (Left/Right Panels) */}
        <div
          className="w-1 bg-gray-700 hover:bg-orange-500 cursor-col-resize absolute top-0 bottom-0 z-10"
          style={{ left: `${leftWidth}%` }}
          onMouseDown={() => setIsResizing(true)}
        />

        {/* Right Tab - Code Editor and Test Cases */}
        <div
          className="h-full bg-black backdrop-blur-md flex flex-col"
          style={{ width: `${100 - leftWidth}%` }}
        >
          {/* Code Editor */}
          <div
            className="overflow-auto flex flex-col"
            style={{ height: `${editorHeight}%` }}
          >
            {/* Language and Settings Bar */}
            <div className="flex justify-between items-center p-2 bg-black border-b border-gray-800">
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-1 text-xs">
                  <span>Language:</span>
                  <select
                    className="bg-dark border text-gray-300 px-2 py-1 rounded"
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    {languages.map((lang) => (
                      <option
                        key={lang.id}
                        value={lang.id}
                        className="bg-black text-white"
                      >
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <span>Font Size:</span>
                  <select
                    className="bg-dark border text-gray-300 px-1 py-0.5 rounded"
                    value={editorOptions.fontSize}
                    onChange={(e) =>
                      toggleEditorOption("fontSize", parseInt(e.target.value))
                    }
                  >
                    {[12, 14, 16, 18, 20].map((size) => (
                      <option
                        key={size}
                        value={size}
                        className="bg-black text-white"
                      >
                        {size}px
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  className={`p-1 rounded ${
                    editorOptions.minimap.enabled
                      ? "border text-orange-400"
                      : "text-gray-500 hover:text-gray-300"
                  } cursor-pointer`}
                  onClick={() =>
                    toggleEditorOption("minimap", {
                      enabled: !editorOptions.minimap.enabled,
                    })
                  }
                  title="Toggle Minimap"
                >
                  <Monitor className="w-4 h-4" />
                </button>

                <button
                  className={`p-1 rounded ${
                    editorOptions.lineNumbers === "on"
                      ? "border text-orange-400"
                      : "text-gray-500 hover:text-gray-300"
                  } cursor-pointer`}
                  onClick={() =>
                    toggleEditorOption(
                      "lineNumbers",
                      editorOptions.lineNumbers === "on" ? "off" : "on"
                    )
                  }
                  title="Toggle Line Numbers"
                >
                  <Code className="w-4 h-4" />
                </button>

                <button
                  className={`p-1 rounded ${
                    editorOptions.wordWrap === "on"
                      ? "border text-orange-400"
                      : "text-gray-500 hover:text-gray-300"
                  } cursor-pointer`}
                  onClick={() =>
                    toggleEditorOption(
                      "wordWrap",
                      editorOptions.wordWrap === "on" ? "off" : "on"
                    )
                  }
                  title="Toggle Word Wrap"
                >
                  <WrapText className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={getMonacoLanguage()}
                value={code}
                onChange={setCode}
                theme={editorOptions.theme}
                options={editorOptions}
              />
            </div>
          </div>

          {/* Horizontal Resizer (Editor/Test Cases) */}
          <div
            className="h-1 bg-gray-700 hover:bg-orange-500 cursor-row-resize"
            onMouseDown={() => setIsVerticalResizing(true)}
          />

          {/* Bottom Panel - Test Cases & Results */}
          <div
            className="overflow-auto flex flex-col"
            style={{ height: `${100 - editorHeight}%` }}
          >
            <div className="flex border-b border-gray-700">
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  bottomTab === "testcases"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setBottomTab("testcases")}
              >
                Test Cases
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  bottomTab === "results"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setBottomTab("results")}
              >
                Results
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {bottomTab === "testcases" ? (
                <TestCasesPanel />
              ) : (
                <ResultsPanel />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
