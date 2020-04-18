import React from 'react';
import './App.css';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Button variant="primary">Play</Button>{" "}
        <Button variant="primary">Pause</Button>{" "}
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
        <Button type="submit">Submit</Button>{" "}
      </header>
    </div>
  );
}

export default App;
