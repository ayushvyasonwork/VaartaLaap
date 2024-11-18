import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/vaartalaap.png';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Users_Groups = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const lightTheme = useSelector((state) => state.themeKey);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`http://localhost:5000/api/v1/auth/userfind?search=${search}`, config);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [search]);

  // Function to handle user click and initiate or access a chat
  const handleUserClick = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`http://localhost:5000/api/v1/chats/${userId}`, {}, config);
      const chat = response.data.chat;

      // Redirect to the chat page for this user
      navigate(`/app/chat/${chat._id}`);
    } catch (error) {
      console.error("Error initiating chat:", error);
    }
  };

  return (
    <div className={`list-container ${lightTheme ? "" : "dark"}`}>
      <div className={`ug-header ${lightTheme ? "" : "dark1"}`}>
        <img src={logo} alt="Logo" style={{ height: "2rem", width: "10rem" }} />
        <p className='ug-title'>Online Users</p>
      </div>
      <div className={`sd-search ${lightTheme ? "" : "dark1"}`}>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <input
          placeholder='Search'
          className={`searchBar ${lightTheme ? "" : "dark1"}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className='ug-list'>
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className={`list-item ${lightTheme ? "" : "dark1"}`}
              onClick={() => handleUserClick(user._id)} // Call function on click
            >
              <p className='chat-icon'>{user.name[0].toUpperCase()}</p>
              <p className='chat-title'>{user.name}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default Users_Groups;
