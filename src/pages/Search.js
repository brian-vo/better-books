import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookSearchResult from "../components/BookSearchResult";
import useFetch from "../hooks/useFetch";

const Search = () => {
  const queryString = useLocation().search;

  // Parse the query string to get the `isbn` value
  const params = new URLSearchParams(queryString);
  const query = params.get("searchvalue");
  const location = useLocation();

  const searchData = {
    search: query,
  };
  // Use useFetch hook to make a POST request to the "/search/" route
  const { data, isLoading, error } = useFetch("/search/", "POST", JSON.stringify(searchData));
  useEffect(() => {
    console.log("Location changed");
  }, [location]);

  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h1>{`Search results for "${query}"`}</h1>
        <BookSearchResult isbn="0"></BookSearchResult>
        <BookSearchResult isbn="0"></BookSearchResult>
      </div>
    </div>
  );
};

export default Search;