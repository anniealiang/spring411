import './App.css';
import React, { useEffect, useState } from 'react';
import {Router, Route, Routes, Switch} from 'react-router-dom';
import { addToUser, getUser } from './services/addUser';

const REACT_APP_GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

let map;

function initMap() {
  // Create a new map instance and set its center and zoom level
  var map = new window.google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.712776, lng: -74.005974 }, // New York City coordinates
    zoom: 8,
  });
window.onload = function() {
  initMap();
};
}

window.initMap = initMap;

function loadScript(url, callback) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.async = true;
  script.defer = true;

  script.onload = callback;

  document.head.appendChild(script);
}


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      const accessToken = localStorage.getItem('access_token');
      const fetchData = async () => {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        const fetchedUser = await getUser(data.id);
        if (data !== undefined && fetchedUser === undefined) {
          addToUser(data.id, data.email, data.display_name);
        }
      };
      fetchData();
    }
    
  }, [loggedIn]);

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

  useEffect(() => {
    const find_location = () => {
      const success = (position) => {
        const geolocationPosition = position.coords;
        console.log(geolocationPosition);

        const latitude = geolocationPosition.latitude
        const longitude = geolocationPosition.longitude

        const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

        fetch(geoApiUrl)
        .then(res => res.json())
        .then(data => {
          console.log(data)
        })
      }
      
      const error = (error) => {
        console.log(error);
      }
    
      navigator.geolocation.getCurrentPosition(success, error);
    }
  
    if (localStorage.getItem('access_token') !== "null") {
      console.log("Logged in");
      setLoggedIn(true);
      find_location();
    } else {
      console.log("Not logged in");
      setLoggedIn(false);
    }

    const script = document.createElement("script");

    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;

    document.body.appendChild(script);

    loadScript(scriptUrl, () => {
      console.log("Google Maps API script loaded");
    });

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  return (
    <div className="App">
      <p>Spotify Location App</p>
      {loggedIn ? 
        <><p>Logged in</p><div id="map" style={{width: "50%", marginLeft: "40px", marginTop: "50px", height: "650px"}}></div></> 
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