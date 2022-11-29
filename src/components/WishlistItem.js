import BookIcon from "./BookIcon";

const WishlistItem = ({ isbn }) => {
  return (
    <BookIcon
      isbn={isbn}
      content={
        <div className="button-stack">
          <button className="button" style={{ backgroundColor: "#fce705" }}>
            Add to Cart
          </button>
          <button className="button">Remove from List</button>
        </div>
      }
    ></BookIcon>
  );
};

export default WishlistItem;
