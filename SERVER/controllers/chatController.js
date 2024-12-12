const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Google Generative AI client
const genAi = new GoogleGenerativeAI('AIzaSyCVu_HUsrLWyyg0eZSSTC3jW4QqcikBXv0');
const model = genAi.getGenerativeModel({ model: "gemini-1.5-pro" });

// Controller function to handle user input and get a response from Gemini API
const getGeminiResponse = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        // Tailored prompt for CarbonX website
        const fullPrompt = `
            You are an AI chatbot embedded in the CarbonX website. 
            CarbonX's motto is "Leading the Path to Carbon Neutrality for Indian Coal Mines."
            Your role is to provide concise, accurate, and helpful insights about emissions reduction, carbon neutrality, and sustainability in coal mining.

            Respond succinctly and directly to the user's question. If the user greets you (e.g., "Hi", "Hello"), respond with a friendly but brief greeting like: "Hello! How can I assist you in reducing emissions today?"

            For any other question, provide relevant information that answers the user's query. Avoid unnecessary pleasantries and focus on delivering useful insights about CarbonX, emissions reduction, and sustainability in coal mining.

            User question: "${question}"
        `;


        // Call the Gemini API with the tailored prompt using generateContent
        const result = await model.generateContent(fullPrompt);

        // Log the entire result to check its structure
        console.log('API Response:', result);

        // Check if we have valid content in the result
        if (result && result.response && result.response.candidates && result.response.candidates.length > 0) {
            // The result.candidates[0] is an object, so let's extract the text properly
            const candidate = result.response.candidates[0];
            const answer = candidate?.content?.parts?.[0]?.text?.trim() || "Sorry, I couldn't process your request. Please try again.";

            // Send the valid response
            return res.status(200).json({ answer });
        }

        // Fallback if no valid answer is found
        return res.status(500).json({ error: "Could not process your request. Please try again." });

    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};

module.exports = { getGeminiResponse };
