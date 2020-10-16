import React from 'react';
import ReactDOM from 'react-dom';
import AppSocket from './AppSocket.jsx'
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <AppSocket />
  </React.StrictMode>,
  document.getElementById('root')
);