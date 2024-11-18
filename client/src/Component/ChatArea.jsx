import React, { useEffect, useState } from "react";
import { io } from "socket.io-client"; // Import Socket.IO client
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Skeleton } from "@mui/material";
import "./myStyle.css";
import MessageOthers from "./MessageOthers";
import MessageSelf from "./MessageSelf";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChatArea = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const [loaded, setLoaded] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const token = localStorage.getItem("token");
  const { _id } = useParams();
  const [chat_id, chat_user] = _id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const self_id = userData.data.data._id;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Initialize socket instance
  const socket = React.useRef();

  useEffect(() => {
    // Connect to Socket.IO server
    socket.current = io("http://localhost:5000", {
      query: { token }, // Pass token as query parameter
    });

    // Join the chat room
    socket.current.emit("joinChat", chat_id);

    // Listen for new messages
    socket.current.on("messageReceived", (newMessage) => {
      console.log("New message received:", newMessage);
      setAllMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    // Cleanup on component unmount
    return () => {
      socket.current.disconnect();
    };
  }, [chat_id, token]);

  const sendMessage = async () => {
    if (!messageContent.trim()) return; // Prevent sending empty messages

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/messages/sendmessage",
        { content: messageContent, chatId: chat_id },
        config
      );
      console.log("Message sent:", response.data);

      // Emit message to the server via Socket.IO
      socket.current.emit("sendMessage", {
        content: messageContent,
        chatId: chat_id,
        sender: self_id,
      });

      setMessageContent(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/messages/${chat_id}`,
          config
        );
        setAllMessages(response.data.messages || []);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [chat_id, token]);

  if (!loaded) {
    return (
      <div
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px", flexGrow: "1" }}
        />
      </div>
    );
  } else {
    return (
      <div className={`chatarea-container ${lightTheme ? "" : "dark"}`}>
        <div className={`chatArea-header ${lightTheme ? "" : "dark1"}`}>
          <p className="chat-icon">{chat_user[0]}</p>
          <div className="header-text">
            <p className="chat-title">{chat_user}</p>
          </div>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </div>

        <div className={`msg-container ${lightTheme ? "" : "dark"}`}>
          {allMessages.slice(0).map((message, index) => {
            const sender = message.sender;
            return sender._id === self_id ? (
              <MessageSelf message={message.content} key={index} />
            ) : (
              <MessageOthers message={message.content} key={index} />
            );
          })}
        </div>
        <div className={`textInput-area ${lightTheme ? "" : "dark"}`}>
          <input
            placeholder="Type a Message"
            className={`search-box ${lightTheme ? "" : "dark"}`}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                sendMessage();
              }
            }}
          />
          <IconButton
            className={"icon" + (lightTheme ? "" : "dark")}
            onClick={sendMessage}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
};

export default ChatArea;
                                                                                    