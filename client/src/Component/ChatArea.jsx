import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Skeleton } from '@mui/material';
import './myStyle.css'
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
const ChatArea = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const [loaded,setLoaded]=useState(false);
  const [messageContent,setMessageContent]=useState("");
  const dyParams=useParams();
  const [chat_id,chat_user]=dyParams._id.split("&");
  const [allMessages,setAllMessages]=useState([]);
  const [allMessageCopy,setAllMessageCopy]=useState([]);
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const sendMessage=async ()=>{
    var data=null;
    await axios.post("http://localhost:5000/api/v1/messages/sendmessage",{
      content:messageContent,
      chatId:chat_id,
    },config).then(({response})=>{
      data=response;
      console.log("Message Fired");
    });
  }
  useEffect(()=>{
    const fetchChats=async ()=>{
      axios.get("http:localhost:5000/api/v1/chats").them(({data})=>{
        setAllMessages(data);
        setLoaded(true);
        Socket.emit("join chat",chat_id);
      });
      setAllMessageCopy(allMessages);
    }
    fetchChats();
  },[refresh,chat_id,token,allMessages]);
  if(!loaded){
    return (
      <div
      style={{
        border:"20px",
        padding:"10px",
        width:"100%",
        display:"flex",
        flexDirection:"column",
        gap:"10px",
      }}
      >
        <Skeleton
        variant='rectangular'
        sx={{width:"100%",borderRadius:"10px"}}
        height={60}
        />
        <Skeleton
        variant='rectangular'
        sx={{width:"100%",borderRadius:"10px"}}
        height={60}
        />
        <Skeleton
        variant='rectangular'
        sx={{
          width:"100%",
          borderRadius:"10px",
          flexGrow:"1",
        }}
        />
        <Skeleton
        variant='rectangular'
        sx={{width:"100%",borderRadius:"10px"}}
        />
      </div>
    );
  }else{
    return (
      <div className={`chatarea-container ${lightTheme ? "" : "dark"}`}>
        <div className={`chatArea-header ${lightTheme ? "" : "dark1"}`}>
          <p className='chat-icon'>{chat_user[0]}</p>
          <div className='header-text'>
            <p className='chat-title'>{chat_user}</p>
            {/* <p className='chat-timestamp'>{props.timeStamp}</p> */}
          </div>
          <IconButton>  
            <DeleteIcon></DeleteIcon>
          </IconButton>
           </div>
        <div className={`msg-container ${lightTheme ? "" : "dark"}`}>
            {/* <MessageOthers></MessageOthers>
            <MessageSelf></MessageSelf>
            <MessageOthers></MessageOthers>
            <MessageSelf></MessageSelf>
            <MessageOthers></MessageOthers>
            <MessageSelf></MessageSelf> */}
            {
              allMessages.slice(0).reverse().map((message,index)=>{
                const sender=message.sender;
                const self_id=userData.data._id;
                if(sender._id===self_id){
                  return <MessageSelf props={message} key={index}/>;
                }
                else{
                  return <MessageOthers props={message} key={index}/>;
                }
              })} 
        </div>
        <div className={`textInput-area ${lightTheme ? "" : "dark"}`}>
          <input placeholder='Type a Message' className= {`search-box ${lightTheme ? "" : "dark"}`}
          value={messageContent}
          onChange={(e)=>{
            setMessageContent(e.target.value);
          }}
          onKeyDown={(event)=>{
            if(event.code=="Enter"){
              sendMessage();
              setMessageContent("");
              setRefresh(!refresh);
            }
          }}
          />
          <IconButton
          className={"icon" + (lightTheme ? "":"dark")}
          onClick={()=>{
            sendMessage();
            setRefresh(!refresh);
          }}
          ><SendIcon/></IconButton>
        </div>
      </div>
    )
  }  
  }
  
  // const [chatName,setChatName]=useState(
  //   [
  //     {
  //       name:"Om",
        
  //       timeStamp:"today"
  //     },
  //     {
  //       name:"Jay",
        
  //       timeStamp:"today"
  //     },
  //     {
  //       name:"Jagdish",
      
  //       timeStamp:"today"
  //     },
  //     {
  //       name:"Shiv",
 
  //       timeStamp:"today"
  //     },
  //     {
  //       name:"Brahma",
       
  //       timeStamp:"today"
  //     },
  //     {
  //       name:"vishnu",
        
  //       timeStamp:"today"
  //     },
  //     {
  //       name:"Mahesh",
     
  //       timeStamp:"today"
  //     },
  //     {
  //       name:"Shakti",
       
  //       timeStamp:"today"
  //     },
  //   ]
  // )
  // const props=chatName[0];
  
export default ChatArea
