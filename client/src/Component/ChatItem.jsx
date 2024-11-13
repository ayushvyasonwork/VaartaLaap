import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

const ChatItem = ({props}) => {
  const navigate=useNavigate();
  const lightTheme = useSelector((state) => state.themeKey);
  return (
    <div className={`chat-container ${lightTheme ? "" : "dark"}`} onClick={()=>{
      navigate("chat")
    }}>
      <p className={`chat-icon ${lightTheme ? "" : "dark"}`}>{props.name[0]}</p>
      <p className={`chat-title ${lightTheme ? "" : "dark"}`}>{props.name}</p>
      <p className={`chat-lastMessage ${lightTheme ? "" : "dark"}`}>{props.lastMessage}</p>
      <p className={`chat-timeStamp ${lightTheme ? "" : "dark"}`}>{props.timeStamp}</p>
    </div>
  )
}

export default ChatItem
