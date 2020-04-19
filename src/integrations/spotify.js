// From spotify developer dashboard
const clientId = 'c684509b8e09406c8b08e1c6e9110d94';
const CLIENT_SECRET_ENV_VARIABLE_NAME = 'CHIHUAHUA_SPOTIFY_SECRET';
const clientSecret = process.env[CLIENT_SECRET_ENV_VARIABLE_NAME];

const parsedHash = new URLSearchParams(
    window.location.hash.substr(1) // skip the first char (#)
);
const accessToken = parsedHash.get('access_token');

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
  return fetch(url, options);
}

// Get a list of the user's devices
const getDevices = async () => {
  const response = await spotifetch('https://api.spotify.com/v1/me/player/devices');
  const json = await response.json();
  return json.devices;
}

// Add a song to the user's queue.  Spotify requires us to pass the song URI, not it's ID!
const enqueueSong = async (trackUri, deviceId) => {
  let url = `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`;
  if (deviceId != null) {
    url += `&device_id=${deviceId}`;
  } else {
    console.warn(
      `enqueueSong() was called with a null device id.
      This will fail if the user is not listening on any devices right now`
    );
  }
  const response = await spotifetch(url, {method: 'POST'});
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

const searchItem = async (value) => {
  const queryParam = encodeURI(value)
  const response = await spotifetch(`https://api.spotify.com/v1/search?q=${queryParam}&type=track`);
  const json = await response.json()
  return json
}

searchItem().then(console.log)

module.exports = { authenticateClientside, getDevices, searchItem };

// To test if Spotify integration works from your computer, run `node src/integrations/spotify.js`
