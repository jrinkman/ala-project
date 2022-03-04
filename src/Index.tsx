import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './Index.css';
import App from './App';

// Setup the base API URL for axios
axios.defaults.baseURL = 'https://bie.ala.org.au/ws';

// Render the app to the DOM
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
