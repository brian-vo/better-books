import BookIcon from "./BookIcon";

const BookSearchResult = ({ isbn }) => {
  return (
    <BookIcon
      isbn={isbn}
      content={
        <p className="icon-desc">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam
          repudiandae enim harum aliquam quam praesentium quae fuga magni iure,
          ea dicta possimus dolorem tenetur autem veritatis! Nam nulla mollitia
          similique? Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Alias sed fuga ducimus beatae pariatur velit deleniti odio eos, autem
          nisi molestiae illum neque minus, culpa sapiente reprehenderit commodi
          dolor. Sunt? Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Quisquam repudiandae enim harum aliquam quam praesentium quae fuga
          magni iure, ea dicta possimus dolorem tenetur autem veritatis! Nam
          nulla mollitia similique? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Alias sed fuga ducimus beatae pariatur velit
          deleniti odio eos, autem nisi molestiae illum neque minus, culpa
          sapiente reprehenderit commodi dolor. Sunt?
        </p>
      }
    ></BookIcon>
  );
};

export default BookSearchResult;
