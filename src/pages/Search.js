import Banner from "../components/Banner";

const Search = ({ searchQuery }) => {
  return (
    <div className="search">
      <Banner
        title={`Search results for "${searchQuery}"`}
        subtitle=""
      ></Banner>
    </div>
  );
};

export default Search;
