import './App.css';
import React, { useEffect, useState } from 'react';
import { Router, Route, Routes } from 'react-router-dom';

const REACT_APP_GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

let map;

function initMap() {
  // Create a new map instance and set its center and zoom level
  map = new window.google.maps.Map(document.getElementById('map'), {
    center: { lat: 40.712776, lng: -74.005974 }, // New York City coordinates
    zoom: 8,
  });
}

window.initMap = initMap;

function loadScript(url, callback) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.async = true;
  script.defer = true;

  script.onload = callback;

  document.head.appendChild(script);
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const access_token = queryParams.get('access_token');
    const refresh_token = queryParams.get('refresh_token');
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }, []);

  useEffect(() => {
    let latitude;
    let longitude;

    const find_location = () => {
      const success = (position) => {
        const geolocationPosition = position.coords;
        console.log(geolocationPosition);

        latitude = geolocationPosition.latitude;
        longitude = geolocationPosition.longitude;
        const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

        fetch(geoApiUrl)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
        if (latitude && longitude) {
          map.setCenter(new window.google.maps.LatLng(latitude, longitude));
        }
      };

      const error = (error) => {
        console.log(error);
      };

      navigator.geolocation.getCurrentPosition(success, error);
    };

    if (localStorage.getItem('access_token') !== 'null') {
      console.log('Logged in');
      setLoggedIn(true);
      find_location();
    } else {
      console.log('Not logged in');
      setLoggedIn(false);
    }

    const script = document.createElement('script');

    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;

    document.body.appendChild(script);

    loadScript(scriptUrl, () => {
      console.log('Google Maps API script loaded');
    });

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className='App'>
      <p>Spotify Location App</p>
      {loggedIn ? (
        <>
          <p>Logged in</p>
          <div id='map'></div>
        </>
      ) : (
        <a href='http://localhost:3001/login'>
          <button>Login with Spotify</button>
        </a>
      )}
    </div>
  );
}

export default App;