import Banner from "../components/Banner";
import FeaturedBookList from "../components/FeaturedBookList";
import "./Home.css";

// Home page - displays a banner and a list of featured books

const Home = () => {
  return (
    <div className="home">
      <div className="collage-container">
        <Banner
          title="Welcome to BetterBooks"
          subtitle="Discover your next great read at BetterBooks - your one-stop shop for all your book needs"
        ></Banner>
      </div>
      <div className="content-container">
        <h1 className="home-title">Our Selection</h1>
        <FeaturedBookList />
      </div>
    </div>
  );
};

export default Home;
