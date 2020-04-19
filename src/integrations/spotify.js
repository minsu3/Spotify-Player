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
  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=http:%2F%2Flocalhost:3000&scope=user-read-private%20user-read-email&response_type=token`;
  window.location.href = url;
}

module.exports = {authenticateClientside};

// To test if Spotify integration works from your computer, run `node src/integrations/spotify.js`
