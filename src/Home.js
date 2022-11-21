import Banner from "./Banner";

const Home = () => {
  return (
    <div className="home">
      <Banner
        title="Welcome to [company name]!"
        subtitle="We offer a wide selection of books"
      ></Banner>
      <h1>Homepage</h1>
    </div>
  );
};

export default Home;
