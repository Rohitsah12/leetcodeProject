const axios = require('axios');

// Language mapping
const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63
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
      'x-rapidapi-key': '44a8b373fcmsh59f6431ae62bf12p1042a2jsn2fa9e8e04fbb',
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
      'x-rapidapi-key': '44a8b373fcmsh59f6431ae62bf12p1042a2jsn2fa9e8e04fbb',
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

  while (true) {
    const result = await fetchData();
    const isResultReady = result.submissions.every((r) => r.status_id > 2);
    if (isResultReady) return result.submissions;
    await waiting(1000);
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };
