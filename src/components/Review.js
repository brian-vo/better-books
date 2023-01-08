import Rating from '@mui/material/Rating';

// Rating component - used as a component to display a rating, pass in review and displayUser as props

const Review = ({ review, displayUser = true }) => {
  return (
    <div className="review">
            <Rating value={review.rating} size="small" readOnly /> - {displayUser && <>User #{review.user_id} - </>}   {review.post_date}
      <br />
      <strong> {review.message_title}</strong>
      <br />
      <p>{review.message_body}</p>
    </div>
  );
}

export default Review;
