import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideNav from "../components/SideNav";

// Order page - displays details of a single order

function Order() {
  const [data, setData] = useState(null);
  const [books, setBooks] = useState([]);
  const [fetchedBooks, setFetchedBooks] = useState(new Set());
  const [uniqueBooks, setUniqueBooks] = useState(new Set());

  // Get order id from query string
  const queryString = useLocation().search;
  const params = new URLSearchParams(queryString);
  const orderId = params.get('order_id');

  useEffect(() => {
    // Fetch order data
    fetch(`/order/${orderId}/data`)
      .then(response => response.json())
      .then(data => {
        setData(data);
      });
  }, [orderId]);

  // Fetch book data for each book in order
  useEffect(() => {
    // Check if data is available, return if not
    if (!data || !data.order || !data.order[0] || !data.order[0].items) {
      return;
    }
    // Check if books is available, set to empty array if not
    if (!books) {
      setBooks([]);
    }

    // Check if fetchedBooks has isbn, return if it does
    async function fetchBookData(isbn) {
      if (fetchedBooks.has(isbn)) {
        return;
      }

      // Add isbn to fetchedBooks Set otherwise
      setFetchedBooks(prevFetchedBooks => prevFetchedBooks.add(isbn));
      // Fetch book data
      const response = await fetch(`/book/${isbn}/data`);
      const data = await response.json();
      // Add book data to books if loaded properly
      if (data.books && Array.isArray(data.books) && data.books.length > 0) {
        setBooks(books.concat(data.books));
        // Add isbn to uniqueBooks Set
        setUniqueBooks(prevUniqueBooks => prevUniqueBooks.add(data.books[0]));
      }
    }
    // Fetch book data for each isbn in order
    data.order[0].items.map(isbn => fetchBookData(isbn));
  }, [data, books, fetchedBooks]);

  if (!data) {
    return <p>No Data</p>;
  }

  if (!books) {
    return <p>No Book</p>;
  }

  return (
    <div className="container px-4 py-5">
      <SideNav />
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
            const itemQuantity = data.order[0].items_qty.find(item => item[0] === book.isbn);
            return (
              <tr key={book.ISBN}>
                <th scope="row">{book.title}</th>
                <td>{book.isbn}</td>
                <td>${book.price}</td>
                <td>{itemQuantity[1]}</td>
                <td>${book.price * itemQuantity[1]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Order;
