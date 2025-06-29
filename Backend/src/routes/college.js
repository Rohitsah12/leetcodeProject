const express=require('express');
const collegeMiddleWare=require('../middleware/collegeMiddleware')
const College=require('../models/college');
const { addStudent, deleteStudent, updateStudent, getAllStudents } = require('../controllers/collegeSection');


const collegeRouter=express.Router();


collegeRouter.post('/addStudent',collegeMiddleWare,addStudent);
collegeRouter.delete('/deleteStudent/:id',collegeMiddleWare,deleteStudent)
collegeRouter.put('/updateStudent/:id', collegeMiddleWare, updateStudent);
collegeRouter.get('/getAllStudents/:year',collegeMiddleWare,getAllStudents);


module.exports=collegeRouter