import { Backdrop, Button, CircularProgress, TextField } from '@mui/material'
import React, { useState } from 'react'
import logo from '../assets/vaartalaap.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toaster from '../Features/Toaster';

const Login = () => {
  const [showlogin,setShowLogin]=useState(false);
  const [data,setData]=useState({name:"",email:"",password:""});
  const [data1,setData1]=useState({email:"",password:""});
  const [loading,setLoading]=useState(false);
  const [logInStatus,setLogInStatus]=useState("");
  const [signInStatus,setSignInStatus]=useState("");
  const Navigate=useNavigate();
  const changeHandler=(e)=>{
    setData({...data,[e.target.name]:e.target.value});
  };
  const changeHandlera=(e)=>{
    setData1({...data1,[e.target.name]:e.target.value});
  };
  const loginHandler=async (e)=>{
    setLoading(true);
    console.log(data1);
    try{
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };
      const response=await axios.post(
        "http://localhost:5000/api/v1/auth/login/",
        data1,
        config
      );
      console.log("Login : ",response );
      setLogInStatus({msg:"Success" , key:Math.random()});
      setLoading(false);
      localStorage.setItem("userData",JSON.stringify(response));
      localStorage.setItem("token",response.data.token);
      Navigate("/app/welcome");
    }catch(error){
      setLogInStatus({
        msg:"Invalid user name or Password",
        key:Math.random(),
      })
    }
    setLoading(false);
  }
  const signUpHandler=async ()=>{
    setLoading(true);
    try{
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };
      const response=await axios.post(
        "http://localhost:5000/api/v1/auth/signup",
        data,
        config
      );
      console.log(response);
      setSignInStatus({
        msg:"Success" , key:Math.random()});
      
      localStorage.setItem("userData",JSON.stringify(response));
      localStorage.setItem("token",response.data.data.token);
      setLoading(false);
      Navigate("/app/welcome");
      
    }catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 405) {
          setLogInStatus({
            msg: "User with this email Id already exists",
            key: Math.random(),
          });
        }
        if (error.response.status === 500) {
          setLogInStatus({
            msg: "Internal Server error ",
            key: Math.random(),
          });
        }
      }else {
        setLogInStatus({
          msg: "An unexpected error occurred. Please try again.",
          key: Math.random(),
        });
      }
      setLoading(false);
    }
    
  }
  return (
    <>
    <Backdrop
        sx={{color:"#fff" , zIndex:(theme)=>theme.zIndex.drawer + 1}}
        open={loading}
        >
            <CircularProgress color='secondary'/>
        </Backdrop>
    <div className='Login-container'>
      <div className='image-container'>
        <img src={logo} alt="Logo" className='welcome-logo' />
        </div>
        {showlogin && (
  <div className='Login-box'>
    <p>Login to your Account</p>
    <TextField 
      onChange={changeHandlera}
      id="standard-basic"
      label="Enter email"
      variant="outlined"
      name="email"
    />
    <TextField
      onChange={changeHandlera}
      id="outlined-password-input"
      label="Enter Password"
      type="password"
      autoComplete="current-password"
      name="password"
    />
    <Button
      variant="outlined"
      color="secondary"
      onClick={loginHandler}
    >
      Login
    </Button>
    <p>
      Don't have an Account?{" "}
      <span className='hyper' onClick={() => setShowLogin(false)}>
        Sign Up
      </span>
    </p>
    {logInStatus ? <Toaster key={logInStatus.key} message={logInStatus.msg} /> : null}
  </div>
)}

        {
          !showlogin && (
            <div className='Login-box'>
        <p className='login-text'>
          Create your Account
        </p>
        <TextField 
        onChange={changeHandler}
          id="standard-basic"
          label="Enter User Name"
          variant='outlined'
          color="secondary"
          name="name"
          helperText =""
        ></TextField>
        <TextField 
          onChange={changeHandler}
          id="standard-basic"
          label="Enter email Address"
          variant='outlined'
          color="secondary"
          name="email"
        ></TextField>
        <TextField
          onChange={changeHandler}
          id="outlined-password-input"
          label="Enter Password"
          type='password'
          autoComplete='current-password'
          color="secondary"
          name="password"
          ></TextField>
          <Button variant='outlined'
          color="secondary"
          onClick={signUpHandler}>sign up</Button>
          <p>
            Already have an account ?
            <span className='hyper'
            onClick={()=>{
              setShowLogin(true);
            }}
            >
              Log In
            </span>
          </p>
          {
            signInStatus ? (
              <Toaster key={signInStatus.key} message={signInStatus.msg}></Toaster>
            ):null}
        </div>
          )
        }
        
    </div></>
  )
}

export default Login
