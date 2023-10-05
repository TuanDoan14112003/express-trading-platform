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
import axios from 'axios';
const productList = [ // Sample product list data
    {
        id: 1,
        title: "Product 1",
        seller: "Tuan Doan",
        price: 200
    },
    {
        id: 2,
        title: "Product 2",
        seller: "Tuan Doan",
        price: 200
    },
    {
        id: 3,
        title: "Product 3",
        seller: "Tuan Doan",
        price: 200
    },
    {
        id: 4,
        title: "Product 4",
        seller: "Tuan Doan",
        price: 200
    },
    {
        id: 5,
        title: "Product 5",
        seller: "Tuan Doan",
        price: 200
    },
    {
        id: 6,
        title: "Product 6",
        seller: "Tuan Doan",
        price: 200
    },
    {
        id: 7,
        title: "Product 7",
        seller: "Tuan Doan",
        price: 200
    },
    {
        id: 8,
        title: "Product 8",
        seller: "Tuan Doan",
        price: 200
    },
]
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