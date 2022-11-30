import example_cover from "../img/example-cover.jpg";
import Review from "../components/Review";

const BookPurchase = ({ isbn }) => {
  return (
    <div className="purchase-container">
      <div className="purchase-content">
        <div className="book-container">
          <img src={example_cover} alt="book" />
        </div>
        <div className="purchase-info">
          <h1>Book title</h1>
          <p>
            <h2>$24.99</h2>
            <strong>Description:</strong>
            <br />
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam
            repudiandae enim harum aliquam quam praesentium quae fuga magni
            iure, ea dicta possimus dolorem tenetur autem veritatis! Nam nulla
            mollitia similique? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Alias sed fuga ducimus beatae pariatur velit
            deleniti odio eos, autem nisi molestiae illum neque minus, culpa
            sapiente reprehenderit commodi dolor. Sunt? Lorem ipsum, dolor sit
            amet consectetur adipisicing elit. Quisquam repudiandae enim harum
            aliquam quam praesentium quae fuga magni iure, ea dicta possimus
            dolorem tenetur autem veritatis! Nam nulla mollitia similique? Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Alias sed fuga
            ducimus beatae pariatur velit deleniti odio eos, autem nisi
            molestiae illum neque minus, culpa sapiente reprehenderit commodi
            dolor. Sunt?
          </p>
          <div className="purchase-btns">
            <button className="button">Add to Wishlist</button>
            <button className="button">Leave Review</button>
          </div>
          <button className="button">Add to Cart</button>
        </div>
      </div>
      <div className="review-content">
        <h1>Reviews</h1>
        <Review review_id="0"></Review>
        <Review review_id="0"></Review>
        <Review review_id="0"></Review>
        <Review review_id="0"></Review>
      </div>
    </div>
  );
};

export default BookPurchase;
