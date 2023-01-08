import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookSearchResult from "../components/BookSearchResult";
import useFetch from "../hooks/useFetch";

// Search page - displays search results for a given query

const Search = () => {
  const queryString = useLocation().search;

  // Parse the query string to get the `isbn` value
  const params = new URLSearchParams(queryString);
  const query = params.get("searchvalue");

  const searchData = {
    search: query,
  };
  // Use useFetch hook to make a POST request to the "/search/" route
  const { data, isLoading, error } = useFetch("/search/", "POST", JSON.stringify(searchData));
  useEffect(() => {
  }, []);

  // Check if the data has been fetched
  if (!data || isLoading) {
    return (
      <div className="wishlist">
        <div className="wishlist-container">
          <h1>{`Search results for "${query}"`}</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Check if an error occurred
  if (error) {
    return (
      <div className="wishlist">
        <div className="wishlist-container">
          <h1>{`Search results for "${query}"`}</h1>
          <p>Error: {error.message}</p>
        </div>
      </div>
    );
  }

  // If there are no books in the data, display a message
  if (!data.books || data.books.length === 0) {
    return (
      <div className="wishlist">
        <div className="wishlist-container">
          <h1>{`Search results for "${query}"`}</h1>
          <p>No books found</p>
        </div>
      </div>
    );
  }

  // If there are books in the data, map over them and render a BookSearchResult for each book
  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h1>{`Search results for "${query}"`}</h1>
        {data.books.map((book) => (
          <BookSearchResult key={book.isbn} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Search;