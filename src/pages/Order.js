import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Order() {
    const [data, setData] = useState(null);
    const [books, setBooks] = useState(null);
  
    const queryString = useLocation().search;
  
    const params = new URLSearchParams(queryString);
    const orderId = params.get('order_id');
  
    useEffect(() => {
      fetch(`/order/${orderId}/data`)
        .then(response => response.json())
        .then(data => {
          setData(data);
        });
    }, [orderId]);

    useEffect(() => {
        if (!data || !data.order || !data.order[0] || !data.order[0].items) {
          return;
        }
        
        const requests = data.order[0].items.map(isbn => {
            return fetch(`/book/${isbn}/data`)
              .then(response => response.json())
              .then(response => setBooks(response.books));
          });
        }, [data]);
        
      if (!data) {
        return <p>No Data</p>;
      }
    
      if (!books) {
        return <p>No Book</p>;
      }

      console.log(data.order[0]);
      return (
      <div className="container px-4 py-5">
        <h2 className="pb-2">Order #{data.order[0].order_id}</h2>
        <p className="fw-bold">Address: {data.order[0].address}</p>
        <p className="fw-bold">Placed on: {data.order[0].order_date}</p>
        <p className="fw-bold">Payment Method: {data.order[0].payment_method}</p>
        <p className="fw-bold">Fulfillment Status: {data.order[0].status}</p>
  
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Product</th>
              <th scope="col">SKU</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
          {data && books && Array.isArray(books) && data.order[0].items.map((item, index) => (
  <tr key={books[index].ISBN}>
    <th scope="row">{books[index].title}</th>
    <td>{books[index].isbn}</td>
    <td>${books[index].price}</td>
    <td>{data.order[0].items_qty[index][1]}</td>
    <td>${books[index].price * data.order[0].items_qty[index][1]}</td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    );
  }

  export default Order;
