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


// controllers/problemController.js
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Problem ID is required" 
      });
    }

    // Validate that the problem exists
    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({ 
        success: false, 
        message: "Problem not found" 
      });
    }

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

    // Validate required fields
    if (!title?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Title is required" 
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Description is required" 
      });
    }

    if (!visibleTestCases || !Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one visible test case is required" 
      });
    }

    if (!hiddenTestCases || !Array.isArray(hiddenTestCases) || hiddenTestCases.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one hidden test case is required" 
      });
    }

    console.log('Updating problem with ID:', id);
    console.log('Update data:', { title, difficulty, tags: tags?.length });

    // Update the problem
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        difficulty,
        tags: Array.isArray(tags) ? tags : [],
        companies: Array.isArray(companies) ? companies : [], 
        hints: Array.isArray(hints) ? hints : [],
        constraints: Array.isArray(constraints) ? constraints : [],
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution,
        updatedAt: new Date()
      },
      { 
        runValidators: true, 
        new: true // Return the updated document
      }
    );

    console.log('Problem updated successfully:', updatedProblem._id);

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: updatedProblem
    });

  } catch (err) {
    console.error('Error updating problem:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(err.errors).map(e => e.message)
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { updateProblem };


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
  const userId = req.result?._id;

  try {
    if (!id) return res.status(400).send("ID is Missing");

    // Fetch user role if user is authenticated
    let isAdmin = false;
    if (userId) {
      const user = await User.findById(userId).select('role');
      isAdmin = user?.role === 'admin';
    }

    console.log('User is admin:', isAdmin);
    console.log('User ID:', userId);
    
    // FIXED: Use different approach for conditional field selection
    let selectFields = '_id title description difficulty tags visibleTestCases startCode referenceSolution hints constraints companies';
    
    if (isAdmin) {
      selectFields += ' hiddenTestCases';
    }

    const getProblem = await Problem.findById(id).select(selectFields);

    if (!getProblem) return res.status(404).send("Problem is Missing");

    // DEBUG: Log the problem data to see what's actually in the database
    console.log('=== PROBLEM DATA FROM DB ===');
    console.log('Problem ID:', getProblem._id);
    console.log('Has hiddenTestCases field:', 'hiddenTestCases' in getProblem);
    console.log('hiddenTestCases value:', getProblem.hiddenTestCases);
    console.log('hiddenTestCases type:', typeof getProblem.hiddenTestCases);
    console.log('hiddenTestCases length:', getProblem.hiddenTestCases?.length);

    // Get video solution
    const videos = await SolutionVideo.findOne({ problemId: id });

    // Prepare response data
    const responseData = {
      ...getProblem.toObject(),
      secureUrl: videos?.secureUrl || null,
      thumbnailUrl: videos?.thumbnailUrl || null,
      duration: videos?.duration || null,
    };

    // DEBUG: Log what we're sending back
    console.log('=== RESPONSE DATA ===');
    console.log('Response has hiddenTestCases:', 'hiddenTestCases' in responseData);
    console.log('Response hiddenTestCases:', responseData.hiddenTestCases);

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error in getProblemById:', err);
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


