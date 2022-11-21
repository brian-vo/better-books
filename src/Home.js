import Banner from "./Banner";
import BookIcon from "./BookIcon";
import example_cover from "./img/example-cover.jpg";

const Home = () => {
  return (
    <div className="home">
      <Banner
        title="Welcome to [company name]!"
        subtitle="We offer a wide selection of books"
      ></Banner>
      <div className="featured-container">
        <h1>Featured Books</h1>
        <ul className="featured">
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
          <BookIcon
            title="Book title here"
            price="$24.99"
            imageUrl={example_cover}
          />
        </ul>
      </div>
    </div>
  );
};

export default Home;
