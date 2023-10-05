/*
filename: LoginPage.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 03/09/2023
*/
// Importing necessary modules and components
import React, { useState } from "react";  // Combined the React and useState imports
import Introduction from "./Introduction";
import LoginSection from "./LoginSection";
import Register from "./Register";
import "./LoginPage.css";
import cards from "../../assets/cards.png";

/**
 * LoginPage Component
 * This component renders the login page which includes an introduction, login form, and registration form.
 */
const LoginPage = () => {
    // State to manage the active button (authentication or register)
    const [activeButton, setActiveButton] = useState("authentication");

    // Function to update the active form based on user interaction
    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    return (
        <div className="login-page">
            <Introduction className="intro-login" activeButton={activeButton} handleButtonClick={handleButtonClick}/> 
            <div className="cards"><img src={cards} alt="Card visuals" /></div>  
            {/* Conditional rendering of either the Login or Register form based on activeButton state */}
            {activeButton === "authentication" && <LoginSection className="login-section"/>}
            {activeButton === "register" && <Register className="login-section"/>}
        </div>
    );
}

// Exporting the LoginPage component for use in other parts of the application
export default LoginPage;
