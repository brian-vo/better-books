const Review = ({ review }) => {
  return (
    <div className="review">
      <strong>{review.user_id}</strong>
      <br />
      Rating: {review.rating}/5
      <br />
      Posted: {review.post_date}
      <br />
      <br />
      <p>{review.message_body}</p>
    </div>
  );
}

export default Review;