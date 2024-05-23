import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../header/Header'
import './Home.css';

const Home = () => {
  return (
      <div className="home-container">
      <Header /> {/* Add Header component here */}
        <main className="main-content">
          <section className="about-section">
            <p>
              Welcome to our Guest Room Booking platform. We offer the best rooms and packages for your vacations. Our goal is to make your stay comfortable and enjoyable. Book your rooms now and experience the best hospitality.
            </p>
          </section>
        </main>
        <footer className="footer">
          <p>&copy; 2024 Guest Room Booking. All rights reserved.</p>
        </footer>
      </div>
  );
};

export default Home;
