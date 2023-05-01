import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';

export const CLIENT_ID = "6e77b58363da431b9a4092804a4b9175";
export const CLIENT_SECRET = "be00970e2f354242be8316cb93959372";


export function SpotifyPlaylist() {
    const [searchInput, setSearchInput] = useState("");
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

    //Search 
    async function search() {
      console.log("Search for " + searchInput);
      
      // Get request using search to get the playlist

      var playlistParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
        };
        
        var playlistSearchURL = 'https://api.spotify.com/v1/search?q=' + searchInput + '&type=playlist';
        
        var playlistParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        };

        fetch(playlistSearchURL, playlistParameters)
            .then(response => response.json())
            .then(data => {
                var playlists = data.playlists.items.map(playlist => {
                    return {
                        name: playlist.name,
                        id: playlist.id
                    };
                });
                setPlaylists(playlists);
                console.log('Found ' + playlists.length + ' playlists:');
                for (var i = 0; i < playlists.length; i++) {
                    console.log(playlists[i].name + ' (ID: ' + playlists[i].id + ')');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    
      // Get request using Artist ID grab all the albums from that artist
            

      // Display those albums to the user
    }


    return (
        <div className="Playlist"> 
        <Container>
                <InputGroup className="mb-3" size="lg">
                    <FormControl
                        placeholder="Playlist Name"
                        type="input"
                        onKeyPress={event => {
                            if (event.key === 'Enter') {
                                // this.props.onSearch(this.state.term);
                                search();
                            }
                        }}
                        onChange={event => setSearchInput(event.target.value)}
                        />
                        <Button onClick={search}>
                            Search
                        </Button>
                </InputGroup>
            </Container>   

            <Container>
                <Row className="mx-2 row row-cols-3"> 
                {playlists.map((playlist, i) => {
                    console.log(playlist);
                    return (
                        <Card>
                            <Card.Img src="#"/>
                            <Card.Body> 
                                <Card.Title>{playlist.name}</Card.Title>
                            </Card.Body>
                        </Card>

                        )
                    })}
                  
                </Row>
            </Container>

        </div>
    )

}

