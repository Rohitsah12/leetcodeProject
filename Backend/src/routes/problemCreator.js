const express=require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem, solvedAllProblembyUser, submittedProblem, solvedAllProblembyUserCOllege,} = require('../controllers/userProblem');
const userMiddleware = require('../middleware/userMiddleWare');
const Problem = require('../models/problem');

const problemRouter=express.Router();

//Create problem
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);



problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser);
problemRouter.get("/problemSolvedByUser/:userId",solvedAllProblembyUserCOllege);   
problemRouter.get("/submittedProblem/:id",userMiddleware,submittedProblem)

// Add this route to problemRouter
problemRouter.get('/getCompanies', async (req, res) => {
  try {
    const companies = await Problem.aggregate([
      { $unwind: "$companies" },
      { $group: { _id: "$companies" } },
      { $project: { _id: 0, company: "$_id" } },
      { $sort: { company: 1 } }
    ]);
    
    // Extract just the company names
    const companyNames = companies.map(c => c.company);
    console.log('Companies found:', companyNames); // Add logging
    res.json(companyNames);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Error fetching companies' });
  }
});

problemRouter.get('/getTopics', async (req, res) => {
  try {
    const topics = await Problem.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags" } },
      { $project: { _id: 0, topic: "$_id" } },
      { $sort: { topic: 1 } }
    ]);
    
    // Extract just the topic names
    const topicNames = topics.map(t => t.topic);
    res.json(topicNames);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Error fetching topics' });
  }
});

// In your problem routes
problemRouter.post('/by-ids', async (req, res) => {
  try {
    const { problemIds } = req.body;
    
    if (!problemIds || !Array.isArray(problemIds)) {
      return res.status(400).json({ message: 'Invalid problem IDs' });
    }
    
    const problems = await Problem.find({
      _id: { $in: problemIds }
    }).select('difficulty');
    
    res.json(problems);
  } catch (err) {
    console.error('Error fetching problems:', err);
    res.status(500).json({ message: 'Error fetching problems' });
  }
});
//fetch
//update
//delete

module.exports=problemRouter

