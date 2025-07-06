const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility");
const Problem = require("../models/problem");
const User = require("../models/user");
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo")

const createProblem = async (req, res) => {
  const { 
    title, 
    description, 
    difficulty, 
    tags,
    companies,
    hints,    
    constraints,
    visibleTestCases, 
    hiddenTestCases, 
    startCode,
    referenceSolution 
  } = req.body;

  try {
    // Validate reference solutions against visible test cases
    for (const solution of referenceSolution) {
      const languageId = getLanguageById(solution.language);
      const submissions = visibleTestCases.map(testcase => ({
        source_code: solution.completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));

      const submitResult = await submitBatch(submissions);
      const tokens = submitResult.map(item => item.token);
      
      // Check results after a short delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const testResults = await submitToken(tokens);
      
      for (const result of testResults) {
        if (result.status.id !== 3) { // 3 = Accepted
          return res.status(400).json({
            message: "Reference solution failed validation",
            details: {
              language: solution.language,
              testCase: result.stdin,
              expected: result.expected_output,
              actual: result.stdout,
              error: result.stderr
            }
          });
        }
      }
    }
    
    
    // Create problem in database
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags,
      companies,
      hints,    
      constraints,
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator: req.result._id
    });

    res.status(201).json({
      message: "Problem created successfully",
      problemId: problem._id
    });
  } catch (error) {
    console.error("Error creating problem:", error);
    
    if (error.response) {
      console.error("Judge0 API error:", error.response.data);
      return res.status(502).json({
        message: "Online judge service unavailable",
        details: error.response.data
      });
    }
    
    res.status(400).json({
      message: "Problem creation failed",
      error: error.message
    });
  }
};


const updateProblem = async (req, res) => {
 
  
  const { id } = req.params;
  const { 
    title, 
    description, 
    difficulty, 
    tags,
    companies,
    hints,    
    constraints,
    visibleTestCases, 
    hiddenTestCases, 
    startCode,
    referenceSolution 
  } = req.body;

  console.log(title);
  

  try {
    if (!id) {
      return res.status(400).send("Missing ID Field");
    }

    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).send("ID is not present in server");
    }

    // Update all fields including companies, hints, constraints
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        tags,
        companies, 
        hints,
        constraints,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution
      },
      { runValidators: true, new: true }
    );

    res.status(200).json(updatedProblem);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const deleteProblem = async(req,res)=>{

  const {id} = req.params;
  try{
     
    if(!id)
      return res.status(400).send("ID is Missing");

   const deletedProblem = await Problem.findByIdAndDelete(id);

   if(!deletedProblem)
    return res.status(404).send("Problem is Missing");


   res.status(200).send("Successfully Deleted");
  }
  catch(err){
     
    res.status(500).send("Error: "+err);
  }
}


const getProblemById = async (req, res) => {
  const { id } = req.params;
  const userId = req.result?._id; // Use optional chaining to avoid errors

  

  try {
    if (!id) return res.status(400).send("ID is Missing");

    // Fetch user role if user is authenticated
    let isAdmin = false;
    if (userId) {
      const user = await User.findById(userId).select('role');
      isAdmin = user?.role === 'admin';
    }

    console.log(isAdmin);
    
    // Select fields conditionally based on user role
    let problemQuery = Problem.findById(id).select(
      '_id title description difficulty tags visibleTestCases startCode referenceSolution hints constraints companies'
    );

    // Add hiddenTestCases only for admin users
    if (isAdmin) {
      problemQuery = problemQuery.select('+hiddenTestCases');
    }

    const getProblem = await problemQuery;

    if (!getProblem) return res.status(404).send("Problem is Missing");

    // Get video solution
    const videos = await SolutionVideo.findOne({ problemId: id });

    // Prepare response data
    const responseData = {
      ...getProblem.toObject(),
      secureUrl: videos?.secureUrl || null,
      thumbnailUrl: videos?.thumbnailUrl || null,
      duration: videos?.duration || null,
    };

    res.status(200).send(responseData);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};
const getAllProblem = async(req,res)=>{

  try{
     
    const getProblem = await Problem.find({}).select('_id title difficulty tags companies');

   if(getProblem.length==0)
    return res.status(404).send("Problem is Missing");


   res.status(200).send(getProblem);
  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}


const solvedAllProblembyUser =  async(req,res)=>{
   
    try{
       
      const userId = req.result._id;
      const user =  await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
      });
      
      res.status(200).send(user.problemSolved);
    }
    catch(err){
      res.status(500).send("Server Error");
    }
}

const solvedAllProblembyUserCOllege=async(req,res)=>{
  try {
    const userId=req.params.userId;

    
    const user =  await User.findById(userId).populate({
        path:"problemSolved",
        select:"_id title difficulty tags"
      });      
      res.status(200).send(user.problemSolved);

  } catch (error) {
      res.status(500).send("server Error")
  }
}
const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;

    console.log(userId);
    console.log(problemId);
    
    const ans = await Submission.find({ userId, problemId });
    
    

    if (ans.length === 0) {
      return res.status(200).send("No Submission is present");
    }

    return res.status(200).json(ans);
    
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};




module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem,solvedAllProblembyUserCOllege};


