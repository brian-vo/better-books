import { Link } from "react-router-dom";
import example_cover from "../img/example-cover.jpg";

const BookIcon = ({ isbn, content }) => {
  return (
    <div className="book-icon-small">
      <Link to="/book/">
        <img src={example_cover} alt="book" />
      </Link>
      <div className="icon-small-info">
        <Link to="/book/">Book title</Link>
        <br />
        Price: $24.99
      </div>
      {content}
    </div>
  );
};

export default BookIcon;
