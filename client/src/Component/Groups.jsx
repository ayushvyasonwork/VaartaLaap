import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../assets/vaartalaap.png';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const lightTheme = useSelector((state) => state.themeKey);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/chats/fetchgroups`, config);
        console.log(response.data.fetchedGroups);
        setUsers(response.data.fetchedGroups);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  console.log(`user length is ${users.length}`);

  return (
    <div className={`list-container ${lightTheme ? "" : "dark"}`}>
      <div className={`ug-header ${lightTheme ? "" : "dark1"}`}>
        <img src={logo} alt="Logo" style={{ height: "2rem", width: "10rem" }} />
        <p className="ug-title">Available Groups</p>
      </div>
      <div className="ug-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className={`list-item ${lightTheme ? "" : "dark1"}`}
              onClick={async () => {
                try {
                  await axios.put(
                    "http://localhost:5000/api/v1/chats/addselfingroup",
                    { groupId: user._id },
                    config
                  );
                  console.log("Joined the group");
                } catch (error) {
                  console.error("Error joining the group:", error);
                }
              }}
            >
              <p className="chat-icon">{user.chatname[0].toUpperCase()}</p>
              <p className="chat-title">{user.chatname}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default Groups;
