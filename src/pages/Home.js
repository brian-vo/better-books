import Banner from "../components/Banner";
import FeaturedBook from "../components/FeaturedBook";
import example_cover from "../img/example-cover.jpg";

const Home = () => {
  return (
    <div className="home">
      <Banner
        title="Welcome to BetterBooks"
        subtitle="We offer a wide selection of books"
      ></Banner>
      <div className="content-container">
        <h1 className="home-title">Featured Books</h1>
        <ul className="featured">
          <FeaturedBook isbn="0" />
          <FeaturedBook isbn="0" />
          <FeaturedBook isbn="0" />
          <FeaturedBook isbn="0" />
          <FeaturedBook isbn="0" />
          <FeaturedBook isbn="0" />
          <FeaturedBook isbn="0" />
          <FeaturedBook isbn="0" />
          <FeaturedBook isbn="0" />
          <FeaturedBook isbn="0" />
        </ul>
      </div>
    </div>
  );
};

export default Home;
