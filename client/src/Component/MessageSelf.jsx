import React from 'react';

const MessageSelf = ({ message }) => {
  // Log the message content to verify it's correctly received
  console.log(`Message content: ${message.content || message}`);

  return (
    <div className='self-message-container1'>
      <div className='messageBox1'>
        <p>{message.content || message}</p>
        {/* <p className='self-timestamp'>12:00am</p> */}
      </div>
    </div>
  );
}

export default MessageSelf;
