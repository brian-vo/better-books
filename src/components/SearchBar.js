import { useNavigate } from "react-router-dom";

// SearchBar component - used as a component to display a search bar

const SearchBar = ({ placeholder }) => {
  // Handle search when enter is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e.target.value.toLowerCase());
      e.target.blur(); // Remove focus
    }
  };

  const navigate = useNavigate();

  // Handle search when search icon is clicked
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
