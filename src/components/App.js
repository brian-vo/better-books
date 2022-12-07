import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Home from "../pages/Home";
import BookPurchase from "../pages/BookPurchase";
import RecommendationSent from "../pages/RecommendationSent";
import RecommendationReceive from "../pages/RecommendationReceive";
import Wishlist from "../pages/Wishlist";
import LogIn from "../pages/Login";
import Cart from "../pages/Cart";
import SignUp from "../pages/SignUp";
import Search from "../pages/Search";
import Account from "../pages/Account";
import Order from "../pages/Order";
import OrderHistory from "../pages/OrderHistory";
import ReviewHistory from "../pages/ReviewHistory";
import Checkout from "../pages/Checkout";


function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search searchQuery="test" />} />
            <Route path="/book" element={<BookPurchase />} />
            <Route path="/recommendation/received" element={<RecommendationReceive />} />
            <Route path="/recommendation/sent" element={<RecommendationSent />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<Account />} />
            <Route path="/order_history" element={<OrderHistory />} />
            <Route path="/order" element={<Order />} />
            <Route path="/review_history" element={<ReviewHistory />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
