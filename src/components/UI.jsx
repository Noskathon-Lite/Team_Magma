import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { useChat } from "../hooks/useChat";

export const UI = ({ hidden }) => {
  const input = useRef();
  const { chat, loading, messages, cameraZoomed, setCameraZoomed } = useChat();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && text) {
      setIsButtonDisabled(true); // Disable the button when sending
      chat(text);
      input.current.value = "";
      setTimeout(() => setIsButtonDisabled(false), 500); // Re-enable the button after a delay
    }
  };

  if (hidden) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-20 flex justify-between p-4 flex-col pointer-events-auto">
        <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg z-30">
          <h1 className="font-black text-xl">Dr. Magma</h1>
        </div>

        <div className="TextAreaContainer z-30">
          <div className="textArea bg-white backdrop-blur-md p-4 rounded-lg max-h-[50vh] overflow-auto">
            {/* Render Messages */}
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <p className={`font-medium ${msg.facialExpression === "sad" ? "text-red-500" : ""}`}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto z-30">
          <div className="w-full flex flex-row items-end justify-between gap-4 bottom-0">
            <button
              onClick={() => setCameraZoomed(!cameraZoomed)}
              className="pointer-events-auto bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-md"
            >
              {cameraZoomed ? "Zoom Out" : "Zoom In"}
            </button>
          </div>
          <input
            className="w-full placeholder:text-gray-800 placeholder:italic p-4 rounded-md bg-opacity-50 bg-white backdrop-blur-md"
            placeholder="Type a message..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            disabled={loading || isButtonDisabled}
            onClick={sendMessage}
            className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${
              loading || isButtonDisabled ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

UI.propTypes = {
  hidden: PropTypes.bool,
};
