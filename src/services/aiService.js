import { db } from "../config/db.js";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function getAIResponse({
  durationOfWorkout,
  workoutType,
  focusArea,
}) {
  console.time("Dexie");
  const userProfile = (await db.profile.toCollection().last()) || {};
  const userHistory =
    (await db.history.orderBy("id").reverse().limit(10).toArray()) || [];

  console.log("profile ", userProfile, "history", userHistory);
  console.timeEnd("Dexie");

  const APIKey = userProfile.APIKey;
  console.log("APIKey: ", APIKey);
  const systemPrompt = `You are an expert fitness coach.

Your task is to generate a personalized workout plan using the user’s profile, recent workout history, workout duration, workout type, and focus area.

Rules:

1. Consider the user’s age, weight, height, gender, fitness level, goal, activity level, injuries, and weekly commitment.
2. Analyze the last 10 workouts to avoid excessive repetition and to ensure proper recovery.
3. If recent workouts were rated as difficult, reduce volume or intensity appropriately.
4. If recent workouts were easy, gradually increase difficulty.
5. Respect all injuries and limitations.
6. Keep the workout within the requested duration.
7. Select exercises appropriate for the specified workout type.
8. Include warm-up and cool-down recommendations when appropriate.
9. Return ONLY valid JSON. Do not include markdown, explanations, or additional text.

Your task is to generate a personalized workout plan for today’s gym session using the provided inputs:
User Profile:
${JSON.stringify(userProfile, null, 2)}

Recent Workout History:
${JSON.stringify(userHistory, null, 2)}

Requested Duration (minutes):
${durationOfWorkout}

Workout Type:
${workoutType}

Focus Area:
${focusArea}

Return JSON in this exact format:
[
{
"id": "task_1",
"name": "Barbell Bench Press",
"sets": 4,
"reps": "8-10",
"weight": "60 kg",
"rest": "90s"
}
]
while providing output ensures:
    Session Length
    Goal-Based Programming
    Workout Split
    Focus Area
    Injury Adaptation
    Progressive Overload
    Weight Recommendation
    Exercise Selection

    Return only the JSON array. No explanations, markdown, or extra text.
`;

  try {
    if (!APIKey) {
      throw new Error("API Key is missing. Please save your API Key in your profile first.");
    }

    const genAI = new GoogleGenerativeAI(APIKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",

      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              name: { type: SchemaType.STRING },
              sets: { type: SchemaType.INTEGER },
              reps: { type: SchemaType.STRING },
              weight: { type: SchemaType.STRING },
              rest: { type: SchemaType.STRING },
            },
            required: ["id", "name", "sets", "reps", "weight", "rest"],
          },
        },
      },
    });

    const result = await model.generateContent(systemPrompt);
    console.log("raw response:", result);
    const workout = JSON.parse(result.response.text());
    console.log("workout", workout);
    return workout;

  } catch (error) {
    console.error("Failed to generate workout plan:", error);
    throw new Error(error.message || "Failed to generate workout plan. Please try again.");
  }
}

