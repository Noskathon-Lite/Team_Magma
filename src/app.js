import cors from "cors";
import express from "express";
import axios from "axios";
import { userRoute } from "./routes/userRoutes.js";
import rateLimit from 'express-rate-limit';

import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Helper functions for determining expressions and animations
function determineExpression(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('sorry') || lowerText.includes('error') || lowerText.includes('cannot')) {
    return 'sad';
  }
  if (lowerText.includes('great') || lowerText.includes('thank') || lowerText.includes('happy')) {
    return 'smile';
  }
  if (lowerText.includes('warning') || lowerText.includes('caution')) {
    return 'surprised';
  }
  if (lowerText.includes('urgent') || lowerText.includes('immediate')) {
    return 'angry';
  }
  return 'default';
}

function determineAnimation(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('thanks')) {
    return 'Thankful';
  }
  if (lowerText.includes('no') || lowerText.includes('incorrect') || lowerText.includes('wrong')) {
    return 'Dismissing';
  }
  if (lowerText.includes('think') || lowerText.includes('consider')) {
    return 'HeadShake';
  }
  if (lowerText.includes('look') || lowerText.includes('see') || lowerText.includes('watch')) {
    return 'LookAround';
  }
  return 'Idle';
}

const getGeminiResponse = async (userMessage) => {
  try {
    console.log('1. Starting API request with message:', userMessage);

    const inputData = {
      contents: [{
        parts: [{ 
          text: `You are a medical assistant. Provide a brief, accurate, and clear response about medical conditions or health queries. Focus on essential information and keep answers concise. Do not provide diagnostic claims or definitive medical advice.
Query: ${userMessage}
Remember:
- Keep responses under 3-4 sentences
- Use simple, clear language
- Focus on factual medical information
- Include appropriate medical disclaimers when needed`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 150,
        topP: 0.8,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_MEDICAL",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log('2. Making API call...');
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_GEN_AI_API_KEY}`,
      inputData,
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('3. API response received:', {
      status: response.status,
      hasData: !!response.data,
      hasCandidates: !!response.data?.candidates,
      candidatesLength: response.data?.candidates?.length
    });

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log('4. Invalid response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid response structure from Gemini API');
    }

    const text = response.data.candidates[0].content.parts[0].text;
    console.log('5. Extracted text:', text.substring(0, 50) + '...');

    if (text.length > 500) {
      return {
        text: "Let me provide a simpler response. Please ask your question again.",
        facialExpression: "sad",
        animation: "HeadShake"
      };
    }

    if (text.toLowerCase().includes("diagnos") || text.toLowerCase().includes("treatment")) {
      const disclaimer = " Please consult a healthcare professional for proper medical advice.";
      return {
        text: text + disclaimer,
        facialExpression: determineExpression(text),
        animation: determineAnimation(text)
      };
    }

    console.log('6. Returning successful response');
    return {
      text,
      facialExpression: determineExpression(text),
      animation: determineAnimation(text)
    };

  } catch (error) {
    console.error("Detailed Gemini API Error:", {
      message: error.message,
      code: error.code,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      stack: error.stack
    });

    // Return user-friendly error based on the type of error
    if (error.response?.status === 401) {
      return {
        text: "Authentication error. Please check the API configuration.",
        facialExpression: "sad",
        animation: "HeadShake"
      };
    }

    if (error.code === 'ECONNABORTED') {
      return {
        text: "Request timed out. Please try again.",
        facialExpression: "sad",
        animation: "HeadShake"
      };
    }

    if (error.response?.status === 400) {
      return {
        text: "Invalid request format. Please try again with a different question.",
        facialExpression: "sad",
        animation: "HeadShake"
      };
    }

    return {
      text: "I'm having trouble connecting to the service. Please try again in a moment.",
      facialExpression: "sad",
      animation: "HeadShake"
    };
  }
};

app.post("/chat", async (req, res) => {
  try {
    const { message: userMessage } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({
        messages: [
          { 
            text: "Please provide a valid message.",
            facialExpression: "sad",
            animation: "HeadShake"
          }
        ],
      });
    }

    if (userMessage.length > 500) {
      return res.status(400).json({
        messages: [
          {
            text: "Message is too long. Please keep it under 500 characters.",
            facialExpression: "sad",
            animation: "Dismissing"
          }
        ],
      });
    }

    const geminiResponse = await getGeminiResponse(userMessage);

    res.json({
      messages: [geminiResponse]
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      messages: [{
        text: "An error occurred while processing your request.",
        facialExpression: "sad",
        animation: "HeadShake"
      }]
    });
  }
});

app.use("/api/users", userRoute);

export { app };