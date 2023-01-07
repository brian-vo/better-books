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
        <p>Loading..</p>
      </div>
    );
  }

  // Check if an error occurred
  if (error) {
    return (
      <div className="book-icon-small">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (data) {
  return (
    <div className="book-icon-small">
      <Link to={"/book?isbn=" + data.books[0].isbn}>
        <img src={data.books[0].image_location} alt="book" />
      </Link>
      <div className="icon-small-info">
        <Link to={"/book?isbn=" + data.books[0].isbn}>{data.books[0].title}</Link>
        <br />
        Price: ${data.books[0].price}
      </div>
      {content}
    </div>
  );
  }
};

export default BookIcon;
