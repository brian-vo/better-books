import React, { useState, useEffect } from 'react';
import './Checkout.css';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [card, setCard] = useState('');
  const cardOptions = ['','Visa', 'Mastercard', 'Amex', 'Discover'];
  const navigate = useNavigate(); 
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  const [sum, setSum] = useState(0);

  useEffect(() => {
    fetch('/shopping_cart/data/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSum(data.books[0].sum);
      })
      .catch((error) => {
      });
  }, []);

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
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Checkout</h2>
      <div className="form-section">
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
          />
        </label>
      </div>
      <div className="form-section">
        <label>
          Card:
          <select value={card} onChange={handleCardChange}>
            {cardOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="total-box">
        <p>Subtotal: ${sum}</p>
      </div>
      <div className="form-section">
        <button type="submit" className="submit-button">Submit</button>
      </div>
    </form>
  );
};

export default Checkout;
