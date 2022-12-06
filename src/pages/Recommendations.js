import Banner from "../components/Banner";
import Recommendation from "../components/Recommendation";
import React from 'react';
import SideNav from "../components/SideNav";
import useLoginCheck from "../hooks/useLoginCheck";

const Recommendations = () => {
  useLoginCheck("/login");

  return (
    <div className="recommendations">
      <SideNav />
      <Banner title="Recommendations"></Banner>
      <div className="content-container">
        <h1>Recommended Books</h1>
        <div className="recommended-books">
          <Recommendation
            isbn="0"
            id="0"
            sender_id="Brian Vo"
            recommend_num="1"
          ></Recommendation>
          <Recommendation
            isbn="0"
            id="1"
            sender_id="Brian Vo"
            recommend_num="2"
          ></Recommendation>
        </div>
        <h1>Recommended Authors</h1>
        <div className="recommended-authors">
          <Recommendation
            id="0"
            sender_id="Mirich Tenny" /* TODO: get user name from id */
            recommend_num="1"
          ></Recommendation>
          <Recommendation
            id="1"
            sender_id="Mirich Tenny" /* TODO: get user name from id */
            recommend_num="2"
          ></Recommendation>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
