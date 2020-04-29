import React, { useState } from 'react';
import './App.css';
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button'
import PlayBackDeviceSelector from './components/PlaybackDeviceSelector.react.js'
import Form from "react-bootstrap/Form";
import { authenticateClientside, searchItem, pause } from "./integrations/spotify.js";

function List(props) {
  console.log('searchResults = ', props)

  return (
    <div className="list">
      {props.searchResults.map(result => <p className="render">
        {result.trackName}
      </p>)}
    </div>
  )
}

function App() {
  const [currentSearchQuery, setCurrentSearchQuery] = useState({
    text: ''
  })

  const [searchResults, setSearchResults] = useState([]);

  const play = () => {
    console.log('play.  Attempting to connect to backend; you should see something print after this')
    fetch('/play').then(console.log);
  }

  const handleSubmit = async e => {
    e.preventDefault()
    let searchResponse = await searchItem(currentSearchQuery)
    console.log(searchResponse)
    let itemsArray = searchResponse.tracks.items
    let testArray = [];
    for(let item of itemsArray) {
      let trackName = {
        "trackName": item.name
      }
      testArray.push(trackName)
    }
    setSearchResults(testArray)
    console.log('Track Name = ', testArray)
  }

  const authenticate = () => {
    authenticateClientside();
  }

  return (
    <div className="App">
      <div className="App-header">
      <h1 className="title">Spotify Player</h1>
        
        <Button variant="primary" onClick={() => play()}>
          Play
        </Button>{" "}
        <Button variant="primary" onClick={() => pause()}>
          Pause
        </Button>{" "}
        <Form
          style={{ display: "inline-block" }}
        >
          <FormControl
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            type="text"
            placeholder="Enter song name..."
            onChange={(e) => setCurrentSearchQuery(e.target.value)}
          />
        </Form>
        <Button
          type="submit"
          className="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>{" "}
        <Button variant="primary" onClick={authenticate} className="authenticate">Authenticate</Button>

        <List
          searchResults={searchResults}
          key={searchResults}
        />

      </div>
    </div>
  );
}

export default App;