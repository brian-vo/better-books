import example_cover from "../img/example-cover.jpg";
import { Link } from "react-router-dom";

const WishlistItem = ({ isbn }) => {
  return (
    <div className="wishlist-item">
      <Link to="/book/">
        <img src={example_cover} alt="book" />
      </Link>
      <div className="wishlist-info">
        <Link to="/book/">Book title</Link>
        <br />
        Price: $24.99
      </div>
      <div className="button-stack">
        <button className="add-button" style={{ backgroundColor: "#f5c905" }}>
          Add to Cart
        </button>
        <button className="add-button">Remove from List</button>
      </div>
    </div>
  );
};

export default WishlistItem;
