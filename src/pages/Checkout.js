import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { useNavigate } from 'react-router-dom';

// Checkout page - used to checkout books to an order from shopping cart

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [card, setCard] = useState('');
  const [sum, setSum] = useState(0);
  const [books, setBooks] = useState(null);
  const cardOptions = ['', 'Visa', 'Mastercard', 'Amex', 'Discover'];
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  const navigate = useNavigate();


  useEffect(() => {
    // fetch books from shopping cart
    fetch('/shopping_cart/data/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // set books from response
        setBooks(data.books);
        // set sum from response
        setSum(data.books[0].sum);
      })
      .catch((error) => {
      });
  }, [token]);

  // handle address change in form
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  // handle card change in form
  const handleCardChange = (event) => {
    setCard(event.target.value);
  };

  // handle form submission
  const handleSubmit = (event) => {
    // check if address and card are filled out
    if (card === '') {
      alert("Select a card type!")
      return;
    }
    if (address === '') {
      alert("Input an address!")
      return;
    }
    event.preventDefault();
    // create order by FLASK API call
    const requestBody = {
      shipping_address: address,
      payment_method: card,
    };
    fetch('/order/create/', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
      })
      .catch((error) => {
      });

    // delete all items from shopping cart once order is created
    fetch('/shopping_cart/delete/all', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    // alert user that order was placed successfully
    alert('Your order was placed successfully!');
    // redirect to order history page
    navigate('/order_history/');
  };

  return (
    <div className="checkout-container">
      <div className="checkout-column-left">
        <div className="checkout-box">
          <h1>Checkout</h1>
          <form>
            <label htmlFor="address">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
            />
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              onChange={handleAddressChange}
              value={address}
            />
            <label htmlFor="card">Card Type:</label>
            <select id="card" name="card" onChange={handleCardChange} value={card}>
              {cardOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <br />
            <label htmlFor="card-number">Card Number:</label>
            <input
              type="text"
              id="card-number"
              name="card-number"
            />
            <div className="expiration-cvv-row">
              <div className="expiration-date-column">
                <label htmlFor="expiration-date">Expiration Date: </label>
                <input
                  type="text"
                  id="expiration-date"
                  name="expiration-date"
                />
              </div>
              <div className="cvv-column">
                <label htmlFor="cvv">CVV: </label>
                <input type="text" id="cvv" name="cvv" />
              </div>
            </div>
            <button type="submit" onClick={handleSubmit}>
              Place Order
            </button>
          </form>
        </div>
      </div>
      <div className="checkout-column-right">
        <div className="checkout-box">
          <h1>Cart</h1>
          {books && (
            <div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div style={{ width: "33.33%" }}>
                  <h5>Title</h5>
                </div>
                <div style={{ width: "33.33%" }}>
                  <h5>Quantity</h5>
                </div>
                <div style={{ width: "33.33%" }}>
                  <h5>Price</h5>
                </div>
              </div>
              {books.map((book) => (
                <div key={book.id}>
                  {book.items.map((item) => (
                    <div key={item.id} style={{ display: "flex", flexDirection: "row" }}>
                      <div style={{ width: "33.33%" }}>
                        <p>{item.title}</p>
                      </div>
                      <div style={{ width: "33.33%" }}>
                        <p>{item.quantity}</p>
                      </div>
                      <div style={{ width: "33.33%" }}>
                        <p>${item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div style={{ display: "flex", flexDirection: "row", marginTop: 20, "borderTop": "1px solid black", "paddingTop": "10px" }}>
                <div className="line" style={{ width: "66.66%" }}>
                  <h5>Subtotal:</h5>
                </div>
                <div style={{ width: "33.33%" }}>
                  <h5>${sum}</h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
