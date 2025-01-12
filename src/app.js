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
    const inputData = {
      contents: [{
        parts: [{ 
          text: `You are a helpful medical assistant. Respond to: ${userMessage}` 
        }]
      }]
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_GEN_AI_API_KEY}`,
      inputData,
      {
        timeout: 10000 // 10 second timeout
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const text = response.data.candidates[0].content.parts[0].text;
    
    return {
      text,
      facialExpression: determineExpression(text),
      animation: determineAnimation(text)
    };
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return {
      text: "I'm having trouble processing your request right now. Please try again in a moment.",
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