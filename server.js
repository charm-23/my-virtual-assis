const express = require('express');
require('dotenv').config(); // Load environment variables from .env
const { GoogleGenAI } = require("@google/genai");

// Initialize the new Google GenAI client with API key from .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS

// Serve frontend files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// Middleware to parse JSON requests
app.use(express.json());

// Conversation history to make Anna stateful
let chatHistory = [];

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

    // Add the user's message to conversation history
    chatHistory.push({ role: "user", parts: [{ text: userQuery }] });

    try {
        // Use the latest Gemini 3.6 Flash model with full conversation history
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: chatHistory,
            config: {
                systemInstruction: "You are Anna, a helpful virtual assistant. Respond in plain conversational text only. Do not use markdown, bullet points, asterisks, or any formatting. Keep your answers concise (2-3 sentences max) since your response will be spoken aloud.",
            },
        });

        const text = response.text;

        // Add Anna's response to conversation history
        chatHistory.push({ role: "model", parts: [{ text: text }] });

        return res.json({ answer: text });

    } catch (error) {
        // Remove the failed user message from history
        chatHistory.pop();
        // Log the detailed error
        console.error('Error during Gemini request:', error.message || error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});

// Endpoint to clear conversation history
app.post('/clear', (req, res) => {
    chatHistory = [];
    console.log('Conversation history cleared');
    return res.json({ message: 'History cleared' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});