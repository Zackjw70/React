import { UseStateDemo } from './components/UseStateDemo';
import { useState } from 'react';
import UseEffectDemo from './components/UseEffectDemo';
import './App.css';
import {Outlet, useNavigate} from "react-router-dom";
import { Routes, Route, Link} from "react-router-dom";


function App() {
  const navigate = useNavigate();

  const handleShowUseStateDemo = () => {
    navigate('state-demo');
  };

  const handleShowUseEffectDemo = () => {
    navigate('effect-demo');
  };

  return (
    <div className="App">
      <hr />
      <button className="button" onClick={handleShowUseStateDemo}>
        UseState Demo
      </button>
      <button className="button" onClick={handleShowUseEffectDemo}>
        UseEffect Demo
      </button>
      <Outlet />
    </div>
    
  );
  
}

export default App;
