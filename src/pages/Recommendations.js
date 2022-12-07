import Banner from "../components/Banner";
import Recommendation from "../components/Recommendation";
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from "../components/SideNav";

const Recommendations = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      navigate("/login");
    }
  }, []);

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