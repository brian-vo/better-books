import Banner from "../components/Banner";
import FeaturedBookList from "../components/FeaturedBookList";

const Home = () => {
  return (
    <div className="home">
      <Banner
        title="Welcome to BetterBooks"
        subtitle="We offer a wide selection of books"
      ></Banner>
      <div className="content-container">
        <h1 className="home-title">Featured Books</h1>
        <FeaturedBookList />
      </div>
    </div>
  );
};

export default Home;
