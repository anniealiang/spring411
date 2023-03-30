import './App.css';
import React, { useEffect, useState } from 'react';
import {Router, Route, Routes, Switch} from 'react-router-dom';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const access_token = queryParams.get('access_token');
    const refresh_token = queryParams.get('refresh_token');
    //localStorage has access token and refresh token. Get them by just calling localStorage.getItem('access_token') and localStorage.getItem('refresh_token')
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== "null") {
      console.log("Logged in");
      setLoggedIn(true);
    } else {
      console.log("Not logged in");
      setLoggedIn(false);
    }
  }, []);


  return (
    <div className="App">
      <p>Spotify Location App</p>
      {loggedIn ? 
        <p>Logged in</p> 
      : 
        <a href="http://localhost:3001/login"><button>Login with Spotify</button></a>
      }
      {/* <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<HandleLogin />} />
      </Routes> */}
    </div>

  );
}

export default App;
