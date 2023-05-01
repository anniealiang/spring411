import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Spotify } from './spotify.js';

export const CLIENT_ID = "6e77b58363da431b9a4092804a4b9175";
export const CLIENT_SECRET = "be00970e2f354242be8316cb93959372";


export function SpotifyPlaylist({ setLoggedIn, searchInput }) {
  const [accessToken, setAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))

  }, [])

  useEffect(() => {
    if (accessToken && searchInput) {
      // Get request using search to get the playlist
      var playlistParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      };
      var playlistSearchURL = 'https://api.spotify.com/v1/search?q=' + searchInput + '&type=playlist';
      fetch(playlistSearchURL, playlistParameters)
        .then(response => response.json())
        .then(data => {
          var playlists = data.playlists.items.map(playlist => {
            return {
              name: playlist.name,
              id: playlist.id,
              imageUrl: playlist.images[0].url // get the first image
            };
          });
          setPlaylists(playlists);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [accessToken, searchInput])

  function playPlaylist(playlistId) {
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const trackIds = data.tracks.items.map(track => track.track.id);
        const uri = `spotify:track:${trackIds.join(',')}`;
        const spotifyPlayer = new Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => { cb(accessToken); },
          volume: 0.5
        });
        spotifyPlayer.connect().then(() => {
          return spotifyPlayer.resume();
        }).then(() => {
          return spotifyPlayer.queue(uri);
        }).then(() => {
          return spotifyPlayer.getCurrentState();
        }).then(state => {
          console.log(state);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  return (
    <div className="Playlist">
      <Container>
        <Row className="row row-cols-3">
          {playlists.map((playlist, i) => {
            return (
              <Col key={i}>
                <Card>
                  <Card.Img variant="top" src={playlist.imageUrl} style={{ height: "250px", objectFit: "cover" }} />
                  <Card.Body>
                    <Card.Title>{playlist.name}</Card.Title>
                    <button onClick={() => playPlaylist(playlist.id)}>Play Playlist</button>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </Container>
    </div>
  )
}
