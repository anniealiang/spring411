import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';

export const CLIENT_ID = "6e77b58363da431b9a4092804a4b9175";
export const CLIENT_SECRET = "be00970e2f354242be8316cb93959372";


export function SpotifyPlaylist() {
    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("");

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
      
      // Get request using searcg to get the Artist ID

        var artistParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
        }
    }
        var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistParameters)
            .then(response => response.json())
            .then(data => console.log(data))
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
                    <Card>
                        <Card.Img src="#"/>
                        <Card.Body> 
                            <Card.Title> Album Name Here </Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Img src="#"/>
                        <Card.Body> 
                            <Card.Title> Album Name Here </Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Img src="#"/>
                        <Card.Body> 
                            <Card.Title> Album Name Here </Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Img src="#"/>
                        <Card.Body> 
                            <Card.Title> Album Name Here </Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Img src="#"/>
                        <Card.Body> 
                            <Card.Title> Album Name Here </Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Img src="#"/>
                        <Card.Body> 
                            <Card.Title> Album Name Here </Card.Title>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>

        </div>
    )

}
