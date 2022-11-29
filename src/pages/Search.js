import Banner from "../components/Banner";

const Search = ({ searchQuery }) => {
  return (
    <div className="search">
      <div className="content-container">
        <h1>{`Search results for "${searchQuery}"`}</h1>
      </div>
    </div>
  );
};

export default Search;
