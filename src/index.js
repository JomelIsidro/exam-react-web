import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 createRoot API
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import axios from 'axios'; // Import axios
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Set up Axios defaults globally
axios.defaults.baseURL = 'http://localhost:8000';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create the root element and render the app
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
