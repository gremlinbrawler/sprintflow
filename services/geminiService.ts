
import { GoogleGenAI, Type } from "@google/genai";
import { BlockType, Task, SprintBlock, SubTask } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMilestoneEncouragement = async (progress: number, stage: string): Promise<string> => {
  const prompt = `The user is at ${Math.round(progress)}% of their daily goal, currently in the "${stage}" stage. 
  Give them a single, high-energy sentence of encouragement. 
  If they are early, focus on momentum. If they are mid-way, focus on stamina. If they are near the end, focus on the finish line.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    return "Keep pushing, the finish line is waiting.";
  }
};

export const unpackTask = async (taskTitle: string): Promise<string[]> => {
  const prompt = `I am feeling very anxious about starting this task: "${taskTitle}". 
  Please break it down into 5 to 7 "ridiculously easy" micro-steps (tadpoles). 
  Each step should be so small it feels trivial to start. 
  Example for "Write Report": "1. Open the document", "2. Type just the header", "3. Save the file". 
  Focus on the absolute first movements required to get over the starting hump.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini unpacking failed:", error);
    return ["Open the necessary tool", "Sit down and focus", "Take one deep breath", "Work for 2 minutes", "Check progress"];
  }
};

export const getBattleCry = async (tasks: Task[]): Promise<string> => {
  const frogCount = tasks.filter(t => t.category === 'frog' && !t.completed).length;
  const swarmCount = tasks.filter(t => t.category === 'swarm' && !t.completed).length;
  
  const prompt = `Generate a short, intense, 2-sentence "Battle Cry" for a productivity app. 
  The user has ${frogCount} "Bosses" (Frogs/Hard tasks) and ${swarmCount} "Swarm" (Easy tasks) to handle today.
  Be punchy, motivating, and a bit cinematic. No hashtags.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    return "The Frogs are loud, but your focus is louder. Let's conquer the day.";
  }
};

export const optimizeSprint = async (
  tasks: Task[],
  totalDurationMinutes: number
): Promise<SprintBlock[]> => {
  const prompt = `I have ${totalDurationMinutes} minutes and the following tasks: ${tasks.map(t => t.title).join(", ")}. 
  Plan a detailed work sprint with micro-pomodoros (focus blocks) and breaks. 
  Each block must be between 2 and 25 minutes. 
  Ensure a healthy rhythm of work and rest. 
  Assign specific tasks to work blocks. 
  Suggest creative break activities for break blocks (e.g., "stretching", "water break").`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "WORK or BREAK" },
              duration: { type: Type.NUMBER, description: "duration in minutes" },
              label: { type: Type.STRING, description: "A brief label for the block" },
              taskTitle: { type: Type.STRING, description: "Title of the task if it's a WORK block" }
            },
            required: ["type", "duration", "label"]
          }
        }
      }
    });

    const result = JSON.parse(response.text);
    return result.map((item: any, index: number) => ({
      id: `block-${Date.now()}-${index}`,
      type: item.type === "WORK" ? BlockType.WORK : BlockType.BREAK,
      duration: item.duration,
      label: item.label,
      taskId: item.type === "WORK" ? tasks.find(t => t.title === item.taskTitle)?.id : undefined
    }));
  } catch (error) {
    console.error("Gemini optimization failed:", error);
    return [
      { id: 'def-1', type: BlockType.WORK, duration: 25, label: 'Deep Focus' },
      { id: 'def-2', type: BlockType.BREAK, duration: 5, label: 'Short Break' }
    ];
  }
};
