const Review = ({ review }) => {
  return (
    <div className="review">
      <strong>{review.user_id}</strong>
      <br />
      Title: {review.message_title}
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
