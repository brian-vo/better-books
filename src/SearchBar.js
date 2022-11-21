const SearchBar = ({ placeholder, data }) => {
  return (
    <div className="search-bar">
      {/* <div className="search-content"> */}
      <input type="text" className="search-input" placeholder={placeholder} />
      <div className="searchIcon"></div>
      {/* </div> */}
    </div>
  );
};

export default SearchBar;
