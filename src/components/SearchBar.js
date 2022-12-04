import { useNavigate } from "react-router-dom";

const SearchBar = ({ placeholder }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e.target.value.toLowerCase());
      e.target.blur(); // Remove focus
    }
  };

  const navigate = useNavigate();

  const handleSearch = (searchQuery) => {
    navigate(`/search?searchvalue=${searchQuery}`);
  };
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        onFocus={(e) => (e.target.value = "")} // Delete current text when input field is selected
        onKeyPress={(e) => handleKeyPress(e)}
      />
      <div className="searchIcon"></div>
    </div>
  );
};

export default SearchBar;
