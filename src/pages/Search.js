import BookSearchResult from "../components/BookSearchResult";

const Search = ({ searchQuery }) => {
  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h1>{`Search results for "${searchQuery}"`}</h1>
        <BookSearchResult isbn="0"></BookSearchResult>
        <BookSearchResult isbn="0"></BookSearchResult>
      </div>
    </div>
  );
};

export default Search;
