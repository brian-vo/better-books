const BookIcon = ({ title, price }) => {
  return (
    <li className="book-icon">
      <img src="" alt="" />
      <div className="book-info">
        {title}
        <br />
        {price}
      </div>
    </li>
  );
};

export default BookIcon;
