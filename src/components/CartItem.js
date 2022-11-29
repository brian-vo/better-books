import BookIcon from "./BookIcon";

const CartItem = ({ isbn }) => {
  return (
    <BookIcon
      isbn={isbn}
      content={
        <div className="button-stack">
          <button className="button">Remove from Cart</button>
        </div>
      }
    ></BookIcon>
  );
};

export default CartItem;
