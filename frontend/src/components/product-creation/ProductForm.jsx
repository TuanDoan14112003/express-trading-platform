/*
filename: ProductForm.jsx
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 03/09/2023
*/

// Importing required components and hooks
import Input from "../common/Input";
import "./ProductForm.css"
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ProductForm component definition
function ProductForm() {
    // Hook to navigate between routes
    const navigate = useNavigate();

    // Reference to the image input element
    const imageInputRef = useRef(null);

    // State to store the uploaded file's URL
    const [file, setFile] = useState();

    // Handler function for file upload
    function handleUpload(event) {
        // Create a URL for the uploaded file
        let url = URL.createObjectURL(event.target.files[0]);
        // Update the file state with the new URL
        setFile(url);
        console.log(url);
    }

    return (
        <form className="product-form" encType="multipart/form-data">
            {/* Display the uploaded image if available */}
            {file ? <img onClick={() => imageInputRef.current.click()} className="image-input" src={file} alt="preview" /> : ""}
            {/* Image input field */}
            <Input ref={imageInputRef} onChange={handleUpload} className={"image-input" + (file ? " hide" : "")} type="file" name="image" label="Upload a file" />

            {/* Text input fields for product details */}
            <div className="text-input">
                <Input type="text" name="name" label="Name" />
                <Input type="text" name="description" label="Description" />
                <Input type="number" name="price" label="Price" />
                {/* Submit button to navigate to the marketplace */}
                <input onClick={() => navigate("/marketplace")} type="submit" name="sell-button" value="Sell" />
            </div>
        </form>
    );
}

// Export the ProductForm component
export default ProductForm;
