import React, { useContext, useEffect, useState } from 'react';
import './myStyle.css';
import ChatItem from './ChatItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toggleTheme } from '../Features/themeSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// const SideBar = () => {
//     // const [chats, setChat] = useState([
//     //     { name: "Om", lastMessage: "chat1", timeStamp: "today" },
//     //     { name: "Jay", lastMessage: "chat2", timeStamp: "today" },
//     //     { name:"Shiv", lastMessage:"chat4", timeStamp:"today" },
//     //     { name:"Brahma", lastMessage:"chat5", timeStamp:"today" },
//     //     { name:"vishnu", lastMessage:"chat6", timeStamp:"today" },
//     //     { name:"Mahesh", lastMessage:"chat7", timeStamp:"today" },
//     //     { name:"Shakti", lastMessage:"chat8", timeStamp:"today" }
//     // ]);

//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchResults, setSearchResults] = useState([]);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [conversations,setConversations]=useState([]);
//     const lightTheme = useSelector((state) => state.themeKey);
//     // const userData=JSON.parse(localStorage.getItem("userData"));
//     // console.log(`userData is ${userData}`);
//     // console.log(`userData.data is ${userData.data}`);
    
//     const token = localStorage.getItem("token");
//     console.log(`token in sidebar is ${token}`)
//     useEffect(async ()=>{
//         const config={
//             headers:{
//                 Authorization:`Bearer ${token}`,
//             },};
        
//         await axios.get("http://localhost:5000/api/v1/chats",config).then((response)=>{
//             console.log(`response.data.results is ${response.data.results}`)
//             setConversations(response.data.results);
//         });
//         console.log(`conversations are ${conversations[0]?.chatname}`)
//     });
//     return (
//         <div className='sidebar-container'>
//             <div className={`sd-header ${lightTheme ? "" : "dark"}`}>
//                 <IconButton>
//                     <AccountCircleIcon onClick={() => navigate("account")} />
//                 </IconButton>
//                 <IconButton onClick={() => navigate("users-groups")}>
//                     <PersonAddIcon />
//                 </IconButton>
//                 <IconButton onClick={() => navigate("groups")}>
//                     <GroupAddIcon />
//                 </IconButton>
//                 <IconButton onClick={() => navigate("create-group")}>
//                     <AddCircleIcon />
//                 </IconButton>
//                 <IconButton onClick={() => dispatch(toggleTheme())}>
//                     {lightTheme ? <NightlightIcon /> : <LightModeIcon />}
//                 </IconButton>
//             </div>
//             <div className={`sd-search ${lightTheme ? "" : "dark"}`}>
//                 <IconButton><SearchIcon /></IconButton>
//                 <input
//                     placeholder='Search'
//                     className={`searchBar ${lightTheme ? "" : "dark"}`}
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//             </div>
            
// <div className={`sd-chats ${lightTheme ? "" : "dark1"}`}>
//                 {/* {(searchResults.length > 0 ? searchResults : chats).map((chat, index) => (
//                     <ChatItem key={index} props={chat} />
//                 ))} */}
//                 {
//                     conversations.map((conversation,index)=>{
//                         var chatName="";
//                         if(conversation.isGroupChat){
//                             chatName=conversation.chatname;
//                         }
//                         else{
//                             conversation.users.map((user)=>{
//                                 if(user._id!=userData.data._id){
//                                     chatName=user.name;
//                                 }
//                             })
//                         }
//                         if(conversation.latestMessage===undefined){
//                             return (
//                                 <div
//                                 key={index}
//                                 className={`chat-container ${lightTheme ? "" : "dark"}`} onClick={()=>{
//                                     navigate("chat/"+conversation._id + "&" +chatName);
//                                   }}
//                                 >
//                                     <p className={`chat-icon ${lightTheme ? "" : "dark"}`}>{chatName[0]}</p>
//                                     <p className={`chat-title ${lightTheme ? "" : "dark"}`}>{chatName}</p>
//                                     <p className={`chat-lastMessage ${lightTheme ? "" : "dark"}`}>click here to start new conversation </p> 
//                                     {/* <p className={`chat-lastMessage ${lightTheme ? "" : "dark"}`}>{props.lastMessage}</p> */}
//                                     {/* <p className={`chat-timeStamp ${lightTheme ? "" : "dark"}`}>{props.timeStamp}</p> */}
                                    

//                                 </div>
//                             )
//                         }
//                         else{
//                             return (
//                                 <div
//                                 key={index}
//                                 className={`chat-container ${lightTheme ? "" : "dark"}`} onClick={()=>{
//                                     navigate("chat/"+conversation._id + "&" +chatName);
//                                   }}
//                                 >
//                                     <p className={`chat-icon ${lightTheme ? "" : "dark"}`}>{chatName[0]}</p>
//                                     <p className={`chat-title ${lightTheme ? "" : "dark"}`}>{chatName}</p>
//                                     <p className={`chat-lastMessage ${lightTheme ? "" : "dark"}`}>{
//                                         conversation.latestMessage.content}</p> 

//                                 </div>
//                             )
//                         }
//                     })
//                 }
//             </div>
             
//         </div>
//     );
// };
const SideBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const lightTheme = useSelector((state) => state.themeKey);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get("http://localhost:5000/api/v1/chats", config);
                setConversations(response.data.results);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        };
        fetchChats();
    }, [token]);

    return (
        <div className='sidebar-container'>
            <div className={`sd-header ${lightTheme ? "" : "dark"}`}>
                <IconButton onClick={() => navigate("account")}>
                    <AccountCircleIcon />
                </IconButton>
                <IconButton onClick={() => navigate("users-groups")}>
                    <PersonAddIcon />
                </IconButton>
                <IconButton onClick={() => navigate("groups")}>
                    <GroupAddIcon />
                </IconButton>
                <IconButton onClick={() => navigate("create-group")}>
                    <AddCircleIcon />
                </IconButton>
                <IconButton onClick={() => dispatch(toggleTheme())}>
                    {lightTheme ? <NightlightIcon /> : <LightModeIcon />}
                </IconButton>
            </div>
            <div className={`sd-search ${lightTheme ? "" : "dark"}`}>
                <IconButton><SearchIcon /></IconButton>
                <input
                    placeholder='Search'
                    className={`searchBar ${lightTheme ? "" : "dark"}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className={`sd-chats ${lightTheme ? "" : "dark1"}`}>
                {conversations.map((conversation, index) => {
                    let chatName = conversation.isGroupChat
                        ? conversation.chatname
                        : conversation.users.find(user => user.email !== "try.ayushvyas17@gmail.com")?.name;

                    return (
                        <div
                            key={index}
                            className={`chat-container ${lightTheme ? "" : "dark"}`}
                            onClick={() => navigate(`chat/${conversation._id}&${chatName}`)}
                        >
                            <p className={`chat-icon ${lightTheme ? "" : "dark"}`}>{chatName?.[0]}</p>
                            <p className={`chat-title ${lightTheme ? "" : "dark"}`}>{chatName}</p>
                            <p className={`chat-lastMessage ${lightTheme ? "" : "dark"}`}>
                                {conversation.latestMessage?.content || "Click here to start a new conversation"}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default SideBar;
