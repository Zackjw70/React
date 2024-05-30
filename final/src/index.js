import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import './index.scss'
import {BrowserRouter} from "react-router-dom";
import { Routes, Route, Link} from "react-router-dom";
import AppRouter from './AppRouter.js';
import Home from './Home.js';
import { Provider } from 'react-redux'

import { configureStore } from "@reduxjs/toolkit"

import teamReducer from "./features/teamSlice.js"

const store = configureStore({
  reducer: {
    team: teamReducer,
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Home />
    </Provider>  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
