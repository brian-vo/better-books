import React from "react";
import BookIcon from "./BookIcon";

const BookSearchResult = ({ book }) => {
  return (
    <BookIcon
      book={book}
    ></BookIcon>
  );
};

export default BookSearchResult;