/*
File name: Marketplace.jsx
Author: Anh Tuan Doan
Student ID: 103526745
Last date modified: 02/09/2023
 */
import "./Marketplace.css";
import FilterIcon from "../../assets/filter.svg";
import LoadingSpinner from "../common/LoadingSpinner";
import ProductList from "./ProductList";
import {useState, useEffect} from "react";
import Filter from "../common/Filter";
import Error404 from "../../assets/error-404.png";
import axios from 'axios';

function Marketplace() {
    // State to manage the visibility of the filter
    const [isFilterClicked, setFilterClicked] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // The API endpoint
        const apiUrl = 'http://localhost:8000/api/assets/';
        axios.get(apiUrl)
            .then(response => {
                setData(response.data.data.digital_assets);
                setLoading(false);
                console.log(data);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
                console.log(err);
            });
    }, []); // Empty dependency array means this useEffect runs once when component mounts

    if(loading)
    {
        return  <div className="center-screen">
                    <LoadingSpinner/>
                    <h1>Loading ...</h1>
                </div>;
    }
    if(error){
        return <div className="center-screen">
        <img src={Error404} alt="" />
        <h1>{error.response.data.message}</h1>
    </div>;
    }
    return (
        // Main container for the marketplace
        <div className="marketplace">
            <div className="marketplace-body">
                <div className="container">
                    {/* Marketplace title */}
                    <h1>The Marketplace</h1>
                    {/* Filter icon which, when clicked, opens the filter */}
                    <img className="icon-filter" onClick={() => setFilterClicked(true)} src={FilterIcon} alt="Filter Icon" />
                </div>
                {/* Rendering the list of products */}
                {loading && <p>Loading...</p>}
                {!loading && <ProductList productList={data} />}
            </div>
            {/* Filter component */}
            <Filter clicked={isFilterClicked} setFilter={setFilterClicked} />
        </div>
    );
}

// Export the Marketplace component for use in other parts of the application
export default Marketplace;