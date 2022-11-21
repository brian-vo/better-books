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
        <ul className="featured">
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
          <BookIcon title="Book title here" price="$24.99" />
        </ul>
      </div>
    </div>
  );
};

export default Home;
