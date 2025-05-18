const axios=require('axios')

const getLanguageById=(lang)=>{
    const language={
        'c++':105,
        'java':91,
        'javascript':102
    }

    return language[lang.toLowerCase()];
}

const submitBatch=async (submissions)=>{
    const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
            base64_encoded: 'true',
            wait: 'false',
            fields: '*'
        },
        headers: {
            'x-rapidapi-key': '7a23a40913msh47a08dbfc3007b7p18e937jsn9ce2f2eb8c7d',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions
        }
        };

        async function fetchData() {
            try {
                const response = await axios.request(options);
                return response.data;
            } catch (error) {
                console.error(error);
            }
        }

        return await fetchData();
}
module.exports={getLanguageById,submitBatch};