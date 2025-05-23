const express=require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem} = require('../controllers/userProblem');
const userMiddleware = require('../middleware/userMiddleWare');

const problemRouter=express.Router();

//Create problem
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);

problemRouter.get("/problemById:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblembyUser);
//fetch
//update
//delete

module.exports=problemRouter