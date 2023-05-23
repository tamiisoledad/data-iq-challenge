import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home.js';
import Profile from "./pages/Profile.js";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Home/>}/>
      <Route path="/:id" element={<Profile/>}/>
    </Routes>
  </BrowserRouter>
);

export default App;
