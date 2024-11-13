import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from '@mui/material';
import React, { useState } from 'react';
import DoneOutlineRoundedIcon from '@mui/icons-material/DoneOutlineRounded';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateGroup = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const token = localStorage.getItem("token");
  const nav = useNavigate();

  if (!token) {
    console.log("user not authenticated ");
    nav(-1);
  }

  const [groupName, setGroupName] = useState("");
  const [userEmails, setUserEmails] = useState(""); // For emails, comma-separated
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (groupName.trim() === "" || userEmails.trim() === "") {
      alert("Please enter a group name and user emails");
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createGroup = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Convert comma-separated emails to a JSON string array
    const usersArray = userEmails.split(',').map(email => email.trim());
    
    try {
      const response = await axios.post("http://localhost:5000/api/v1/chats/creategroup", {
        name: groupName,
        users: JSON.stringify(usersArray)
      }, config);
      console.log(response);
      nav("/app/groups");
    } catch (error) {
      console.log("error occurred in create group ", error);
    }
  };

  return (
    <div className={`createGroups-container ${lightTheme ? "" : "dark"}`}>
      <TextField
        placeholder='Enter Group Name'
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className={`search-box ${lightTheme ? "" : "dark"}`}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        placeholder='Enter User Emails (comma-separated)'
        value={userEmails}
        onChange={(e) => setUserEmails(e.target.value)}
        className={`search-box ${lightTheme ? "" : "dark"}`}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <IconButton onClick={handleClickOpen}>
        <DoneOutlineRoundedIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to create a group named " + groupName + "?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will create a group where you will be the admin, and other members will be able to join this group.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              createGroup();
              handleClose();
            }}
            color="primary"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateGroup;
