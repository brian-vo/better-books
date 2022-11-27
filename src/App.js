import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import NavBar from "./components/NavBar";
import Home from "./Home";
import BookPurchase from "./BookPurchase";
import Recommendations from "./Recommendations";
import Wishlist from "./Wishlist";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import Search from "./Search";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="/search" element={<Search searchQuery="test" />} />
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
