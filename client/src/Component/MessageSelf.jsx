import React from 'react';

const MessageSelf = ({ message }) => {
  // Log the message content to verify it's correctly received
  console.log(`Message content: ${message.content || message}`);

  // Function to check if the message needs breaking based on length or word count
  const shouldBreakMessage = (message) => {
    const wordCount = message.split(' ').length;
    const charCount = message.length;
    return wordCount > 2 || charCount > 13;
  };

  // Apply class to break message if needed
  const messageClass = shouldBreakMessage(message.content || message)
    ? 'breakable-message'
    : 'normal-message';

  return (
    <div className='self-message-container1'>
      <div className='messageBox1'>
        <p className={messageClass}>{message.content || message}</p>
        {/* <p className='self-timestamp'>12:00am</p> */}
      </div>
    </div>
  );
};

export default MessageSelf;
