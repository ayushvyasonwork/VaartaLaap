import { useState } from 'react'
import './App.css'
import Login from './Component/Login'
import { Route,Routes} from 'react-router-dom'
import SideBar from './Component/SideBar'
import Welcome from './Component/Welcome'
import ChatArea from './Component/ChatArea'
import CreateGroup from './Component/CreateGroup'
import Users_Groups from './Component/Users_Groups'

import MainContainer from './Component/MainContainer'
import Groups from './Component/Groups'
import { useSelector } from 'react-redux'
import Signup from './Component/Signup'
import Account from './Component/Account'
function App() {
  const lightTheme = useSelector((state) => state.themeKey); 
  return (
    <div className={`App ${lightTheme ? "" : "dark"}`}>
    {/* <MainContainer></MainContainer> */}
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/signup" element={<Signup></Signup>}></Route>
      <Route path="app" element={<MainContainer/>}>
        <Route path="welcome" element={<Welcome/>}></Route>
        <Route path="chat/:_id" element={<ChatArea/>}></Route>
        <Route path="account" element={<Account/>}></Route>
        <Route path="create-group" element={<CreateGroup/>}></Route>
        <Route path="users-groups" element={<Users_Groups/>}></Route> 
        <Route path="groups" element={<Groups></Groups>}></Route>
      </Route>
    </Routes>
    </div>
  )
}
export default App
