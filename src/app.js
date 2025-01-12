import cors from "cors";
import express from "express";
import axios from "axios";
import { userRoute } from "./routes/userRoutes.js";
const app = express();

app.use(express.json());

const corsOptions = {
  origin:  "http://localhost:5173",
  credentials: true
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const getGeminiResponse = async (userMessage) => {
  try {
    const inputData = JSON.stringify({
      "contents": [
        {
          "parts": [
            { "text": userMessage }
          ]
        }
      ]
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url:` https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_GEN_AI_API_KEY}`,
      headers: { 'Content-Type': 'application/json' },
      data: inputData,
    };

    const response = await axios.request(config);
    const data = response.data;

    return data.choices[0].message || {
      text: "Response not available.",
      facialExpression: "neutral",
      animation: "Idle",
    };
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return {
      text: "Error processing your request.",
      facialExpression: "sad",
      animation: "Idle",
    };
  }
};

app.post("/chat", async (req, res) => {
  const { message: userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({
      messages: [
        { text: "Please provide a valid message." },
        { text: "How can I assist you today?" },
      ],
    });
  }



  // Get the response from Gemini API
  const geminiResponse = await getGeminiResponse(userMessage);

  // Sending back the response with facial expressions and animations
  res.json({
    messages: [
      {
        text: geminiResponse.text,
        facialExpression: geminiResponse.facialExpression,
        animation: geminiResponse.animation,
      },
    ],
  });
});


// Routes
app.use("/api/users", userRoute);
// app.use("/api/chat", chatRoute);
// app.use("/api/voice", voiceRoute);

export { app };
