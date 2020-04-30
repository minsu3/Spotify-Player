import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
import { getDevices, setDefaultDevice } from "../integrations/spotify.react.js";

const PlaybackDeviceSelector = () => {
  const [devices, setDevices] = useState([]);
  return (
    <Button variant="secondary">Select playback device</Button>
  );
}

export default PlaybackDeviceSelector;
