const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Recipe Generation (Strict JSON Mode)
const generateRecipeFromOpenAI = async (ingredients, cuisine, dietaryRestrictions) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional chef. Always respond in valid JSON format." },
        {
          role: "user",
          content: `Create a recipe with: ${ingredients.join(", ")}. Cuisine: ${cuisine}. Dietary Restrictions: ${dietaryRestrictions.join(", ")}. 
          JSON Structure: { "title": "", "ingredients": [], "instructions": [], "nutrition": { "calories": 0, "protein": "", "carbs": "", "fat": "" } }`
        }
      ],
      response_format: { type: "json_object" },
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error(error.status === 429 ? "OpenAI Quota Exceeded." : error.message);
  }
};

// 2. Real-time Chat (Conversational Mode)
const getAIChatResponse = async (userMessage, history = [], dietaryPreferences = []) => {
  try {
    // History optimization: Last 10 messages for context
    const context = history.slice(-10).map(msg => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content
    }));

    // Build system message with dietary preferences
    let systemMessage = "You are a helpful culinary assistant. Keep responses concise and friendly.";
    if (dietaryPreferences && dietaryPreferences.length > 0) {
      systemMessage += ` The user has the following dietary preferences: ${dietaryPreferences.join(", ")}. Always consider these preferences when suggesting recipes or ingredients.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        ...context,
        { role: "user", content: userMessage }
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(error.status === 429 ? "AI is busy. Try again later." : error.message);
  }
};

module.exports = { generateRecipeFromOpenAI, getAIChatResponse };