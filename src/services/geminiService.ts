import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, TripPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const tripPlanSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    summary: { type: Type.STRING },
    flights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          airline: { type: Type.STRING },
          departure: { type: Type.STRING },
          arrival: { type: Type.STRING },
          duration: { type: Type.STRING },
          price: { type: Type.NUMBER },
          stops: { type: Type.INTEGER },
          isSmartChoice: { type: Type.BOOLEAN }
        },
        required: ["id", "airline", "departure", "arrival", "duration", "price", "stops"]
      }
    },
    hotels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          image: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          pricePerNight: { type: Type.NUMBER },
          description: { type: Type.STRING },
          amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendationReason: { type: Type.STRING },
          location: { type: Type.STRING }
        },
        required: ["id", "name", "image", "rating", "pricePerNight", "description", "amenities", "location"]
      }
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          activities: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["day", "title", "activities"]
      }
    }
  },
  required: ["destination", "summary", "flights", "hotels", "itinerary"]
};

export async function generateTripPlan(prefs: UserPreferences): Promise<TripPlan> {
  const prompt = `Plan a comprehensive trip for ${prefs.travelers} people to ${prefs.destination} from ${prefs.startDate} to ${prefs.endDate}. 
  Budget level: ${prefs.budget}. 
  Interests: ${prefs.interests.join(', ')}.
  
  Please provide:
  1. A selection of realistic flights (3 options). Mark one as 'isSmartChoice' if it offers the best balance of time and price.
  2. Personalized hotel recommendations (3 options) that match the user's interests and budget. 
     IMPORTANT: For each hotel, include a specific 'recommendationReason' explaining why it's perfect for their interests (${prefs.interests.join(', ')}).
     Use realistic hotel names and provide a high-quality Unsplash image URL (via picsum.photos for now, but describe a good scenic context in the alt/description).
  3. A detailed daily itinerary for the entire duration.
  
  The response must be in JSON format matching the schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: tripPlanSchema as any,
    },
  });

  return JSON.parse(response.text);
}
