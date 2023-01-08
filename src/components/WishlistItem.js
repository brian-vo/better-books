import BookIcon from "./BookIcon";
import './WishlistItem.css';

// WishlistItem component - used as a component to a icon of a book for the wishlist page, with buttons to add to cart and remove from wishlist, pass in book as props.

const WishlistItem = ({ book }) => {  
  
  // function to add a book to the shopping cart on button click
  const handleAddToCart = async (isbn, token) => {
    try {
      // call the "/shopping_cart/add/" route to add the book to the shopping cart
      const response = await fetch(`/shopping_cart/add/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        // format the request body as JSON
        body: JSON.stringify({
          "isbn": isbn,
        }),
      });
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error(`Error adding item to cart: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
    alert("Added to Cart!");
  };

  // function to delete a book from the wishlist on button click
  const deleteFromWishlist = async (isbn, token) => {
    try {
      // call the "/wishlist/delete_item" route to delete the book from the wishlist
      const response = await fetch(`/wishlist/delete_item`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        // format the request body as JSON
        body: JSON.stringify({
          "isbn": isbn,
        }),
      });
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error(`Error deleting item from wishlist: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <BookIcon
      book={book} 
      content={
        <div className="button-stack">
          <button className="button" onClick={() => handleAddToCart(book.isbn)} style={{ backgroundColor: "#E4D00A" }}>
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