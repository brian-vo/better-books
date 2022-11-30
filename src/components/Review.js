const Review = ({ review_id }) => {
  function formatDate(date) {
    return [
      date.getDate().toString().padStart(2, "0"),
      date.getMonth().toString().padStart(2, "0"),
      date.getFullYear(),
    ].join("/");
  }

  return (
    <div className="review">
      <strong>John Doe</strong>
      <br />
      Rating: 5/5
      <br />
      Posted: {formatDate(new Date(2022, 6, 24))}
      <br />
      <br />
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci
        deserunt necessitatibus ad error dignissimos, maiores eligendi suscipit
        placeat dolores eos asperiores eveniet aperiam, atque odio dicta
        possimus quibusdam, recusandae molestias. Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Illum magnam minus eaque! Ipsa, iure
        mollitia? Vel, obcaecati fugiat voluptas, ratione natus nulla officia
        quasi maxime ducimus perferendis aperiam inventore provident.
      </p>
    </div>
  );
};

export default Review;
