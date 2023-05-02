import './App.css';
import React, { useEffect, useState } from 'react';
import { addToUser } from './services/addUser';
import { SpotifyPlaylist } from './components/SpotifyPlaylist.js';


const REACT_APP_GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;



let map;

function initMap() {
  // Get user's current location
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Create a new map instance and center it on the user's location
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: latitude, lng: longitude },
      zoom: 8,
    });
  }, () => {
    // If there's an error, center the map on a default location
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 40.712776, lng: -74.005974 }, // New York City coordinates
      zoom: 8,
    });
  });
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

function LocationDisplay({ city }) {
  return (
    <div className="LocationDisplay">
      <h2>Your Current Location: {city}</h2>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [city, setCity] = useState("");

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
        if (data !== undefined) {
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
          setCity(data.city);
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
  }, [setLoggedIn]);


  function handleLogout() {
    // Remove access token and refresh token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Revoke access token from Spotify API
    const accessToken = localStorage.getItem('access_token');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };
    fetch('https://accounts.spotify.com/api/token/revoke', requestOptions)
      .then(() => {
        console.log('Access token revoked');
      })
      .catch((error) => {
        console.error('Error revoking access token:', error);
      });
  
    // Set loggedIn state to false
    setLoggedIn(false);
  }
  
  
  return (
    <>
      <div className="App">
        <h1>Spotify Location App</h1>
        <hr />
        {loggedIn ? (
          <>
            <p className="loggedIn">Logged In</p>
            <button onClick={handleLogout}>Logout</button>
            <hr />
          </>
        ) : (
          <p className="loggedIn">Not Logged In</p>
        )}
          {loggedIn ? (
            <>
              <LocationDisplay city={city} />
              <div
                id="map"
                style={{
                  width: "80%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "50px",
                  height: "650px",
                }}
              ></div>{" "}
               <hr />
               <SpotifyPlaylist searchInput={city} setLoggedIn={setLoggedIn} />
            </>
          ) : (
            <a href="http://localhost:3001/login" className="login-button">
              <button>Login with Spotify</button>
            </a>
          )}
      </div>
    </>
  );
          }

  export default App;