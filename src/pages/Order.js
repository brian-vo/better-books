import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Order() {
  const [data, setData] = useState(null);
  const [books, setBooks] = useState([]);
  const [fetchedBooks, setFetchedBooks] = useState(new Set());
  const [uniqueBooks, setUniqueBooks] = useState(new Set());

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

    if (!books) {
      setBooks([]);
    }

    const requests = data.order[0].items.map(isbn => {
      if (fetchedBooks.has(isbn)) {
        return;
      }
    
      setFetchedBooks(prevFetchedBooks => prevFetchedBooks.add(isbn));
    
      return fetch(`/book/${isbn}/data`)
        .then(response => response.json())
        .then(response => {
          if (response.books && Array.isArray(response.books) && response.books.length > 0) {
            setBooks(books.concat(response.books));
    
            setUniqueBooks(prevUniqueBooks => prevUniqueBooks.add(response.books[0]));
          }
        });
    });
  }, [data, books, fetchedBooks]);

  if (!data) {
    return <p>No Data</p>;
  }

  if (!books) {
    return <p>No Book</p>;
  }
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
  {Array.from(uniqueBooks).map(book => {
    return (
      <tr key={book.ISBN}>
        <th scope="row">{book.title}</th>
        <td>{book.isbn}</td>
        <td>${book.price}</td>
        <td>{data.order[0].items_qty[0][1]}</td>
        <td>${book.price * data.order[0].items_qty[0][1]}</td>
      </tr>
    );
  })}
</tbody>
      </table>
    </div>
  );
}

export default Order;
