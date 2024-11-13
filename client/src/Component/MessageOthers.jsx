import React from 'react'
import './myStyle.css'
import { useSelector } from 'react-redux';
const MessageOthers = () => {
    var props1={name:"RandomUser",message:"This is a Smaple chat"}
    const lightTheme = useSelector((state) => state.themeKey);
  return (
    <div className={`other-msg-container ${lightTheme ? "" : "dark"}`}>
        <div className={`chat-container ${lightTheme ? "" : "dark1"}`}>
            <p className='chat-icon'>
                {props1.name[0]}
            </p>
            <div className='other-text-content'>
                <p className='chat-title'>{props1.name}</p>
                <p className='chat-lastMessage'>{props1.message}</p>
                <p classname='chat-timeStamp'>12:00am</p>
            </div>

        </div>
      
    </div>
  )
}

export default MessageOthers
