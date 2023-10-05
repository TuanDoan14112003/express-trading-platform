/*
filename: Register.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 03/09/2023
*/
// Importing necessary libraries and modules
import React, { useState } from "react";
import "./LoginSection.css";
import { useNavigate } from "react-router-dom";

/**
 * Register Component
 * 
 * This component provides a user interface for registering an account in the application.
 * It contains input fields for the username, password, and password confirmation, 
 * as well as a button to submit the registration form.
 */
const Register = () => {
    // Hook from react-router for programmatic navigation
    const navigate = useNavigate();

    // State to manage form data
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
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
     * Handle the form submission.
     * For the purpose of this example, it redirects the user to the marketplace after registration.
     */
    const handleSubmit = () => {
        navigate("/marketplace");
    };

    return (
        <div className="form-container" id="login-form">
            <h2>Account Register</h2>
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
            {/* Confirm Password Input */}
            <label className="label-form" htmlFor="confirmPassword">Confirm Password</label>
            <input className="ipt-form"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                id="confirmPassword"
                name="confirmPassword"
            />
            {/* Registration Button */}
            <button className="btn-submit" onClick={handleSubmit}>Register Account</button>
        </div>
    );
}

export default Register;
