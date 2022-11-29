import BookSearchResult from "../components/BookSearchResult";
import { useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  console.log(query);

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
