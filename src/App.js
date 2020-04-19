import React, { useState } from 'react';
import './App.css';
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form";
import { authenticateClientside, searchItem } from "./integrations/spotify.js";

function App() {
  const [value, setValue] = useState([{
    text: ''
  }])
  const play = () => {
    console.log('play.  Attempting to connect to backend; you should see something print after this')
    fetch('/play').then(console.log);
  }

  const pause = () => {
    console.log("pause");
  }

  const handleSubmit = e => {
    e.preventDefault()
    searchItem(value)
  }

  const authenticate = () => {
    authenticateClientside();
  }

  return (
    <div className="App">
      <div className="App-header">
        <Button variant="primary" onClick={() => play()}>
          Play
        </Button>{" "}
        <Button variant="primary" onClick={() => pause()}>
          Pause
        </Button>{" "}
        <Form
          style={{ display: "inline-block" }}
          onSubmit={handleSubmit}
        >
          <FormControl
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            type="text"
            placeholder="Enter song name..."
            onChange={(e) => setValue(e.target.value)}
          />
        </Form>
        <Button
          type="submit"
          className="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>{" "}
      <Button variant="primary" onClick={authenticate}>Authenticate</Button>
      </div>
    </div>
  );
}

export default App;
