import React from 'react';
import './App.css';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button'

function App() {
  
  const play = () => {
    console.log("playing...")
  }

  const pause = () => {
    console.log("pause");
  }

  const search = () => {
    console.log("searching...")
  }

  return (
    <div className="App">
      <header className="App-header">
        <Button variant="primary" onClick={() => play()}>
          Play
        </Button>{" "}
        <Button variant="primary" onClick={() => pause()}>
          Pause
        </Button>{" "}
        <InputGroup className="mb-3" style={{ width: "50%" }}>
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">
              Search
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
        <Button type="submit" onClick={() => search()}>
          Submit
        </Button>{" "}
      </header>
    </div>
  );
}

export default App;
