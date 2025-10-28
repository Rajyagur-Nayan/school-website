const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Ensure you have GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Using the model you specified
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

/**
 * Send a prompt to Gemini and get the response.
 * @param {string} prompt - The input prompt for Gemini.
 * @returns {Promise<string>} - The generated response text.
 */
const getGeminiResponse = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (err) {
    // Log the full error for server-side debugging
    console.error("Gemini API Error:", err.message);

    // --- Improved Error Handling ---
    // This checks the error message from Google's API

    // 503: Model is overloaded
    if (err.message && err.message.includes("503")) {
      throw new Error(
        "The AI model is currently busy or overloaded. Please try again in a moment."
      );
    }

    // 429: Rate limit exceeded
    if (err.message && err.message.includes("429")) {
      throw new Error(
        "You have sent too many requests. Please wait a bit before trying again."
      );
    }

    // 400/401: API Key issue (often contains "API key")
    if (
      err.message &&
      (err.message.includes("API key") || err.message.includes("400"))
    ) {
      throw new Error(
        "Failed to get response: Invalid API Key. Please check your server configuration."
      );
    }

    // Fallback for other errors
    throw new Error(
      "An unexpected error occurred with the Gemini AI service. Please check the server logs."
    );
  }
};

module.exports = getGeminiResponse;
