import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[], language: 'en' | 'ar' = 'ar'): Promise<string> => {
  if (transactions.length === 0) {
    return language === 'ar' 
      ? "أضف بعض المعاملات أولاً لأتمكن من تحليل ميزانيتك!" 
      : "Add some transactions first so I can analyze your budget!";
  }

  // Summarize data for the AI to save tokens
  const summary = transactions.map(t => 
    `- ${t.date}: ${t.description} (${t.type}) - $${t.amount} [${t.category}]`
  ).join('\n');

  const prompt = `
    You are a wise financial advisor. Analyze the following transaction history and provide 3 specific, actionable, and "wise" tips to improve the user's financial health.
    
    If the spending looks high in one category, point it out gently but firmly.
    
    Transactions:
    ${summary}

    Output Requirement:
    - Provide the response in ${language === 'ar' ? 'Arabic' : 'English'}.
    - Format as a clean markdown list.
    - Be concise and friendly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || (language === 'ar' ? "لم أستطع تحليل البيانات حالياً." : "Could not analyze data at the moment.");
  } catch (error) {
    console.error("AI Error:", error);
    return language === 'ar' 
      ? "حدث خطأ أثناء الاتصال بالمستشار الذكي." 
      : "Error connecting to the AI advisor.";
  }
};
