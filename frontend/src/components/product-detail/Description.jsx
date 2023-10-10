/*
filename: Description.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 03/09/2023
*/
// React component for the product description section
import React, {useState} from "react";
import "./Description.css";
import {Link} from "react-router-dom";
import Button from "../common/Button";
import CheckoutForm from "./CheckoutForm";

// Description component receives product details as props
const Description = ({id,date, name, price, category, seller, description = "lorem"}) => {
    const [checkoutForm, setCheckoutForm] = useState(false);
    return (
        // Main container for the product description
        <div className="wrapper-description">
             {/* Container for product name and price */}
            <div className="container-brief">
                <div className="item-name"> {name} ({category}) </div>
                <div className="item-price"> {price} WEI</div>
            </div>
             {/* Product description and seller details */}
            <div className="item-description"> 
                <div className="item-owner">Seller: {seller}</div>
                <div className="item-owner">Created Date: {date}</div>
                {description} 
            </div>
             {/* Buy button container */}
            <div className="container-button">
                <Button onClick={() => setCheckoutForm(true)}>Buy</Button>
            </div>
            <CheckoutForm setCheckoutForm={setCheckoutForm} opened={checkoutForm}/>
        </div>
    );
}

export default Description;
