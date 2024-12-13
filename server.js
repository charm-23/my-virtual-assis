
const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyCkWMDtnxxJsdKtdet3SPDKfJb2IpBBeSw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors()); // Enable CORS

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to handle API requests from the frontend
app.post('/ask', async (req, res) => {
    console.log('Received request at /ask');

    // Extract the query from the request body
    const userQuery = req.body.query;
    // Check if the query is provided
    if (!userQuery) {
        console.log('No query provided');
        return res.status(400).json({ error: 'No query provided' });
    }
    
    const prompt = userQuery;
    try {

        const result = await model.generateContent(prompt);
        const text = result.response.candidates[0].content.parts[0].text;
        return res.json({ answer: text });


    } catch (error) {
        // Log the detailed error
        console.error('Error during Gemini request:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});