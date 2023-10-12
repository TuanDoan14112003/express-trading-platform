/*
* File name: Cart.jsx
* Author: Dang Khanh Toan Nguyen
* StudentID: 103797499
* Last date modified: 03/09/2023
* */
import "./Profile.css"
import ProductList from "../marketplace/ProductList";
import Button from "../common/Button";
import {useState, useEffect} from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router";
import Error404 from "../../assets/error-404.png";
import DepositForm from "./DepositForm";
/*
* Cart.jsx Component
* This component allows users review and finalize their selected assets before confirming their purchases.
* It lists the Ethereum assets that users have added to their cart and displays the total price.
* Users can check out to complete their purchases.*/


function Profile() {
    // State to control the visibility of the CheckoutForm component
    const [depositForm, setDepositForm] = useState(false);
    const [cookies, setCookie] = useCookies(["user"]);
    const [userData,setUserData] = useState(null);
    const [balance, setBalance] = useState(800);
    const [numAssets, setNumAssets] = useState(0);
    const navigate = useNavigate();
    const isAuthenticated = () => {
        return cookies.jwt_token ? true : false;
    };
    const [authStatus, setAuthStatus] = useState(isAuthenticated());
    const config = {
        headers: { Authorization: `Bearer ${cookies.jwt_token}` }
    };
    const fetchBalance = async () => {
        const res_balance = await axios.get("http://localhost:8000/api/users/balance", config);
        setBalance(res_balance.data.data.balance);
    };
    useEffect(() => {
        if(isAuthenticated()){
            console.log("hello")
           
           
            const fetchUserAsset = async () =>{
                const res_profile = await axios.get("http://localhost:8000/api/users/profile",config);
                setUserData(res_profile.data.data.user);
                setNumAssets(res_profile.data.data.user.digital_assets.length )
            }
            fetchBalance();
            fetchUserAsset();
        }
    }, [depositForm]);
    if(!authStatus){
        return (
            <div className="center-screen">
                <h1>You need to login to access this page!</h1>
                <button onClick={()=>{navigate("/login")}}>Login</button>
            </div>
        )
    }
    return (
        <div className="cart">
            <div className="cart-body">
                <h1>Your Profile</h1>
                <h2>Balance: {balance} ETH</h2>
                {userData && userData.digital_assets.length !== 0 && <ProductList productList={userData.digital_assets} />}
                {userData && userData.digital_assets.length === 0&& 
                <div className="center-screen-profile">
                    <img src={Error404} alt="" />
                    <h2 className="error-heading">There is no asset available</h2>
                </div>}
                <div className="btn-container">
                    <Button onClick={() => setDepositForm(true)}  className="btn-deposit">Deposit</Button>
                </div>               
             <DepositForm fetchBalance={fetchBalance} setDepositForm={setDepositForm} opened={depositForm}/>
            </div>
        </div>
    )
}

export default Profile;