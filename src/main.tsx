import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthService } from './Services/authServices.ts';
import { CommonService } from './Services/commonServices.ts';
import { AppConstants } from './AppConstants.ts';

const REFRESH_INTERVAL = AppConstants.RefreshTokenInterval;

async function refreshToken() {

  if (CommonService.IsAuthenticated()) {

    AuthService.RefreshToken().then(async res => {
      CommonService.SaveDataToSession(res.data);
    });


  }

}

refreshToken();

// Start auto refresh
setInterval(refreshToken, REFRESH_INTERVAL);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
