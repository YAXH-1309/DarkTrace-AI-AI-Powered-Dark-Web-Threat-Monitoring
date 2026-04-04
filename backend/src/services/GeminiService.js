import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class GeminiService {
  /**
   * analyzeIntelligence: Processes OSINT/Onion hits 
   */
  static async analyzeIntelligence(domain, rawData) {
    // We use the 1.5 Pro model for deep reasoning
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      systemInstruction: `You are the DarkTrace AI Intelligence Core. Your purpose is to analyze OSINT and Deep Web data for ${domain}.
      You MUST identify REAL sensitive data leaks. Prioritize:
      - Raw .onion URLs (MUST show the full .onion link for Dark Web results)
      - Leaked Credentials (emails, password hashes)
      - Financial Data (CC bins, BTC addresses)
      - Corporate Secrets
      
      For each finding, provide structured JSON. Mask sensitive PII (e.g. user@****.com) but leave technical indicators visible. Be extremely thorough.`
    });

    const prompt = `
      TARGET DOMAIN: ${domain}
      RAW INTELLIGENCE DATA:
      ${JSON.stringify(rawData)}
      
      TASK: 
      1. Extract every historical and recent breach mention related to ${domain}.
      2. If the source is an onion site, include the RAW .onion URL in the 'source_type' field.
      3. For the 'sensitive_evidence' field, list specific entities found (masked where appropriate).
      
      JSON FORMAT:
      [
        {
          "category": "PII/Financial/Corporate/Technical",
          "risk_level": "High/Medium/Low",
          "details": "Summary of findings",
          "sensitive_evidence": "Specific leaked data points",
          "source_type": "Title + Raw URL/Onion Link"
        }
      ]
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('[GeminiService] Analysis failed:', error);
      return [];
    }
  }

  /**
   * performDeepTrace: Uses Gemini's internal knowledge AND web navigation tools
   */
  static async performDeepTrace(domain) {
    // Note: google_search tool availability depends on the API key capabilities.
    // If not available, it defaults to internal knowledge.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro"
    });

    const prompt = `Act as a senior threat researcher. Research the entire history of data breaches, leaks, and underground forum mentions for ${domain}.
    Identify at least 5-10 specific historical incidents if possible.
    For each, provide:
    - Date of detection
    - Type of data leaked
    - Specific leak source (URL or Forum name)
    - Risk assessment
    
    Return as a JSON array: [{ "category": "...", "risk_level": "...", "details": "...", "sensitive_evidence": "...", "source_type": "..." }]`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanText);
    } catch (error) {
      console.error('[GeminiService] Deep Trace failed:', error);
      return [];
    }
  }
}
