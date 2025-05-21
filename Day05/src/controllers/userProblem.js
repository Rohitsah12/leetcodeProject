const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");

const createProblem = async (req, res) => {
  const {
    title, description, difficulty, tags,
    visibleTestCases, hiddenTestCases, startCode,
    referenceSolution, problemCreator
  } = req.body;

  try {
    for (const { language, completeCode } of referenceSolution) {
      const languageId = getLanguageById(language);

      if (!languageId) {
        return res.status(400).send(`Unsupported language: ${language}`);
      }

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input || "",
        expected_output: testcase.output || ""
      }));

      console.log("Submissions Payload:", JSON.stringify(submissions, null, 2));

      const submitResult = await submitBatch(submissions);
      const resultTokens = submitResult.map((value) => value.token);
      const testResults = await submitToken(resultTokens);

      for (const test of testResults) {
        if (test.status_id !== 3) {
          return res.status(400).send("Error: One or more test cases failed.");
        }
      }
    }

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id
    });

    res.status(201).send("Problem Saved Successfully");

  } catch (err) {
    console.error("createProblem error", err?.response?.data || err.message);
    res.status(400).send("Error: " + (err?.response?.data || err.message));
  }
};

module.exports = createProblem;
