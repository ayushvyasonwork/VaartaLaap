import React from 'react'

const Account = () => {
    const userData=JSON.parse(localStorage.getItem("userData"));
    console.log(`userData is ${userData}`)
    console.log(`Name: ${userData.data.data.name}`);
    console.log(`Email: ${userData.data.data.email}`);
  return (
    <div>
      <div>{userData.data.data.name}</div>
      <div>{userData.data.data.email}</div>
    </div>
  )
}

export default Account
