import React from 'react'

const MessageSelf = () => {
    var props2={name:"You" , message:"this is sample msg"}
  return (
    <div className='self-message-container'>
      <div className='messageBox'>
        <p>{props2.message}</p>
        <p className='self-timestamp'>12:00am</p>
      </div>
    </div>
  )
}

export default MessageSelf
