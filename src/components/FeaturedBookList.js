import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";

// FeaturedBookList component - used as a component to display a list of all books on the home page

const FeaturedBookList = () => {
  // Use useFetch hook to make a GET request to the "/book/all_data" route
  const { data, isLoading } = useFetch("/book/all_data");
  
  // truncateText function - used to truncate the text of a book's title if it is too long - otherwise page will be distorted
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  }

  return (
    <ul className="featured">
      {!isLoading &&
        data.books.map((book) => {
          return (
            <li className="book-icon">
              <Link to={"/book?isbn=" + book.isbn}>
                <div className="icon-container">
                  <img src={book.image_location} alt="book" />
                </div>
                <div className="icon-info">
                <div className="icon-title" title={book.title}>
                  {truncateText(book.title, 25)}
                </div>
                <div className="icon-price">${book.price}</div>
                </div>
              </Link>
            </li>
          );
        })}
    </ul>
  );
};

export default FeaturedBookList;
