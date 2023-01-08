import React, { useState, useEffect } from 'react';
import SideNav from "../components/SideNav";
import Banner from "../components/Banner";
import Recommendation from "../components/Recommendation";
import useLoginCheck from '../hooks/useLoginCheck';

// RecommendationsReceive page - displays all received recommendations for a user

const RecommendationSent = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [error, setError] = useState(null);
    // Check if user is logged in, if not, redirect to login page using useLoginCheck hook
    useLoginCheck("/recommendation/sent", "/login");

    useEffect(() => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        // Fetch user recommendations from FLASK API
        fetch('/recommendation/user/all/sent', {
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

    // Function to handle the submission of a new recommendation
    const handleAddRecommendation = async (recipient_id, token, authors, isbns) => {
        try {
            // Send POST request to FLASK API to add new recommendation
            await fetch(`/recommendation/new`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: token,
                    recipient_id: recipient_id,
                    isbns: isbns,
                    author_names: authors,
                }),
            }).then((responseData) => {
                // Handle error responses
                if (responseData.status === 491) {
                    setError("The recipent does not exist!");
                }
                if (responseData.status === 492) {
                    setError("One of the provided ISBNs do not exist!");
                }
                if (responseData.status === 493) {
                    setError("One of the provided authors do not exist!");
                }
                if (responseData.status === 494) {
                    setError("One of the provided authors do not exist!");
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Display error message if error state is set
    useEffect(() => {
        if (error) {
            alert(error);
            setError(null);
        }
    }, [error]);

    // Handle the submission of a new recommendation form
    const handleReviewSubmit = async (event) => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1");
        event.preventDefault();

        // Check if the input values are valid, and in correct format
        const inputValueAuth = event.target.authors.value.toString();
        const inputValueISBNs = event.target.isbns.value.toString();
        const pattern = /[A-Za-z0-9]+/i;
        if (!pattern.test(inputValueAuth)) {
            alert("Authors must be a list of values separated by commas.");
            return;
        }
        if (!pattern.test(inputValueISBNs)) {
            alert("ISBNs must be a list of values separated by commas.");
            return;
        }

        // Get the values from the form
        const recipient_id = event.target.recipient.value;
        const authors = event.target.authors.value.toString().replace(/\s*,\s*/g, ",").split(",");
        const isbns = event.target.isbns.value.toString().replace(/\s*,\s*/g, ",").split(",");
        // Call handleAddRecommendation function to add the new recommendation
        handleAddRecommendation(recipient_id, token, authors, isbns);

        // Clear the form, reload page
        window.location.reload();
        event.target.recipient.value = "";
        event.target.authors.value = "";
        event.target.isbns.value = "";
    };

    // Function to handle the display of the review form
    const handleShowReviewForm = () => {
        setShowReviewForm(true);
    };

    return (
        <div className="recommendations">
            <SideNav />
            <Banner title="Recommendations"></Banner>
            <div className="content-container">
                <button className="green-button" onClick={handleShowReviewForm}>Write a Recommendation</button>
                {showReviewForm && (
                    <div className="review-form">
                        <form onSubmit={handleReviewSubmit}>
                            <label className="review-title">
                                <p>Recipient:</p>
                                <input type="text" name="recipient" />
                            </label>
                            <label className="review-body">
                                <p>Authors:</p>
                                <textarea type="text" name="authors" />
                            </label>
                            <label className="review-body">
                                <p>ISBNs:</p>
                                <textarea type="text" name="isbns" />
                            </label>
                            <input type="submit" value="Submit" className="submit" />
                        </form>
                    </div>
                )}
                <h1>Sent Recommendations</h1>
                <div className="recommended-books">
                    {recommendations.map((recommendation, index) => (
                        <Recommendation
                            isbn="0"
                            id={index}
                            sender_id={recommendation.recipient_id}
                            recommend_num={recommendation.recommend_id}
                            isSent={true}
                        ></Recommendation>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecommendationSent;
