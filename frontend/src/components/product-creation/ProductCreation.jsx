/*
filename: ProductCreation.jsx
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 03/09/2023
*/
import ProductForm from "./ProductForm";
import "./ProductCreation.css"
// ProductCreation component definition
function ProductCreation() {
    return (
        // Main container for the product creation section
        <div className="product-creation">
            {/* Heading for the product creation section */}
            <h1>Sell a new product</h1>
            {/* Embedding the ProductForm component to capture product details */}
            <ProductForm/>
        </div>
    );
}

// Export the ProductCreation component
export default ProductCreation;