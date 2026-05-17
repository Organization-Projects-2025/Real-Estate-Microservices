require('dotenv').config();

// Expose a small debug helper when running tests interactively
if (!process.env.CLIENT_URL) {
  process.env.CLIENT_URL = 'http://localhost:5173';
}

if (!process.env.API_URL) {
  process.env.API_URL = 'http://127.0.0.1:3000/api';
}
