/*
filename: NavBar.jsx
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 03/09/2023
*/
import Logo from "../../assets/logo.png";
import FilterIcon from "../../assets/filter.svg"
import "./NavBar.css"
import Filter from "./Filter";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
function NavBar() {
    const [isFilterClicked, setFilterClicked] = useState(false); // State for handling filter click
    const [isMenuActive,setMenuActive] = useState(false); // State for handling mobile menu activation
    const [bgColor, setBgColor] = useState('transparent');  // State for handling navbar background color on scroll

    useEffect(() => { // useEffect hook to add a scroll event listener
        const handleScroll = () => {
            if (window.scrollY > 50) { // Change navbar background color based on scroll position
                setBgColor('rgba(45,34,65,0.7)');
            } else {
                setBgColor('transparent');
            }
        };

        // Adding the scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])
    return (
        <>
            <header>
                 {/* Main navbar container */}
                <div className="navbar" style={{ backgroundColor: bgColor }}>
                    <Link to="/marketplace"><img src={Logo}  alt="Website logo"/></Link> {/* Logo */}

                    <input placeholder="Search digital assets" className="search-input" type="text"/> {/* Search input */}


                    <img onClick={() => setFilterClicked(true)} className="filter-icon" src={FilterIcon} alt="" /> {/* Filter icon */}

                    <nav className="links"> {/* Navigation links for desktop */}
                        <Link to="/login">Login</Link>
                        <Link to="/marketplace">Market</Link>
                        <Link to="/history">History</Link>
                        <Link to="/create-product">Sell a product</Link>
                        <Link to="/cart">Cart</Link>
                    </nav>
                     {/* Hamburger menu button for mobile */}
                    <button onClick={(event) => setMenuActive(!isMenuActive)} className={"hamburger" + (isMenuActive ? " is-active": "")}>
                        <div className="bar"></div>
                    </button>

                </div>
            </header>
            {/* Navigation links for mobile */}
            <nav className={"mobile-navbar" + (isMenuActive ? " is-active" : "")}>
                <Link onClick={() => setMenuActive(false)} to="/login">Login</Link>
                <Link onClick={() => setMenuActive(false)} to="/marketplace">Market</Link>
                <Link onClick={() => setMenuActive(false)} to="/history">History</Link>
                <Link onClick={() => setMenuActive(false)} to="/create-product">Sell a product</Link>
                <Link onClick={() => setMenuActive(false)} to="/cart">Cart</Link>
            </nav>
           <Filter clicked={isFilterClicked} setFilter={setFilterClicked} /> {/* Filter component */}
        </>

    )
}

export default NavBar;