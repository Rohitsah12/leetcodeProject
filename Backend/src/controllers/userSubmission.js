const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

// Utility function to evaluate test results from Judge0
const evaluateTestResults = (testResults) => {
  let testCasesPassed = 0;
  let runtime = 0;
  let memory = 0;
  let status = 'accepted';
  let errorMessage = null;

  for (const test of testResults) {
    if (test.status_id === 3) {
      testCasesPassed++;
      runtime += parseFloat(test.time || 0);
      memory = Math.max(memory, test.memory || 0);
    } else {
      status = test.status_id === 4 ? 'error' : 'wrong';
      errorMessage = test.stderr || test.compile_output || 'Unknown Error';
    }
  }

  return { testCasesPassed, runtime, memory, status, errorMessage };
};
const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    // Validation checks
    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({ error: "Some fields are missing" });
    }

    // Language normalization
    language = language.toLowerCase();
    if (language === 'cpp') language = 'c++';

    // Fetch problem details
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    // Validate test cases
    if (!Array.isArray(problem.hiddenTestCases) || problem.hiddenTestCases.length === 0) {
      return res.status(400).json({ error: "No hidden test cases found for this problem." });
    }

    // Get language ID for Judge0
    const languageId = getLanguageById(language);
    if (!languageId) return res.status(400).json({ error: "Unsupported language" });

    // Create submission record
    const submissionDoc = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length,
    });

    // Prepare test cases for Judge0
    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    // Submit to Judge0
    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map((res) => res.token);
    const testResults = await submitToken(tokens);

    // Evaluate test results
    const { testCasesPassed, runtime, memory, status, errorMessage } = evaluateTestResults(testResults);

    // Update submission with results
    submissionDoc.status = status;
    submissionDoc.testCasesPassed = testCasesPassed;
    submissionDoc.runtime = runtime;
    submissionDoc.memory = memory;
    submissionDoc.errorMessage = errorMessage;
    await submissionDoc.save();

    // Fetch user for profile updates
    const user = await User.findById(userId);

    // Update heatmap for ALL submissions (any status)
    const now = new Date();
    const userDate = now.toLocaleDateString('en-CA', { timeZone: user.timezone });
    user.heatmapData.set(userDate, (user.heatmapData.get(userDate)|| 0) + 1)

    console.log(user.heatmapData);
    

    // Only update streak and solved problems for accepted solutions
    if (status === 'accepted') {
      // Update solved problems list
      user.problemSolved.addToSet(problemId);

      // Update streak
      let streak = user.streak || { count: 0, lastStreakDate: null };
      
      if (streak.lastStreakDate) {
        const lastDate = new Date(streak.lastStreakDate + 'T00:00:00');
        const currentDate = new Date(userDate + 'T00:00:00');
        
        // Calculate day difference
        const dayDiff = Math.floor((currentDate - lastDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day - increment streak
          streak.count += 1;
        } else if (dayDiff > 1) {
          // Broken streak - reset to 1
          streak.count = 1;
        }
        // If same day (dayDiff=0), no change
      } else {
        // First submission - start streak
        streak.count = 1;
      }
      
      // Update last streak date
      streak.lastStreakDate = userDate;
      user.streak = streak;
    }

    // Cleanup old heatmap data (>12 months)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() - 1); // Include today last year
    
    for (const [date] of user.heatmapData) {
      const dateObj = new Date(date + 'T00:00:00');
      if (dateObj < oneYearAgo) {
        user.heatmapData.delete(date);
      }
    }
    console.log("Updated heatmapData:", Array.from(user.heatmapData.entries()));
    // Save user updates
    await user.save();

    // Return response
    res.status(201).json({
      accepted: status === 'accepted',
      totalTestCases: submissionDoc.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory,
      errorMessage: status === 'accepted' ? null : errorMessage
    });

  } catch (err) {
    console.error(err);

    if (err.response && err.response.data) {
      return res.status(err.response.status).json({
        error: "Judge0 Error",
        message: err.response.data.error || err.response.data.message || "Unknown Judge0 error"
      });
    }

    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    let { code, language } = req.body;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({ error: "Some fields are missing" });
    }

    language = language.toLowerCase();
    if (language === 'cpp') language = 'c++';

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    if (!Array.isArray(problem.visibleTestCases) || problem.visibleTestCases.length === 0) {
      return res.status(400).json({ error: "No visible test cases found for this problem." });
    }

    const languageId = getLanguageById(language);
    if (!languageId) return res.status(400).json({ error: "Unsupported language" });

    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map((res) => res.token);
    const testResults = await submitToken(tokens);

    const { testCasesPassed, runtime, memory, status, errorMessage } = evaluateTestResults(testResults);

    res.status(201).json({
      success: status === 'accepted',
      testCases: testResults,
      runtime,
      memory,
      errorMessage: status === 'accepted' ? null : errorMessage
    });

  } catch (err) {
    console.error(err);

    if (err.response && err.response.data) {
      return res.status(err.response.status).json({
        error: "Judge0 Error",
        message: err.response.data.error || err.response.data.message || "Unknown Judge0 error"
      });
    }

    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};



module.exports = { submitCode, runCode };
