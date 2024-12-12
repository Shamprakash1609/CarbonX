import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chatbox.css";
import minerIcon from "../../../../assets/images/miner.png";
import chatboxIcon from "../../../../assets/images/chatbox-icon.svg";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [messages, setMessages] = useState([]); 
  const [userMessage, setUserMessage] = useState(""); 

  // Toggle the chatbox open or closed
  const toggleChatbox = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Function to send a message
  const handleSendMessage = () => {
    const trimmedMessage = userMessage.trim();
    if (trimmedMessage === "") return; 

    // Display the user's message immediately
    const userMsg = { name: "User", message: trimmedMessage };
    setMessages((prevMessages) => [...prevMessages, userMsg]);
    setUserMessage(""); // Clear the input field

    // Call the API to get the bot's response
    axios
      .post(
        "http://localhost:5002/carbonx/v1/gemini",
        { question: trimmedMessage },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      .then((response) => {
        // Display the bot's response
        const botMsg = {
          name: "Sam",
          message: response.data.answer || "Sorry, I couldn't process that."
        };
        setMessages((prevMessages) => [...prevMessages, botMsg]);
      })
      .catch((error) => {
        console.error("Error:", error);

        // Display an error message from the bot
        const errorMsg = {
          name: "Sam",
          message: "Sorry, something went wrong. Please try again later."
        };
        setMessages((prevMessages) => [...prevMessages, errorMsg]);
      });
  };

  // Handle the Enter key for sending messages
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  // Auto-scroll to the bottom of the chatbox when new messages are added
  useEffect(() => {
        const chatbox = document.querySelector(".chatbox__messages");
        if (chatbox) {
            chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the latest message
        }
    }, [messages]); // Trigger whenever messages are updated


  return (
    <div className="chatbox">
      {isChatOpen && (
        <div className="chatbox__support chatbox--active">
          <div className="chatbox__header">
            <div className="chatbox__image--header">
              <img src={minerIcon} alt="Chatbot Avatar" height="60px" />
            </div>
            <div className="chatbox__content--header">
              <h4 className="chatbox__heading--header">Chat Support</h4>
              <p className="chatbox__description--header">
                Hello! How can I assist you today?
              </p>
            </div>
          </div>
          <div className="chatbox__messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`messages__item ${
                  message.name === "Sam"
                    ? "messages__item--visitor"
                    : "messages__item--operator"
                }`}
              >
                {message.message}
              </div>
            ))}
          </div>
          <div className="chatbox__footer">
            <input
              type="text"
              placeholder="Write a message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyUp={handleKeyPress}
            />
            <button
              className="chatbox__send--footer send__button"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
      <div className="chatbox__button">
        <button onClick={toggleChatbox}>
          <img src={chatboxIcon} alt="Chat Icon" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
