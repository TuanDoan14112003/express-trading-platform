/*
filename: LoginSection.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 03/09/2023
*/
// Required Libraries and Modules
import React, { useState } from "react";
import "./LoginSection.css";
import { Link, useNavigate } from "react-router-dom";

/**
 * LoginSection Component
 * 
 * This component provides a user interface for logging into the application.
 * It contains input fields for the username and password, a "Remember me" checkbox, 
 * and a button to submit the login form.
 */
const LoginSection = () => {
    // Hooks
    const navigate = useNavigate(); // Hook from react-router for programmatic navigation
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false,
    });

    /**
     * Handle input changes and update the formData state.
     * 
     * @param {Object} evt - The event object from the input field.
     */
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    /**
     * Toggle the state of the "Remember me" checkbox.
     */
    const handleCheckboxChange = () => {
        setFormData(prevState => ({ ...prevState, rememberMe: !prevState.rememberMe }));
    };

    /**
     * Handle the form submission.
     * For the purpose of this example, it redirects the user to the marketplace.
     */
    const handleSubmit = () => {
        navigate("/marketplace");
    };

    return (
        <div className="form-container" id="login-form">
            <h2>Account Login</h2>
            {/* Username Input */}
            <label className="label-form" htmlFor="username">Username</label>
            <input className="ipt-form"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                name="username"
                id="username"
            />
            {/* Password Input */}
            <label className="label-form" htmlFor="password">Password</label>
            <input className="ipt-form"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                id="password"
                name="password"
            />
            {/* Remember Me Checkbox and Forgot Password Link */}
            <div className="wrapper-option">
                <div className="remember">
                    <input 
                        type="checkbox" 
                        id="rememberMe" 
                        name="rememberMe"
                        checked={formData.rememberMe} 
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                </div> 
                <Link to="/login">Forgot Password?</Link>
            </div>
            {/* Login Button */}
            <button className="btn-submit" onClick={handleSubmit}>Login to your account</button>
        </div>
    );
}

export default LoginSection;
