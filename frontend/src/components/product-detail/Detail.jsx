/*
filename: Detail.jsx
Author: Gia Hung Tran
StudentId: 103509199
last date modified: 03/09/2023
*/
import React from "react";
import Description from "./Description";
import LoadingSpinner from "../common/LoadingSpinner";
import ProductImage from "../../assets/product-image.jpg";
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

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(()  => {
        // The API endpoint
        const fetchData = async () => {
            const apiUrl = `http://localhost:8000/api/assets/${id}`;
            try {
                const response = await axios.get(apiUrl);
                var temp = response.data.data.digital_asset;
                await fetchSeller(temp);
                setProduct(temp); 
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
                console.log(err);
            }
        };
        const fetchSeller = async (product) =>{
            const url = `http://localhost:8000/api/auth/users/${product.owner_id}`;
            try {
                const response = await axios.get(url);
                var name = response.data.data.user.first_name + " " + response.data.data.user.last_name
                product["seller_name"] = name;
            } catch (err) {
                setError(err);
                setLoading(false);
                console.log(err);
                return null;
            };
        }
        fetchData();
        console.log(product)
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
                {product.image_name!==null && <img alt="product" src={product.image_name} />}
                {product.image_name===null && <img alt="product" src={ProductImage} />}
            </div>
            
            {/* Product Description */}
            <Description 
                className="description-tag" 
                id={product.id} 
                name={product.name} 
                category={product.category}
                price={product.price} 
                seller={product.seller_name} 
                description= {product.description} 
                date = {product.creation_date}
            />
        </div>
    );
}

export default Detail;
