/*
filename: Detail.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 03/09/2023
*/
import React from "react";
import Description from "./Description";
import "./Detail.css";
import ImageTest from "../../assets/product-image.jpg";
import {useParams} from "react-router-dom";


/**
 * Detail Component
 * 
 * This component displays the details of a product. It shows the product's image and its description.
 */
const Detail = () => {
    // Extracting the product ID from the URL parameters
    const { id } = useParams();

    // Mock product data for demonstration purposes
    const product = {
        id: id,
        title: "New Product",
        seller: "Tuan Doan",
        price: 200
    }

    return (
        <div className="wrapper-info">
            {/* Product Image */}
            <div className="container-img">
                <img src={ImageTest} alt="Product" />
            </div>
            
            {/* Product Description */}
            <Description 
                className="description-tag" 
                id={product.id} 
                name={product.title} 
                price={product.price} 
                seller={product.seller} 
            />
        </div>
    );
}

export default Detail;
