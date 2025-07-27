const axios = require('axios');

// Language mapping
const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "cpp": 54,
    "java": 62,
    "javascript": 63,
    "js": 63
  };
  return language[lang.toLowerCase()];
};

// Submit batch of test cases
const submitBatch = async (submissions) => {
  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'false'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_KEY, // Fixed typo
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      submissions
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("Submit Batch Error:", error.response?.data || error.message);
    throw error;
  }
};

// Proper async delay
const waiting = (timer) => new Promise((resolve) => setTimeout(resolve, timer));

// Polling result by token
const submitToken = async (resultToken) => {
  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0_KEY, // Fixed: use env variable
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error("Token Fetch Error:", error.response?.data || error.message);
      throw error;
    }
  };

  let attempts = 0;
  const maxAttempts = 30; // Prevent infinite loops

  while (attempts < maxAttempts) {
    try {
      const result = await fetchData();
      const isResultReady = result.submissions.every((r) => r.status?.id > 2);
      
      if (isResultReady) {
        return result.submissions;
      }
      
      await waiting(1000);
      attempts++;
    } catch (error) {
      console.error(`Polling attempt ${attempts + 1} failed:`, error.message);
      attempts++;
      
      if (attempts >= maxAttempts) {
        throw new Error("Maximum polling attempts reached");
      }
      
      await waiting(2000); // Wait longer on error
    }
  }

  throw new Error("Polling timeout: Results not ready after maximum attempts");
};

module.exports = { getLanguageById, submitBatch, submitToken };
