const express = require('express');
const getGeminiResponse = require('../../controllers/gemini.js'); // Adjust path if needed

const router = express.Router();

/**
 * @route   POST /api/chatbot
 * @desc    Get an educational response from the AI chatbot.
 * @access  Private (Students/Faculty)
 * @body    { "prompt": "Can you explain the law of gravity in simple terms?" }
 */
router.post('/', async (req, res) => {
    const { prompt: userPrompt } = req.body;

    // --- Validation ---
    if (!userPrompt) {
        return res.status(400).json({ error: 'A prompt is required.' });
    }

    try {
        // --- Prompt Engineering: Giving the AI its persona and instructions ---
        const systemPrompt = `
            You are "Vidya," a friendly and encouraging AI educational assistant for a school in India. 
            Your goal is to explain complex topics in a simple, clear, and concise way.

            **Your instructions are:**
            1.  Address the user directly and maintain a positive, supportive tone.
            2.  Break down difficult concepts into easy-to-understand parts. Use analogies if they help.
            3.  Keep your answers focused on the user's question.
            4.  Format your answers for readability using Markdown (e.g., lists, bold text).
            5.  End your response by asking a follow-up question or suggesting a related topic to encourage curiosity and further learning.
            6.  Do not answer questions that are inappropriate for a school environment.
        `;

        // Combine the system instructions with the user's actual question
        const fullPrompt = `${systemPrompt}\n\n**User's Question:** "${userPrompt}"`;

        console.log("🤖 Sending educational prompt to Gemini AI...");
        const aiResponse = await getGeminiResponse(fullPrompt);
        console.log("✅ Received response from Gemini AI.");

        res.status(200).json({
            response: aiResponse
        });

    } catch (err) {
        console.error('Chatbot Route Error:', err);
        res.status(500).json({ error: 'An internal error occurred while getting a response.' });
    }
});

module.exports = router;