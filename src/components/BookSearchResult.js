import React from "react";
import BookIcon from "./BookIcon";

// BookSearchResult component - used as a component to a simplfiied icon of a book for the search results page, pass in book as props

const BookSearchResult = ({ book }) => {
  return (
    <BookIcon
      book={book}
    ></BookIcon>
  );
};

export default BookSearchResult;