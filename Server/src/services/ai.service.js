const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1. Recipe Generation (Strict JSON Mode)
const generateRecipeFromOpenAI = async (
  ingredients,
  cuisine,
  dietaryRestrictions
) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef. Always respond in valid JSON format.",
        },
        {
          role: "user",
          content: `Create a recipe with: ${ingredients.join(
            ", "
          )}. Cuisine: ${cuisine}. Dietary Restrictions: ${dietaryRestrictions.join(
            ", "
          )}. 
          JSON Structure: { "title": "", "ingredients": [], "instructions": [], "nutrition": { "calories": 0, "protein": "", "carbs": "", "fat": "" } }`,
        },
      ],
      response_format: { type: "json_object" },
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error(
      error.status === 429 ? "OpenAI Quota Exceeded." : error.message
    );
  }
};

// 2. Real-time Chat (Conversational Mode)
const getAIChatResponse = async (
  userMessage,
  history = [],
  dietaryPreferences = []
) => {
  try {
    // History optimization: Last 10 messages for context
    const context = history.slice(-10).map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));

    // Build system message with strict domain restrictions
    let systemMessage = `You are a specialized AI Assistant for "RecipeRemix AI", a culinary platform. 
    your name is "RecipeRemix AI".
    
    STRICT RULES:
    1. You effectively refuse to answer ANY questions that are not related to food, cooking, recipes, ingredients, culinary techniques, or kitchen safety.
    2. If a user asks about non-food topics (e.g., coding, politics, general knowledge, math), politely decline and steer them back to cooking "I only talk about food and recipes.".
    3. When suggesting recipes, you MUST strictly adhere to the user's dietary preferences (if any).
    4. You can generate full recipes, suggest ingredients based on what the user has, or explain cooking techniques.
    5. Keep responses concise, friendly, and appetizing.
    `;

    if (dietaryPreferences && dietaryPreferences.length > 0) {
      systemMessage += `
      
      USER DIETARY PREFERENCES (MUST FOLLOW): ${dietaryPreferences.join(", ")}.
      Do NOT suggest any recipes containing ingredients purely identifiable as these restricted items.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        ...context,
        { role: "user", content: userMessage },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(
      error.status === 429 ? "AI is busy. Try again later." : error.message
    );
  }
};

module.exports = { generateRecipeFromOpenAI, getAIChatResponse };
