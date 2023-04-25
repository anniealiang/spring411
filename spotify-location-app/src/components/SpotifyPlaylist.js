import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';



export function SpotifyPlaylist() {
    const [searchInput, setSearchInput] = useState("");

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
                                console.log("Pressed Key");
                            }
                        }}
                        onChange={event => setSearchInput(event.target.value)}
                        />
                        <Button onClick={event => {console.log("Clicked Button")}}>
                            Search
                        </Button>
                </InputGroup>
            </Container>   
            <Container>
                    <Card>
                        <Card.Img src="#"/>
                        <Card.Body> 
                            <Card.Title> Album Name Here </Card.Title>

                        </Card.Body>
                    </Card>
            </Container>

        </div>
    )

}
