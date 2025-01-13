import cors from "cors";
import express from "express";
import axios from "axios";
import { userRoute } from "./routes/userRoutes.js";
import rateLimit from "express-rate-limit";
import { Doctor } from "./models/doctorModel.js";

import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Helper functions for determining expressions and animations
function determineExpression(text) {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("sorry") ||
    lowerText.includes("error") ||
    lowerText.includes("cannot")
  ) {
    return "sad";
  }
  if (
    lowerText.includes("great") ||
    lowerText.includes("thank") ||
    lowerText.includes("happy")
  ) {
    return "smile";
  }
  if (lowerText.includes("warning") || lowerText.includes("caution")) {
    return "surprised";
  }
  if (lowerText.includes("urgent") || lowerText.includes("immediate")) {
    return "angry";
  }
  return "default";
}

function determineAnimation(text) {
  const lowerText = text.toLowerCase();

  if (
    lowerText.includes("hello") ||
    lowerText.includes("hi") ||
    lowerText.includes("thanks")
  ) {
    return "Thankful";
  }
  if (
    lowerText.includes("no") ||
    lowerText.includes("incorrect") ||
    lowerText.includes("wrong")
  ) {
    return "Dismissing";
  }
  if (lowerText.includes("think") || lowerText.includes("consider")) {
    return "HeadShake";
  }
  if (
    lowerText.includes("look") ||
    lowerText.includes("see") ||
    lowerText.includes("watch")
  ) {
    return "LookAround";
  }
  return "Idle";
}

const getGeminiResponse = async (userMessage) => {
  const symptomSpecialistMapping = {
    "joint pain": "ORTHOPAEDICS",
    fracture: "ORTHOPAEDICS",
    "chronic cough": "PULMONOLOGY",
    "abdominal pain": "GENERAL SURGERY",
    toothache: "ORAL AND MAXILLOFACIAL SURGERY",
    "child health issues": "PAEDIATRICS",
    "skin rash": "DERMATOLOGY",
    "vision problems": "OPHTHALMOLOGY",
    "pregnancy issues": "OBSTETRICS AND GYNAECOLOGY",
    "urinary issues": "UROLOGY",
    "brain or nerve issues": "NEUROLOGY",
    allergies: "IMMUNOLOGY",
    "heart issues": "CARDIOLOGY",
    "mental health concerns": "PSYCHIATRY",
    infections: "MICROBIOLOGY",
    "blood disorders": "PATHOLOGY",
    "difficulty breathing": "ANAESTHESIOLOGY",
    "chronic cough": "PULMONOLOGY",
    "abdominal pain": "GENERAL SURGERY",
    toothache: "ORAL AND MAXILLOFACIAL SURGERY",
    "child health issues": "PAEDIATRICS",
    "skin rash": "DERMATOLOGY",
    "vision problems": "OPHTHALMOLOGY",
    "pregnancy issues": "OBSTETRICS AND GYNAECOLOGY",
    "urinary issues": "UROLOGY",
    "brain or nerve issues": "NEUROLOGY",
    allergies: "IMMUNOLOGY",
    "heart issues": "CARDIOLOGY",
    "mental health concerns": "PSYCHIATRY",
    infections: "MICROBIOLOGY",
    "blood disorders": "PATHOLOGY",
    "difficulty breathing": "ANAESTHESIOLOGY",
    "hearing loss": "ENT (OTORHINOLARYNGOLOGY)",
    nosebleeds: "ENT (OTORHINOLARYNGOLOGY)",
    "dental cavities": "DENTISTRY",
    "hair loss": "DERMATOLOGY",
    "back pain": "ORTHOPAEDICS",
    "diabetes management": "ENDOCRINOLOGY",
    "thyroid issues": "ENDOCRINOLOGY",
    "weight management issues": "DIETETICS",
    "liver problems": "GASTROENTEROLOGY",
    "kidney stones": "NEPHROLOGY",
    "high blood pressure": "CARDIOLOGY",
    "stroke symptoms": "NEUROLOGY",
    "fertility issues": "REPRODUCTIVE MEDICINE",
    "cancer diagnosis": "ONCOLOGY",
    "vaccination queries": "IMMUNOLOGY",
    "gastrointestinal issues": "GASTROENTEROLOGY",
    "sleep disorders": "SLEEP MEDICINE",
    "chronic pain": "PAIN MANAGEMENT",
    "sports injuries": "SPORTS MEDICINE",
    osteoporosis: "ENDOCRINOLOGY",
    "speech problems": "SPEECH THERAPY",
    "developmental delays": "DEVELOPMENTAL PAEDIATRICS",
    "substance abuse": "ADDICTION MEDICINE",
    "post-surgery care": "REHABILITATION MEDICINE",
    "varicose veins": "VASCULAR SURGERY",
  };

  try {
    // 1. Find recommended specialist based on symptoms
    let recommendedSpecialist = null;
    for (const [symptom, specialist] of Object.entries(
      symptomSpecialistMapping
    )) {
      if (userMessage.toLowerCase().includes(symptom)) {
        recommendedSpecialist = specialist;
        break;
      }
    }

    // 2. Make Gemini API request
    console.log("1. Starting API request with message:", userMessage);

    const inputData = {
      contents: [
        {
          parts: [
            {
              text: `You are a medical assistant. Provide a brief, accurate, and clear response about medical conditions or health queries. Focus on essential information and keep answers concise. Do not provide diagnostic claims or definitive medical advice.
Query: ${userMessage}
Remember:
- Keep responses under 3-4 sentences
- Use simple, clear language
- Focus on factual medical information
- Include appropriate medical disclaimers when needed`,

// aghiko doctor list, also tell mee the specialist i need to consult based on the doctor list provided
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 150,
        topP: 0.8,
        topK: 40,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    console.log("2. Making API call...");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_GEN_AI_API_KEY}`,
      inputData,
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("3. API response received:", {
      status: response.status,
      hasData: !!response.data,
      hasCandidates: !!response.data?.candidates,
      candidatesLength: response.data?.candidates?.length,
    });

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log(
        "4. Invalid response structure:",
        JSON.stringify(response.data, null, 2)
      );
      throw new Error("Invalid response structure from Gemini API");
    }

    // 3. Get AI response text
    const aiResponseText = response.data.candidates[0].content.parts[0].text;
    console.log(
      "5. Extracted AI response:",
      aiResponseText.substring(0, 50) + "..."
    );

    // 4. Fetch matching doctors if specialist was identified
    let doctors = [];
    if (recommendedSpecialist) {
      console.log("Recommended Specialist:", recommendedSpecialist);
      try {
        doctors = await Doctor.find({ specialty: { $regex: new RegExp(`^${recommendedSpecialist}$`),$options: "i"} })
          .select("name degree specialty workingPlace contactInfo")
          .limit(5)
          .lean();
      } catch (dbError) {
        console.error("Error fetching doctors:", dbError);
        // Continue execution even if doctor fetch fails
      }
    }

    // 5. Construct final response
    let finalResponse = aiResponseText + "\n\n";

    if (recommendedSpecialist) {
      finalResponse += `Based on the symptoms mentioned, it is recommended to visit a ${recommendedSpecialist} specialist.`;

      if (doctors.length > 0) {
        finalResponse += "\n\nHere are some recommended doctors:\n\n";
        doctors.forEach((doctor) => {
          finalResponse += `- **Name**: ${doctor.name}\n  **Degree**: ${doctor.degree}\n  **Specialty**: ${doctor.specialty}\n  **Working Place**: ${doctor.workingPlace}\n  **Contact**: ${doctor.contactInfo}\n\n`;
        });
      } else {
        finalResponse +=
          "\n\nUnfortunately, no matching doctors were found in our database.";
      }
    } else {
      finalResponse +=
        "\n\nIf you are unsure about which specialist to consult, consider visiting a general physician first for guidance.";
    }

    console.log("6. Returning successful response");

    return {
      text: finalResponse,
      facialExpression: determineExpression(finalResponse),
      animation: determineAnimation(finalResponse),
    };
  } catch (error) {
    console.error("Detailed Error:", {
      message: error.message,
      code: error.code,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
      stack: error.stack,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      return {
        text: "Authentication error. Please check the API configuration.",
        facialExpression: "sad",
        animation: "HeadShake",
      };
    }

    if (error.code === "ECONNABORTED") {
      return {
        text: "Request timed out. Please try again.",
        facialExpression: "sad",
        animation: "HeadShake",
      };
    }

    if (error.response?.status === 400) {
      return {
        text: "Let me try to understand your question better. Could you rephrase it?",
        facialExpression: "sad",
        animation: "HeadShake",
      };
    }

    return {
      text: "I'm having trouble processing your request. Please try again in a moment.",
      facialExpression: "sad",
      animation: "HeadShake",
    };
  }
};

app.post("/chat", async (req, res) => {
  try {
    const { message: userMessage } = req.body;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({
        messages: [
          {
            text: "Please provide a valid message.",
            facialExpression: "sad",
            animation: "HeadShake",
          },
        ],
      });
    }

    if (userMessage.length > 500) {
      return res.status(400).json({
        messages: [
          {
            text: "Message is too long. Please keep it under 500 characters.",
            facialExpression: "sad",
            animation: "Dismissing",
          },
        ],
      });
    }

    const geminiResponse = await getGeminiResponse(userMessage);

    res.json({
      messages: [geminiResponse],
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({
      messages: [
        {
          text: "An error occurred while processing your request.",
          facialExpression: "sad",
          animation: "HeadShake",
        },
      ],
    });
  }
});

app.use("/api/users", userRoute);

export { app };
