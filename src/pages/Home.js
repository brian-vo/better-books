import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";

const Home = () => {
  const [books, setBooks] = useState([]); 
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/book/all_data");

        const data = await response.json();

        setBooks(data.books);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="home">
      <Banner
        title="Welcome to BetterBooks"
        subtitle="We offer a wide selection of books"
      ></Banner>
      <div className="content-container">
        <h1 className="home-title">Featured Books</h1>
        <ul className="featured">
          {books.map((book) => (
            <li className="book-icon">
              <Link to={"/book?isbn=" + book.isbn}>
                <div className="icon-container">
                  <img src={book.image_location} alt="book" />
                </div>
                <div className="icon-info">
                  <div className="icon-title">{book.title}</div>
                  <div className="icon-authors">
                    {book.authors.map((author) => `${author.fname} ${author.lname}`).join(", ")}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
