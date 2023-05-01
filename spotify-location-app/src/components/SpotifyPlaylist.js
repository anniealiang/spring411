import { Container, Row, Col, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';


export function SpotifyPlaylist({ setLoggedIn, searchInput }) {
  const [accessToken, setAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (searchInput) {
      // Get request using search to get the playlist
      var playlistParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
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

  return (
    <div className="Playlist">
      <Container style={{ marginRight: "30px", marginTop: "50px"}}>
        <Row className="row row-cols-3">
          {playlists.map((playlist, i) => {
            return (
              <Col key={i}>
                <Card style={{padding: "10px", marginBottom: "10px"}}>
                  <Card.Img variant="top" src={playlist.imageUrl} style={{ height: "250px", objectFit: "cover" }} />
                  <Card.Body>
                    <Card.Title>{playlist.name}</Card.Title>
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