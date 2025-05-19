const Problem = require("../models/problem");
const {getLanguageById,submitBatch} = require("../utils/problemUtility");

const createProblem=async (req,res)=>{
    const {title,description,difficulty,
        tags,visibleTestCases,hiddenTestCases,
        startCode,referenceSolution,problemCreator}=req.body;

    try {
        
        for(const {language,completeCode} of referenceSolution){
            //source_code:
            //language_id:
            //stdin:
            //expected_output

            const languageId=getLanguageById(language);

            const submission=visibleTestCases.map((testcase)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:testcase.input,
                expected_output:testcase.output
            }))

            const submitResult=await submitBatch(submission);

            const resultToken=submitResult.map((value)=>value.token);

            //[token1,token2,token3]

            const testResult= await submitToken(resultToken);

            for(const test of testResult){
                if(test.status_id!=3){
                    return res.status(400).send("Error Occured");
                }
            }
        }
        //we can store it in D.B

        await Problem.create({
            ...req.body,
            problemCreator:req.result._id
        })

        res.status(201).send("Problen Saved Successfully");

    } catch (error) {
        res.send("Error: "+error);
    }
}

module.exports=createProblem;