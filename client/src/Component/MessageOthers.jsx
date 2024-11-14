import React from 'react'
import './myStyle.css'
import { useSelector } from 'react-redux';
const MessageOthers = ({message}) => {
    // var props1={name:"RandomUser",message:"This is a Smaple chat"}
    const lightTheme = useSelector((state) => state.themeKey);
    console.log(`message is ${message}`);
  return (
    <div className={`other-msg-container ${lightTheme ? "" : "dark"}`}>
        <div className={`chat-container1 ${lightTheme ? "" : "dark1"}`}>
            {/* <p className='chat-icon'>
                {props1.name[0]}
            </p> */}
            <div className='other-text-content1'>
                {/* <p className='chat-title'>{props1.name}</p> */}
                <p className='chat-lastMessage1'>{message}</p>
                {/* <p classname='chat-timeStamp'>12:00am</p> */}
            </div>

        </div>
      
    </div>
  )
}

export default MessageOthers
