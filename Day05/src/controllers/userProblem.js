const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");

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

      console.log(testResults);
      

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

const updateProblem= async (req,res)=>{
  console.log(req.params);
  console.log("req body"+ req.body)
  const {id}=req.params;
  const {
    title, description, difficulty, tags,
    visibleTestCases, hiddenTestCases, startCode,
    referenceSolution, problemCreator
  } = req.body;
  try {

    if(!id){
      return res.status(400).send("missing id field")
    }

    const DsaProblem=await Problem.findById(id);
    if(!DsaProblem){
      return res.status(404).send("Id is not present in server");
    }
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

    const newProblem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
    res.status(200).send(newProblem);
  } catch (error) {
    
    res.status(400).send("Error"+error);
    
  }

}

const deleteProblem=async (req,res) => {
  const {id}=req.params;
  try {
    if(!id){
      return res.status(400).send("missing id field")
    }

    const deletedProblem=await Problem.findByIdAndDelete(id);
    if(!deleteProblem){
      return res.status(404).send("Problem is missing");
    }

    res.status(200).send("Successfully deleted");
  } catch (error) {
    res.status(500).send("Error: "+error)
  }
}

const getProblemById=async (req,res)=>{
  const {id}=req.params
  try {
    if(!id){
      return res.status(400).send("missing id field")
    }

    const getProblem=await Problem.findById(id).select('title description difficulty tags visibleTestCases startCode referenceSolution problemCreator');
    if(!getProblem){
      return res.status(404).send("Problem is missing");
    }

    res.status(200).send(getProblem);
  } catch (error) {
     res.status(500).send("Error: "+error);
  }
}

const getAllProblem=async (req,res)=>{

  try {
    const getProblem=await Problem.find({}).select('_id title difficulty tags');
    if(getProblem.length==0){
      return res.status(404).send("Problem is missing");
    }

    res.status(200).send(getProblem);
  } catch (error) {
     res.status(500).send("Error: "+error);
  }
}

const solvedAllProblembyUser=async (req,res)=>{
  try {
    // const count=req.result.problemSolved.length;

    const userId=req.result._id;
    const user=await User.findById(userId).populate(
      {
        path:"problemSolved",
        select:"_id title difficulty tags"
      }
    );
    res.status(200).send(user.problemSolved);
  } catch (error) {
    res.status(500).send("Server error")
  }
}

module.exports ={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser};
