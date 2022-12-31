import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";

const FeaturedBookList = () => {
  const { data, error, isLoading } = useFetch("/book/all_data");

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
                  <div className="icon-title">{book.title}</div>
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
