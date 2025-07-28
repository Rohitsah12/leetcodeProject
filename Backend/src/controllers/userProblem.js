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
    // Input validation
    if (!title || !description || !difficulty || !visibleTestCases || !hiddenTestCases || !startCode || !referenceSolution) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["title", "description", "difficulty", "visibleTestCases", "hiddenTestCases", "startCode", "referenceSolution"]
      });
    }

    if (!Array.isArray(visibleTestCases) || visibleTestCases.length === 0) {
      return res.status(400).json({
        message: "visibleTestCases must be a non-empty array"
      });
    }

    if (!Array.isArray(referenceSolution) || referenceSolution.length === 0) {
      return res.status(400).json({
        message: "referenceSolution must be a non-empty array"
      });
    }

    // Validate reference solutions against visible test cases
    for (const solution of referenceSolution) {
      if (!solution.language || !solution.completeCode) {
        return res.status(400).json({
          message: "Each referenceSolution must have 'language' and 'completeCode' fields"
        });
      }

      const languageId = getLanguageById(solution.language);
      if (!languageId) {
        return res.status(400).json({
          message: "Invalid language specified in referenceSolution",
          language: solution.language,
          supportedLanguages: ["c++", "java", "javascript"]
        });
      }

      // Prepare submissions for validation
      const submissions = visibleTestCases.map(testcase => {
        if (!testcase.input || !testcase.output) {
          throw new Error("Each test case must have 'input' and 'output' fields");
        }
        
        return {
          source_code: solution.completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output.toString().trim()
        };
      });

      console.log(`Validating ${solution.language} solution with ${submissions.length} test cases...`);

      const submitResult = await submitBatch(submissions);
      
      if (!submitResult || !Array.isArray(submitResult)) {
        return res.status(502).json({
          message: "Failed to submit test cases to judge",
          language: solution.language
        });
      }

      const tokens = submitResult.map(item => item.token);
      
      // Wait for compilation and execution
      await new Promise(resolve => setTimeout(resolve, 3000)); // Increased wait time
      
      const testResults = await submitToken(tokens);

      // Validate results
      for (let i = 0; i < testResults.length; i++) {
        const result = testResults[i];
        
        if (result.status?.id !== 3) { // 3 = Accepted
          return res.status(400).json({
            message: "Reference solution failed validation",
            details: {
              language: solution.language,
              testCaseIndex: i,
              testCaseInput: result.stdin,
              expected: submissions[i].expected_output,
              actual: result.stdout?.trim() || "No output",
              error: result.stderr || "No error message",
              compileOutput: result.compile_output || "No compile output",
              status: result.status?.description || "Unknown status",
              statusId: result.status?.id
            }
          });
        }

        // Additional output validation
        const actualOutput = result.stdout?.trim() || "";
        const expectedOutput = submissions[i].expected_output;
        
        if (actualOutput !== expectedOutput) {
          return res.status(400).json({
            message: "Output mismatch in reference solution",
            details: {
              language: solution.language,
              testCaseIndex: i,
              expected: expectedOutput,
              actual: actualOutput
            }
          });
        }
      }

      console.log(`✅ ${solution.language} solution validated successfully`);
    }

    // All validations passed, create the problem
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags: tags || [],
      companies: companies || [],
      hints: hints || [],
      constraints: constraints || [],
      visibleTestCases,
      hiddenTestCases,
      startCode,
      referenceSolution,
      problemCreator: req.result._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: "Problem created successfully",
      problemId: problem._id,
      title: problem.title,
      difficulty: problem.difficulty
    });

  } catch (error) {
    console.error("Error creating problem:", error);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Database validation error",
        details: error.message
      });
    }

    if (error.response) {
      console.error("Judge0 API error:", error.response.data);
      return res.status(502).json({
        message: "Online judge service unavailable",
        details: error.response.data
      });
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(502).json({
        message: "Unable to connect to online judge service"
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : "Something went wrong"
    });
  }
};




// controllers/problemController.js
const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Received update request for problem ID:', id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Validate problem ID format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid problem ID format" 
      });
    }

    // Check if problem exists
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

    // Enhanced validation
    if (!title?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Title is required and cannot be empty" 
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Description is required and cannot be empty" 
      });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ 
        success: false, 
        message: "Difficulty must be 'easy', 'medium', or 'hard'" 
      });
    }

    // Validate test cases
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

    // Validate visible test cases structure
    for (let i = 0; i < visibleTestCases.length; i++) {
      const testCase = visibleTestCases[i];
      if (!testCase.input?.trim() || !testCase.output?.trim() || !testCase.explanation?.trim()) {
        return res.status(400).json({
          success: false,
          message: `Visible test case ${i + 1} is incomplete. All fields (input, output, explanation) are required.`
        });
      }
    }

    // Validate hidden test cases structure
    for (let i = 0; i < hiddenTestCases.length; i++) {
      const testCase = hiddenTestCases[i];
      if (!testCase.input?.trim() || !testCase.output?.trim()) {
        return res.status(400).json({
          success: false,
          message: `Hidden test case ${i + 1} is incomplete. Both input and output are required.`
        });
      }
    }

    // Validate code templates
    if (!startCode || !Array.isArray(startCode) || startCode.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Start code for all three languages (C++, Java, JavaScript) is required"
      });
    }

    if (!referenceSolution || !Array.isArray(referenceSolution) || referenceSolution.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Reference solutions for all three languages (C++, Java, JavaScript) are required"
      });
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      tags: Array.isArray(tags) ? tags.filter(tag => tag && tag.trim()) : [],
      companies: Array.isArray(companies) ? companies.filter(company => company && company.trim()) : [],
      hints: Array.isArray(hints) ? hints.filter(hint => hint && hint.trim()) : [],
      constraints: Array.isArray(constraints) ? constraints.filter(constraint => constraint && constraint.trim()) : [],
      visibleTestCases: visibleTestCases.map(tc => ({
        input: tc.input.trim(),
        output: tc.output.trim(),
        explanation: tc.explanation.trim()
      })),
      hiddenTestCases: hiddenTestCases.map(tc => ({
        input: tc.input.trim(),
        output: tc.output.trim()
      })),
      startCode: startCode.map(sc => ({
        language: sc.language,
        initialCode: sc.initialCode || ""
      })),
      referenceSolution: referenceSolution.map(rs => ({
        language: rs.language,
        completeCode: rs.completeCode || ""
      })),
      updatedAt: new Date()
    };

    console.log('Updating problem with data:', {
      id,
      title: updateData.title,
      difficulty: updateData.difficulty,
      tagsCount: updateData.tags.length,
      visibleTestCasesCount: updateData.visibleTestCases.length,
      hiddenTestCasesCount: updateData.hiddenTestCases.length
    });

    // Perform the update
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      updateData,
      { 
        runValidators: true, 
        new: true,
        context: 'query'
      }
    );

    if (!updatedProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found or could not be updated"
      });
    }

    console.log('Problem updated successfully:', updatedProblem._id);

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: updatedProblem
    });

  } catch (err) {
    console.error('Error updating problem:', err);
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID format"
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A problem with this title already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error occurred while updating the problem",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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


