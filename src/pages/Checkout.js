  import React, { useState, useEffect } from 'react';
  import './Checkout.css';
  import { useNavigate } from 'react-router-dom';
  import BookIcon from "../components/BookIcon";


  const Checkout = () => {
    const [address, setAddress] = useState('');
    const [card, setCard] = useState('');
    const cardOptions = ['','Visa', 'Mastercard', 'Amex', 'Discover'];
    const navigate = useNavigate(); 
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    const [sum, setSum] = useState(0);
    const [books, setBooks] = useState(null);


    useEffect(() => {
      fetch('/shopping_cart/data/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setBooks(data.books);
          setSum(data.books[0].sum);
        })
        .catch((error) => {
        });
    }, [token]);

    const handleAddressChange = (event) => {
      setAddress(event.target.value);
    };

    const handleCardChange = (event) => {
      setCard(event.target.value);
    };

    const handleSubmit = (event) => {
      if (card === '') {
        alert("Select a card type!")
        return;
      }
      if (address === '') {
        alert("Input an address!")
        return;
      }
      event.preventDefault();
    
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

        fetch('/shopping_cart/delete/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        alert('Your order was placed successfully!');

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
                  <option value={option}>{option}</option>
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
      <div>
        {book.items.map((item) => (
          <div style={{ display: "flex", flexDirection: "row" }}>
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
    
    <div style={{ display: "flex", flexDirection: "row", marginTop: 20, "border-top": "1px solid black", "padding-top": "10px" }}>
          <div class="line" style={{ width: "66.66%" }}>
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
