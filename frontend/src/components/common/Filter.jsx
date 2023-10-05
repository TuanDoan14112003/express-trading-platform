/*
* File name: Filter.jsx
* Author: Dang Khanh Toan Nguyen
* StudentID: 103797499
* Last date modified: 03/09/2023
* */

import "./Filter.css"
import React, { useState } from "react";
import { DatePicker } from "antd";
import Select from 'react-select'
import Button from "./Button";
/*
* Filters allow users to refine and customize their searches, making it easier to find the specific Ethereum assets they are interested in.
* Users can filter assets by category, price range, and date. It utilizes a dropdown menu, sliders, and a date picker to allow users to input filter criteria.
* This component is integrated into the Marketplace Page and Navigation Bar.
* */

// Options for the category filter dropdown
const options = [
    { value: 'category_1', label: 'Category 1' },
    { value: 'category_2', label: 'Category 2' },
    { value: 'category_3', label: 'Category 3' }
];
function Filter({clicked,setFilter}) {
    // State for date range picker
    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    // Handle date pickle
    function onChange1(date, dateString) {
        setDate1(date);
    }

    function onChange2(date, dateString) {
        setDate2(date);
    }
    // State for price range slider
    const [minPrice,setMinPrice] = useState(0);
    const [maxPrice,setMaxPrice] = useState(0);
    // Handle slider input and price selection
    function handleSliderInput(event) {
        const val = event.target.value;
        event.target.style.background = `linear-gradient(to right, #615DFA ${val}%, white ${val}%)`;

    }
    function handleMinSlider(event) {
        handleSliderInput(event);
        setMinPrice(event.target.value);
    }

    function handleMaxSlider(event) {
        handleSliderInput(event);
        setMaxPrice(event.target.value);
    }
    // Return filter popup if clicked
    return clicked ? (
        <div className="filter-popup">
            <div className="filter-container">
                <div className="filter">
                    <h2>Filter</h2>
                    <div className="filter-item-container">
                        <h3>Price</h3>
                        <div className="slider-container">
                            <label htmlFor="min-price">Min</label>
                            <input defaultValue="0"  type="range" name="min-price" id="min-price" onInput={handleMinSlider}/>
                            <p>{minPrice} ETH</p>
                        </div>

                        <div className="slider-container">
                            <label htmlFor="max-price">Max</label>
                            <input defaultValue="0"  type="range" name="max-price" id="max-price" onInput={handleMaxSlider}/>
                            <p>{maxPrice} ETH</p>
                        </div>

                    </div>

                    <div  className="filter-item-container">
                        <h3>Date</h3>
                        <div  className="datepicker-container">
                            <DatePicker onChange={onChange1}/>
                            <p>To</p>
                            <DatePicker onChange={onChange2}/>
                        </div>
                    </div>

                    <div  className="filter-item-container">
                        <h3>Category</h3>
                        <div  className="category-container">
                            <p>Product Category: </p>
                            <Select
                                options={options}
                                placeholder={'Category'}
                                clearable={false}
                                styles={{
                                    option: (style, state) => ({
                                        ...style,
                                        color: state.isSelected ? 'white' : 'black',
                                        backgroundColor: state.isSelected ? '#3D5AF1' : 'white',
                                    }),
                                }}
                            />
                        </div>
                    </div>
                    <div className="buttons">
                        <Button onClick={() => setFilter(false)}>Apply</Button>
                        <Button onClick={() => setFilter(false)} className="cancel-button" >Cancel</Button>
                    </div>


                </div>

            </div>
        </div>
    ) : ''; // Return empty if it's not clicked
}

export default Filter;