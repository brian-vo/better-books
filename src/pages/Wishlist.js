import WishlistItem from "../components/WishlistItem";

const Wishlist = () => {
  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        <WishlistItem isbn={"0"}></WishlistItem>
        <WishlistItem isbn={"0"}></WishlistItem>
      </div>
    </div>
  );
};

export default Wishlist;
