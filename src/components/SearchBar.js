import { useNavigate } from "react-router-dom";

const SearchBar = ({ placeholder, data }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e.target.value.toLowerCase());
    }
  };

  const navigate = useNavigate();

  const handleSearch = (searchQuery) => {
    navigate("/search/" + searchQuery);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        onKeyPress={(e) => handleKeyPress(e)}
      />
      <div className="searchIcon"></div>
    </div>
  );
};

export default SearchBar;
