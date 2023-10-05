/*
File name: Marketplace.jsx
Author: Anh Tuan Doan
Student ID: 103526745
Last date modified: 02/09/2023
 */
import "./Marketplace.css";
import FilterIcon from "../../assets/filter.svg";
import ProductList from "./ProductList";
import {useState} from "react";
import Filter from "../common/Filter";

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
                <ProductList productList={productList} />
            </div>
            {/* Filter component */}
            <Filter clicked={isFilterClicked} setFilter={setFilterClicked} />
        </div>
    );
}

// Export the Marketplace component for use in other parts of the application
export default Marketplace;