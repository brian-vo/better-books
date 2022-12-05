import BookIcon from "./BookIcon";

const WishlistItem = ({ book }) => {
  const handleAddToCart = async (isbn, token) => {
    try {
      const response = await fetch(`/shopping_cart/add/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "isbn": isbn,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFromWishlist = async (isbn, token) => {
    try {
      const response = await fetch(`/wishlist/delete_item`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "isbn": isbn,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BookIcon
      book={book}
      content={
        <div className="button-stack">
          <button className="button" onClick={() => handleAddToCart(book.isbn)} style={{ backgroundColor: "#fce705" }}>
            Add to Cart
          </button>
          <button className="button" onClick={() => deleteFromWishlist(book.isbn)} style={{ backgroundColor: "#AA4A44" }}>
            Remove from List
          </button>
        </div>
      }
    ></BookIcon>
  );
};

export default WishlistItem;