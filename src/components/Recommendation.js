import { Link } from "react-router-dom";

const Recommendation = ({
  is_book,
  recommend_id,
  sender_id,
  recommend_num,
}) => {
  return (
    <div className="recommendation">
      {/* Recommend_id is the ID of the actual recommendation to find it in the DB, recommend_num is the number that appears in the list (relative to eg. the total number of book recommendations) */}
      <div className="count">{recommend_num}</div>
      <Link to="/books/">{is_book ? "Book title: " : "Author name: "}</Link>
      <div className="sender">From: {sender_id}</div>
      <button>X</button>
    </div>
  );
};

export default Recommendation;
