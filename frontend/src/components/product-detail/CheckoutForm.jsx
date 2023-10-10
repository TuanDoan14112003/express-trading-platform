/*
* File name: CheckoutForm.jsx
* Author: Dang Khanh Toan Nguyen
* StudentID: 103797499
* Last date modified: 03/09/2023
* */
import Input from "../common/Input";
import "./CheckoutForm.css";
import Button from "../common/Button";
function CheckoutForm({opened, setCheckoutForm}) {
    return opened ? (
        <div className="checkout-form">
            <form>
                <Input type="text" name="first-name" label="First Name"/>
                <Input type="text" name="last-name" label="Last Name"/>
                <Input type="text" name="address" label="Address"/>
                <div>
                    <Button onClick={() => setCheckoutForm(false)} className="cancel-button">Cancel</Button>
                    <Button className="purchase-button" >Purchase</Button>
                </div>


            </form>
        </div>
    ): "";
}

export default CheckoutForm;