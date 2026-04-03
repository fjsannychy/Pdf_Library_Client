import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AuthService } from './Services/authServices';
import { CommonService } from './Services/commonServices';
import { AppConstants } from './AppConstants';
import { BookService } from './Services/bookService';

const REFRESH_INTERVAL = AppConstants.RefreshTokenInterval;

async function refreshToken() {
  try {
    if (CommonService.IsAuthenticated()) {
      const res = await AuthService.RefreshToken();
      CommonService.SaveDataToSession(res.data);
    }
  } catch (error) {
    console.error('Failed to refresh token', error);
  }
}

// Initial token refresh
refreshToken();

// Start auto refresh
setInterval(refreshToken, REFRESH_INTERVAL);

let readMinsCount = 0;

async function readBookAction() {

  const location = window.location.href;
  const routes = location.split("/");

  if (routes[routes.length - 2] == "read-book") {
      const id = routes[routes.length - 1];
      readMinsCount++;
      if (readMinsCount == AppConstants.ReadBookLimit) {
          readMinsCount = 0;
          BookService.AddUserAction({ bookId: Number(id), actionType: 2});
      }
  }
  else {
    readMinsCount = 0;
  }

}

//Start read book
setInterval(readBookAction, 1*60*1000);



// Mount the app using React 18 createRoot API
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}