import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Skeleton } from '@mui/material';
import './myStyle.css';
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatArea = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const [loaded, setLoaded] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const token = localStorage.getItem("token");
  const { _id } = useParams();
  const [chat_id, chat_user] = _id.split("&");
  console.log(`all messagees are ${allMessages}`)

  console.log(`params is ${_id} and chatid is ${chat_id} and chat user is ${chat_user}`);

  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const self_id = userData.data.data._id;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const sendMessage = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/messages/sendmessage",
        { content: messageContent, chatId: chat_id },
        config
      );
      console.log("Message sent");
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/messages/${chat_id}`, config);
        console.log(`response is ${response.data.messages}`)
        setAllMessages(response.data.messages || []);
        console.log(`all messagees are ${allMessages}`)
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [chat_id, token]);

  if (!loaded) {
    return (
      <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Skeleton variant='rectangular' sx={{ width: "100%", borderRadius: "10px" }} height={60} />
        <Skeleton variant='rectangular' sx={{ width: "100%", borderRadius: "10px" }} height={60} />
        <Skeleton variant='rectangular' sx={{ width: "100%", borderRadius: "10px", flexGrow: "1" }} />
      </div>
    );
  } else {
    return (
      <div className={`chatarea-container ${lightTheme ? "" : "dark"}`}>
        <div className={`chatArea-header ${lightTheme ? "" : "dark1"}`}>
          <p className='chat-icon'>{chat_user[0]}</p>
          <div className='header-text'>
            <p className='chat-title'>{chat_user}</p>
          </div>
          <IconButton>
            <DeleteIcon/>
          </IconButton>
        </div>
        
        <div className={`msg-container ${lightTheme ? "" : "dark"}`}>
          {allMessages.slice(0).reverse().map((message, index) => {
            const sender = message.sender;
            console.log(`Sender ID: ${sender._id}`);
            console.log(`Self ID: ${self_id}`);
            return sender._id === self_id ? (
              <MessageSelf message={message.content} key={index} />
            ) : (
              <MessageOthers message={message.content}  key={index} />
            );
          })}
        </div>
        <div className={`textInput-area ${lightTheme ? "" : "dark"}`}>
          <input
            placeholder='Type a Message'
            className={`search-box ${lightTheme ? "" : "dark"}`}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                sendMessage();
              }
            }}
          />
          <IconButton className={"icon" + (lightTheme ? "" : "dark")} onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
};
export default ChatArea;
