import Banner from "./Banner";
import BookIcon from "./BookIcon";

const Home = () => {
  return (
    <div className="home">
      <Banner
        title="Welcome to [company name]!"
        subtitle="We offer a wide selection of books"
      ></Banner>
      <div className="featured-container">
        <h1 className="featured-header">Featured Books</h1>
        <div className="featured">
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
          <BookIcon />
        </div>
      </div>
    </div>
  );
};

export default Home;
