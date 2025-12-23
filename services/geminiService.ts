
import { GoogleGenAI } from "@google/genai";
import { ALL_EXERCISES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIAssistantResponse = async (userPrompt: string) => {
  const systemInstruction = `
    Tu es un expert en méthodologie Seirul-lo et en entraînement du football moderne.
    Tu aides les entraîneurs à planifier leurs séances en utilisant la classification des 100 SSP.
    Voici le contexte des exercices disponibles : ${JSON.stringify(ALL_EXERCISES.slice(0, 50))}... (le catalogue contient 100 exercices).
    
    Tes réponses doivent être :
    1. Précises et basées sur la spécificité (NE).
    2. Utiles pour la planification (ex: J-4 Force, J-3 Endurance, J-2 Vitesse).
    3. Encourageantes et professionnelles.
    4. En français uniquement.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, je ne peux pas traiter votre demande pour le moment. Vérifiez votre connexion.";
  }
};
