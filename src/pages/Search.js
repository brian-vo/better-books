import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import BookSearchResult from "../components/BookSearchResult";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const location = useLocation();

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
