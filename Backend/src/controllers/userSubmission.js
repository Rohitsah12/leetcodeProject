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

    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({ error: "Some fields are missing" });
    }

    language = language.toLowerCase();
    if (language === 'cpp') language = 'c++';

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    if (!Array.isArray(problem.hiddenTestCases) || problem.hiddenTestCases.length === 0) {
      return res.status(400).json({ error: "No hidden test cases found for this problem." });
    }

    const languageId = getLanguageById(language);
    if (!languageId) return res.status(400).json({ error: "Unsupported language" });

    const submissionDoc = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: 'pending',
      testCasesTotal: problem.hiddenTestCases.length,
    });

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const tokens = submitResult.map((res) => res.token);
    const testResults = await submitToken(tokens);

    const { testCasesPassed, runtime, memory, status, errorMessage } = evaluateTestResults(testResults);

    submissionDoc.status = status;
    submissionDoc.testCasesPassed = testCasesPassed;
    submissionDoc.runtime = runtime;
    submissionDoc.memory = memory;
    submissionDoc.errorMessage = errorMessage;
    await submissionDoc.save();

    const user = await User.findById(userId);
    if (status === 'accepted' && !user.problemSolved.includes(problemId)) {
      user.problemSolved.push(problemId);
      await user.save();
    }

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
