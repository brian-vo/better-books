import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import BookPurchase from "./components/BookPurchase";
import Recommendations from "./components/Recommendations";
import Wishlist from "./components/Wishlist";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import { useEffect, useState } from "react";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/books" element={<BookPurchase />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
