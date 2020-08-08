// From spotify developer dashboard
const clientId = 'c684509b8e09406c8b08e1c6e9110d94';
const CLIENT_SECRET_ENV_VARIABLE_NAME = 'CHIHUAHUA_SPOTIFY_SECRET';
const clientSecret = process.env[CLIENT_SECRET_ENV_VARIABLE_NAME];

const parsedHash = new URLSearchParams(
  window.location.hash.substr(1) // skip the first char (#)
);
const accessToken = parsedHash.get('access_token');

let defaultDeviceId = null;

if (clientSecret == null) {
  console.warn(
    `Spotify client secret was not found; please set it in your environment
    variables to use Spotify integration.  Until then, serverside attempts to
    communicate with Spotify will just log to the console :)`
  );
}

if (accessToken == null) {
  console.warn(
    `No clientside access token found.  Try authenticating again.  Without this
    access token, clientside attempts to communicate with Spotify will fail.`
  )
}

// Use Spotify's Implicit Grant Flow to authorize without secret keys.  We can
// run this function directly in the browser, no backend required
const authenticateClientside = async () => {
  const scope = 'user-read-playback-state user-modify-playback-state';
  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=http:%2F%2Flocalhost:3000&scope=${encodeURI(scope)}&response_type=token`;
  window.location.href = url;
  return null;
}

// Spotify-specific wrapper around fetch.  Auto-injects the access token if it
// exists, otherwise takes them to auth
const spotifetch = async (url, options) => {
  if (accessToken == null) {
    console.warn("No clientside access token.  Redirecting to authentication page...");
    return authenticateClientside();
  }
  const tokenHeader = {
    'Authorization': 'Bearer ' + accessToken,
  };
  if (options == null) {
    options = {headers: tokenHeader};
    return fetch(url, options);
  }
  const headers = {
    ...tokenHeader,
    ...options.headers,
  };
  options.headers = headers;
  const response = await fetch(url, options);
  if (response.status === 401) authenticateClientside();
  return response;
}

// For many requests, if it fails we get a descriptive JSON error, but success
// returns nothing but a number (the status).  This function wraps success/failure
// in a simple JSON object so we don't have to worry about type issues
const translateSpotifyResponse = async (response) => {
  switch (response.status) {
    case 204:
      return {
        success: true,
      }
    default:
      return {
        success: false,
        responseJson: await response.json(),
      }
  }
}

// Add device ID for playback operations, falling back to the default.  If the
// default is also null, Spotify will use the currently playing device
const addDeviceId = (url, targetDeviceId, context) => {
  const deviceId = targetDeviceId || defaultDeviceId;
  if (deviceId != null) {
    return url + `&device_id=${deviceId}`;
  } else {
    console.warn(
      `${context} was called with a null device id.
      This will fail if the user is not listening on any devices right now`
    );
    return url;
  }
}

// Get a list of the user's devices
const getDevices = async () => {
  const response = await spotifetch('https://api.spotify.com/v1/me/player/devices');
  const json = await response.json();
  return json.devices;
}

// Add a song to the user's queue.  Spotify requires us to pass the song URI, not it's ID!
const enqueueSong = async (trackUri, deviceId) => {
  const url = addDeviceId(
    `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`,
    deviceId,
    'enqueueSong()',
  );
  const response = await spotifetch(url, {method: 'POST'});
  return translateSpotifyResponse(response);
}

const play = async (trackUri, deviceId) => {
  const url = addDeviceId(
    'https://api.spotify.com/v1/me/player/play',
    deviceId,
    'play()',
  );
  const response = await spotifetch(url, {
    method: 'PUT',
    body: trackUri ? JSON.stringify({
      uris: [trackUri],
    }) : '{}',
  });
  return translateSpotifyResponse(response);
}

const pause = async (deviceId) => {
  const url = addDeviceId(
    'https://api.spotify.com/v1/me/player/pause',
    deviceId,
    'pause()',
  );
  const response = await spotifetch(url, {
    method: 'PUT',
  });
  return translateSpotifyResponse(response);
}

const searchItem = async (value) => {
  const queryParam = encodeURI(value)
  const response = await spotifetch(`https://api.spotify.com/v1/search?q=${queryParam}&type=track`);
  const json = await response.json()
  return json
}

const setDefaultDevice = deviceId => {
  defaultDeviceId = deviceId;
}

export { authenticateClientside, getDevices, searchItem, pause, setDefaultDevice };

// To test if Spotify integration works from your computer, run `node src/integrations/spotify.js`
