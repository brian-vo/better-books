import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from "../components/SideNav";
import Banner from "../components/Banner";
import Recommendation from "../components/Recommendation";

const RecommendationsReceive = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]); 

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      navigate("/login");
    }

fetch('/recommendation/user/all/', {
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json' 
  }
    })
      .then(response => response.json())
      .then(data => setRecommendations(data.recommendations)) 
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="recommendations">
      <SideNav />
      <Banner title="Recommendations"></Banner>
      <div className="content-container">
        <h1>Received Recommendations</h1>
        <div className="recommended-books">
          {recommendations.map((recommendation, index) => (
            <Recommendation
              isbn="0"
              id={index}
              sender_id={recommendation.sender_id}
              recommend_num={recommendation.recommend_id}
            ></Recommendation>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsReceive;
