import WishlistItem from "../components/WishlistItem";

const Wishlist = () => {
  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h1>Wishlist</h1>
        <WishlistItem></WishlistItem>
        <WishlistItem></WishlistItem>
      </div>
    </div>
  );
};

export default Wishlist;
