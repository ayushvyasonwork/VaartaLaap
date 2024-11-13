import React from 'react'
import ChatItem from './ChatItem';
const GetChats = () => {
    const [chats, setChat] = useState([
        { name: "Om", lastMessage: "chat1", timeStamp: "today" },
        { name: "Jay", lastMessage: "chat2", timeStamp: "today" },
        {
          name:"Shiv",
          lastMessage:"chat4",
          timeStamp:"today"
        },
        {
          name:"Brahma",
          lastMessage:"chat5",
          timeStamp:"today"
        },
        {
          name:"vishnu",
          lastMessage:"chat6",
          timeStamp:"today"
        },
        {
          name:"Mahesh",
          lastMessage:"chat7",
          timeStamp:"today"
        },
        {
          name:"Shakti",
          lastMessage:"chat8",
          timeStamp:"today"
        },
        // Add other chats...
    ]);

  return (
    <div className={`getchats`}>
                {chats.map((chat, index) => (
                    <ChatItem key={index} props={chat} />
                ))}
    </div>
  )
}

export default GetChats
