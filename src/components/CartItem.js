import BookIcon from "./BookIcon";
import { useState } from "react";

const CartItem = ({ book }) => {
  const [quantity, setQuantity] = useState(book.quantity);

  const updateQuantity = async (isbn, newQuantity, token) => {
    if (newQuantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }
    try {
      const response = await fetch(`/shopping_cart/update/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "isbn": isbn,
          "quantity": newQuantity 
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFromCart = async (isbn, token) => {
    try {
      const response = await fetch(`/shopping_cart/delete/`, {
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