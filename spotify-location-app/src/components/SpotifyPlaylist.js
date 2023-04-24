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
                                console.log("Enter key pressed");
                            }
                        }}
                        onChange={event => setSearchInput(event.target.value)}
                        />
                        <Button onClick={event => {console.log("Clicked Button")}}>
                            Search
                        </Button>

                </InputGroup>
            </Container>            
        </div>
    )
}
