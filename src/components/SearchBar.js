const SearchBar = ({ placeholder, data }) => {
  return (
    <div className="search-bar">
      <input type="text" className="search-input" placeholder={placeholder} />
      <div className="searchIcon"></div>
    </div>
  );
};

export default SearchBar;
