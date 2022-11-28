import Banner from "../components/Banner";
import Recommendation from "../components/Recommendation";

const Recommendations = () => {
  return (
    <div className="recommendations">
      <Banner title="Recommendations"></Banner>
      <div className="content-container">
        <h1>Recommended Books</h1>
        <div className="recommended-books">
          <Recommendation
            id="0"
            sender_id="Brian Vo"
            recommend_num="1"
          ></Recommendation>
        </div>
        <h1>Recommended Authors</h1>
        <div className="recommended-authors">
          <Recommendation
            id="0"
            sender_id="Mirich Tenny" /* TODO: get user name from id */
            recommend_num="1"
          ></Recommendation>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
