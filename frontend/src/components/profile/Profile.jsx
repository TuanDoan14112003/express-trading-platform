/*
* File name: Cart.jsx
* Author: Dang Khanh Toan Nguyen
* StudentID: 103797499
* Last date modified: 03/09/2023
* */
import "./Profile.css"
import ProductList from "../marketplace/ProductList";
import Button from "../common/Button";
import {useState} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router";
/*
* Cart.jsx Component
* This component allows users review and finalize their selected assets before confirming their purchases.
* It lists the Ethereum assets that users have added to their cart and displays the total price.
* Users can check out to complete their purchases.*/

// Define product list that user have added to cart
const productList = [
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
    }
]
function Profile() {
    // State to control the visibility of the CheckoutForm component
    const [checkoutForm, setCheckoutForm] = useState(false);
    const [cookies, setCookie] = useCookies(["user"]);
    const [balance, setBalance] = useState(800);
    const navigate = useNavigate();
    const isAuthenticated = () => {
        return cookies.jwt_token ? true : false;
    };
    const [authStatus, setAuthStatus] = useState(isAuthenticated());
    if(!authStatus){
        return (
            <div className="center-screen">
                <h1>You need to login to access this page!</h1>
                <button onClick={()=>{navigate("/login")}}>Login</button>
            </div>
        )
    }
    const config = {
        headers: { Authorization: `Bearer ${cookies.jwt_token}`
    }
    };
    axios.get("http://localhost:8000/api/users/profile",config)
        .then(res=>{
            setBalance(res.data.data.user.balance);
        })    
    return (
        <div className="cart">
            <div className="cart-body">
                <h1>Your Profile</h1>
                <h2>Balance: {balance} WEI</h2>
                <ProductList productList={productList} />
                
                {/* <Button onClick={() => setCheckoutForm(true)}  className="checkout" >Checkout</Button> */}
            </div>
        </div>
    )
}

export default Profile;