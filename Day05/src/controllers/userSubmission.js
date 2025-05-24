const Problem=require("../models/problem")
const Submission=require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");


const submitCode=async (req,res)=>{
    try {
        const userId=req.result._id;
        const problemId=req.params.id;
        const {code,language}=req.body;

        if(!userId || !code || !problemId || !language){
            return res.status(400).send("Some field missing");
        }


        //fetch the problem from the databases

        const problem=await Problem.findById(problemId);

        const submittedResult= await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })

        //judg0 ko code submit krna h

        const languageId=getLanguageById(language);
        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input || "",
            expected_output: testcase.output || ""
        }));
        const submitResult = await submitBatch(submissions);
        const resultTokens = submitResult.map((value) => value.token);
        const testResults = await submitToken(resultTokens);

        //submitResult ko update krna pdega
        let testCasesPassed=0;
        let runtime=0;
        let memory=0;
        let status='accepted'
        let errorMsg=''


        for(const test of testResults) {
            if(test.status_id==3){
                testCasesPassed++;
                runtime+=parseFloat(test.time);
                memory=Math.max(memory,test.memory);
            

            }else{
                if(test.status_id==4){
                    status='error'
                    errorMsg=test.stderr;
                }else{
                    status='wrong'
                    errorMsg=test.stderr;
                }
            }
        }


        //store the result in databaase

        submittedResult.status=status;
        submittedResult.testCasesPassed=testCasesPassed;
        submittedResult.errorMessage=errorMsg;
        submittedResult.runtime=runtime;
        submittedResult.memory=memory;

        await submittedResult.save();

        res.status(201).send(submittedResult)

        
        

    } catch (error) {
       res.status(500).send("Internal server error "+error);
    }
}

module.exports=submitCode;

//  language_id: 62,
//     stdin: '-1 5',
//     expected_output: '4',
//     stdout: '4\n',
//     status_id: 3,
//     created_at: '2025-05-24T10:45:52.710Z',
//     finished_at: '2025-05-24T10:45:53.345Z',
//     time: '0.058',
//     memory: 19328,
//     stderr: null,
//     token: 'a45157dd-9a28-4dea-bc43-f61ef1b67c88',