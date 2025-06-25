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
      companies: [],
      hints: [],
      constraints: [],
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
    
    // Handle axios errors specifically
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


const updateProblem = async (req,res)=>{
    
  const {id} = req.params;
  const {title,description,difficulty,tags,
    visibleTestCases,hiddenTestCases,startCode,
    referenceSolution, problemCreator
   } = req.body;

  try{

     if(!id){
      return res.status(400).send("Missing ID Field");
     }

    const DsaProblem =  await Problem.findById(id);
    if(!DsaProblem)
    {
      return res.status(404).send("ID is not persent in server");
    }
      
    for(const {language,completeCode} of referenceSolution){
         

      // source_code:
      // language_id:
      // stdin: 
      // expectedOutput:

      const languageId = getLanguageById(language);
        
      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase)=>({
          source_code:completeCode,
          language_id: languageId,
          stdin: testcase.input,
          expected_output: testcase.output
      }));


      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value)=> value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
      
     const testResult = await submitToken(resultToken);

    //  console.log(testResult);

     for(const test of testResult){
      if(test.status_id!=3){
       return res.status(400).send("Error Occured");
      }
     }

    }


  const newProblem = await Problem.findByIdAndUpdate(id , {...req.body}, {runValidators:true, new:true});
   
  res.status(200).send(newProblem);
  }
  catch(err){
      res.status(500).send("Error: "+err);
  }
}

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


const getProblemById = async(req,res)=>{

  const {id} = req.params;
  try{
        
     
    if(!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution hints constraints companies ');
   
    // video ka jo bhi url wagera le aao
    

   if(!getProblem)
    return res.status(404).send("Problem is Missing");

   const videos = await SolutionVideo.findOne({problemId:id});

   if(videos){   
    
    const responseData={
      ...getProblem.toObject(),
      secureUrl : videos.secureUrl,
      thumbnailUrl : videos.thumbnailUrl,
      duration :videos.duration,

    }
      
    
      return res.status(200).send(responseData);
   }
    console.log(getProblem);
    
   res.status(200).send(getProblem);

  }
  catch(err){
    res.status(500).send("Error: "+err);
  }
}

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




module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem};


