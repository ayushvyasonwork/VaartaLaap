import React, { useState } from 'react'
import './myStyle.css'
import SideBar from './SideBar'
import Welcome from './Welcome'
import ChatArea from './ChatArea'
import CreateGroup from './CreateGroup'
import Users_Groups from './Users_Groups'
import Groups from './Groups'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const mainContainer = () => {
  const lightTheme = useSelector((state) => state.themeKey);  
  return (
    <div className={`main-container ${lightTheme ? "" : "dark1"}`}>
      <SideBar></SideBar>
      {/* here outlet is used to render the component that is passed in main container through react router dom */}
      <Outlet/>
      {/* <ChatArea props={chatName[0]}></ChatArea> */}
      {/* <Welcome></Welcome> */}
      {/* <CreateGroup></CreateGroup> */}
      {/* <Users_Groups></Users_Groups> */}
      {/* <Groups></Groups> */}
      
    </div>
  )
}

export default mainContainer
