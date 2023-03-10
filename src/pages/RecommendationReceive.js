import React, { useState, useEffect } from 'react';
import SideNav from "../components/SideNav";
import Banner from "../components/Banner";
import Recommendation from "../components/Recommendation";
import useLoginCheck from '../hooks/useLoginCheck';

// RecommendationsReceive page - displays all received recommendations for a user

const RecommendationsReceive = () => {
  const [recommendations, setRecommendations] = useState([]); 

  // Check if user is logged in, if not, redirect to login page using useLoginCheck hook
  useLoginCheck("/recommendation/received", "/login");

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
  // Fetch user recommendations from FLASK API
  fetch('/recommendation/user/all/', {
  headers: {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json' 
  }
    })
      .then(response => response.json())
      // Set recommendations state to recommendations returned from API
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
