import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const BookIcon = ({ book, content }) => {
  // Use useFetch hook to make a GET request to the "/book/<book_isbn>/data" route
  const { data, isLoading, error } = useFetch(`/book/${book.isbn}/data`);
  // Check if the data has been fetched
  if (!data || isLoading) {
    return (
      <div className="book-icon-small">
        <Link to={"/book?isbn=" + book.isbn}>
          <img src={book.image_location} alt="book" />
        </Link>
        <div className="icon-small-info">
          <Link to={"/book?isbn=" + book.isbn}>{book.title}</Link>
          <br />
          Price: {book.price}
        </div>
        {content}
      </div>
    );
  }

  // Check if an error occurred
  if (error) {
    return (
      <div className="book-icon-small">
        <Link to={"/book?isbn=" + book.isbn}>
          <img src={book.image_location} alt="book" />
        </Link>
        <div className="icon-small-info">
          <Link to={"/book?isbn=" + book.isbn}>{book.title}</Link>
          <br />
          Price: {book.price}
        </div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  // If the data was successfully fetched, extract the relevant information from the book data
  const {
    cover_type,
    description,
    image_location,
    price,
    stock,
    title
  } = data;

  return (
    <div className="book-icon-small">
      <Link to={"/book?isbn=" + book.isbn}>
        <img src={book.image_location} alt="book" />
      </Link>
      <div className="icon-small-info">
        <Link to={"/book?isbn=" + book.isbn}>{book.title}</Link>
        <br />
        Price: ${book.price}
      </div>
      {content}
    </div>
  );
};

export default BookIcon;
