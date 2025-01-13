import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";


// Get backend URL from environment variable with fallback
const BACKEND_URL =  "http://localhost:3000";

const ChatContext = createContext();

// Speech synthesis setup
const setupSpeech = (text, onEnd) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.onend = onEnd;
  return utterance;
};

 const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const speakMessage = async (text) => {
    return new Promise((resolve) => {
      setSpeaking(true);
      const utterance = setupSpeech(text, () => {
        setSpeaking(false);
        resolve();
      });
      speechSynthesis.speak(utterance);
    });
  };

  const chat = async (userMessage) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios({
        method: "post",
        url: `${BACKEND_URL}/chat`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { message: userMessage },
      });
      console.log(response.data);
      

      const newMessages = response.data.messages;
      
      if (newMessages && newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
        
        // Speak the first message if it exists
        const firstMessage = newMessages[0];
        if (firstMessage?.text) {
          await speakMessage(firstMessage.text);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setError(error.response?.data?.message || "Failed to send message. Please try again.");
      
      // Add error message to messages with sad expression
      setMessages(prev => [...prev, {
        text: "I'm having trouble processing your request right now. Please try again.",
        facialExpression: "sad",
        animation: "HeadShake"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages(prevMessages => {
      if (prevMessages.length <= 1) {
        return [];
      }
      return prevMessages.slice(1);
    });
  };

  // Update current message whenever messages array changes
  useEffect(() => {
    setMessage(messages.length > 0 ? messages[0] : null);
  }, [messages]);

  // Stop speaking if component unmounts or error occurs
  useEffect(() => {
    if (error) {
      speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [error]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        message,
        messages,
        
        onMessagePlayed,
        loading,
        error,
        speaking,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;