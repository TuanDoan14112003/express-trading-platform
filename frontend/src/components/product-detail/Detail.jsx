/*
filename: Detail.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 03/09/2023
*/
import React from "react";
import Description from "./Description";
import LoadingSpinner from "../common/LoadingSpinner";
import { useState, useEffect } from "react";
import "./Detail.css";
import ImageTest from "../../assets/product-image.jpg";
import {useParams} from "react-router-dom";
import axios from "axios";

/**
 * Detail Component
 * 
 * This component displays the details of a product. It shows the product's image and its description.
 */
const Detail = () => {
    // Extracting the product ID from the URL parameters
    const { id } = useParams();

    // Mock product data for demonstration purposes
    // const product = {
    //     id: id,
    //     title: "New Product",
    //     seller: "Tuan Doan",
    //     price: 200
    // }
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // The API endpoint
        const apiUrl = `http://localhost:8000/api/assets/${id}`;
        axios.get(apiUrl)
            .then(response => {
                setProduct(response.data.data.digital_asset);
                setLoading(false);
                console.log(product.name);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
                console.log(err);
            });
    }, []); // Empty dependency array means this useEffect runs once when component mounts
    if(loading)
    {
        return <div className="center-screen">
        <LoadingSpinner/>
    </div>;
    }
    if(error){
        return <div className="center-screen">
                    <LoadingSpinner/>
                    <p className="error-message">Error: {error.message}</p>
                </div>;
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
                name={product.name} 
                price={product.price} 
                seller={product.seller} 
                description= {product.description} 
            />
        </div>
    );
}

export default Detail;
