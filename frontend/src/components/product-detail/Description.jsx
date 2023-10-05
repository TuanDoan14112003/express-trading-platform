/*
filename: Description.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 03/09/2023
*/
// React component for the product description section
import React from "react";
import "./Description.css";
import {Link} from "react-router-dom";
import Button from "../common/Button";

// Description component receives product details as props
const Description = ({id, title, price, seller}) => {
    return (
        // Main container for the product description
        <div className="wrapper-description">
             {/* Container for product name and price */}
            <div className="container-brief">
                <div className="item-name"> {"Product " + id} </div>
                <div className="item-price"> {price} ETH </div>
            </div>
             {/* Product description and seller details */}
            <div className="item-description"> 
                <div className="item-owner">Seller: {seller}</div>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio, et similique voluptatibus sapiente nostrum alias praesentium voluptas impedit odio fugiat error temporibus accusamus autem dolorum aperiam nam facere totam doloribus! 
            </div>
             {/* Buy button container */}
            <div className="container-button">
                <Link to="/cart"><Button>Buy</Button></Link>
            </div>
        </div>
    );
}

export default Description;
