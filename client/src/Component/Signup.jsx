import React from 'react'
import { Backdrop, Button, CircularProgress, TextField } from '@mui/material'
import logo from '../assets/vaartalaap.png'
const Signup = () => {
    const signupHandler=async()=>{
        setLoading(true);
        try{
            const config={
                header:{
                    "content-type":"application/json",
                },
            };
            const response=await axios.post(
                "http://localhost:5000/auth/signup/",
                data,
                config
            );
            console.log(response);
            setSignInStatus({msg:"Success",key:Math.random()});
            Navigate("/app/welcome");
            localStorage.setItem("userData",JSON.stringify(response));
            setLoading(false);
        }catch(e){
            console.log(e);
            if(e.response.status===405){
                setLogInStatus({
                    msg:"user with this email ID already exists" ,
                    Key:Math.random()
                });
            }
        }
        setLoading(false);
    };
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
            <img src={logo} alt="Logo" />
            </div>
            <div className='Login-box'>
                <p>
                    Signup to your Account  
                </p>
                <TextField id="Standard-basic"
                label="Enter User Name"
                variant="outlined">
                </TextField>
                <TextField id="Standard-basic"
                label="Enter email"
                variant="outlined">
                </TextField>
                <TextField
                id="outlined-password-input"
                label="Enter Password"
                type='password'
                autoComplete='current-password'
                ></TextField>
                <TextField
                id="outlined-password-input"
                label="confirm password Password"
                type='password'
                autoComplete='current-password'
                ></TextField>
                <Button variant='outlined'>Signup</Button>
            </div>
        </div>
        </>
      )
    
}

export default Signup
