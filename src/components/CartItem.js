import BookIcon from "./BookIcon";
import { useState } from "react";
import "./CartItem.css";

// CartItem component - used as a component to a icon of a book for the shopping cart page, with buttons to update quantity and remove from cart, pass in book as props.

const CartItem = ({ book }) => {
  const [quantity, setQuantity] = useState(book.quantity);

  // function to update the quantity of a book in the shopping cart on button click
  const updateQuantity = async (isbn, newQuantity, token) => {
    if (newQuantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }
    try {
      // call the "/shopping_cart/update/" route to update the quantity of the book in the shopping cart
      await fetch(`/shopping_cart/update/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        // format the request body as JSON
        body: JSON.stringify({
          "isbn": isbn,
          "quantity": newQuantity
        }),
      });
      // reload the page to update the shopping cart
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // function to delete a book from the shopping cart on button click
  const deleteFromCart = async (isbn, token) => {
    try {
      // call the "/shopping_cart/delete/" route to delete the book from the shopping cart
      await fetch(`/shopping_cart/delete/`, {
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
      // reload the page to update the shopping cart
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
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={event => setQuantity(event.target.value)}
            style={{
              border: "1px solid #333",
              padding: "5px"
            }}
          />
          <button
            className="button"
            onClick={() => updateQuantity(book.isbn, quantity)}
            style={{ backgroundColor: "#FFAC1C" }}
          >
            Update Quantity
          </button>
          <button
            className="button"
            onClick={() => deleteFromCart(book.isbn)}
            style={{ backgroundColor: "#FFAC1C" }}
          >
            Remove from Cart
          </button>
        </div>
      }
    ></BookIcon>
  );
};

export default CartItem;