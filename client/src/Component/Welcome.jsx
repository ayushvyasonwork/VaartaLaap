import React from 'react'
import logo from '../assets/vaartalaap.png'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Welcome = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData=JSON.parse(localStorage.getItem("userData"))
  console.log(userData);
  const nav=useNavigate();
  if(!userData){
    console.log("user not authenticated ");
    nav("/");
  }
  return (
    <div className={`welcome-container ${lightTheme ? "" : "dark1"}`}>
      <img src={logo} alt="Logo" className='welcome-logo'/>
      <p>
        Hi , {userData.data.data.name}
      </p>
      <p>view and text directly to people present in chat rooms</p> 
    </div>
  )
}

export default Welcome
