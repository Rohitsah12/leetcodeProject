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

            const submission=visibleTestCases.map((input,output)=>({
                source_code:completeCode,
                language_id:languageId,
                stdin:input,
                expected_output:output
            }))

            const submitResult=await submitBatch(submission);
        }

    } catch (error) {
        res.send("Error: "+error);
    }
}