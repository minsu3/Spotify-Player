// From spotify developer dashboard
const clientId = 'c684509b8e09406c8b08e1c6e9110d94';
const CLIENT_SECRET_ENV_VARIABLE_NAME = 'CHIHUAHUA_SPOTIFY_SECRET';
const clientSecret = process.env[CLIENT_SECRET_ENV_VARIABLE_NAME];

if (clientSecret == null) {
  console.error(
    `Spotify client secret was not found; please set it in your environment
    variables to use Spotify integration.  Until then, all attempts to
    communicate with Spotify will just log to the console :)`
  );
}

// To test if Spotify integration works from your computer, run `node src/integrations/spotify.js`
