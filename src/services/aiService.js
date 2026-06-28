import { db } from "../config/db.js";

import { OpenRouter } from "@openrouter/sdk";

export async function getAIResponse({
  durationOfWorkout,
  workoutType,
  focusArea,
}) {
  const APIKey = import.meta.env.VITE_OPENROUTER_APIKEY;
  console.time("Dexie");
  const profile = (await db.profile.toCollection().last()) || [];
  const userHistory =
    (await db.history.orderBy("id").reverse().limit(10).toArray()) || [];
  console.log("profile ", profile, "hestory", userHistory);
  console.timeEnd("Dexie");

  try {
    const openrouter = new OpenRouter({
      apiKey: APIKey,
    });
    const start = performance.now();
    const response = await openrouter.chat.send({
      chatRequest: {
        model: "openrouter/owl-alpha",
        messages: [
          {
            role: "user",
            content: "can u be my gym trainer",
          },
        ],
      },
    });
    const end = performance.now();

    console.log(`API took ${(end - start).toFixed(0)} ms`);

    console.log("ai response is", response.choices[0].message);
    return response.choices[0].message;
  } catch (error) {
    if (error.message.includes("429")) {
      throw new Error(
        "Gemini quota exceeded. Please check API key, billing, or try again later.",
      );
    }
    throw error;
  }
}
