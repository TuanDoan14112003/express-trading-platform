/*
filename: HistoryTable.jsx
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 03/09/2023
*/

import "./HistoryTable.css"
function HistoryTable() {
    const transactionHistory = [ // Sample transaction history data
        {
            id: 1,
            date: "02/09/2023",
            title: "Product 1",
            seller: "Tuan Doan",
            price: 200,
            status: "valid",
        },
        {
            id: 2,
            date: "01/09/2023",
            title: "Product 2",
            seller: "Tuan Doan",
            price: 100,
            status: "pending",
        },
        {
            id: 3,
            date: "03/09/2023",
            title: "Product 3",
            seller: "Tuan Doan",
            price: 150,
            status: "invalid",
        }
    ]
    return (
        // Main container for the transaction history table
        <div className="table-container">
            <table>
                {/* Table header */}
                <thead>
                    <tr>
                        <th>Seller</th>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                {/* Table body */}
                <tbody>
                    {
                        // Mapping over the transactionHistory array to render each transaction row
                        transactionHistory.map((transaction) => {
                            return (
                                <tr>
                                    <td data-label="Seller">{transaction.seller}</td>
                                    <td data-label="Date">{transaction.date}</td>
                                    <td data-label="Product">{transaction.title}</td>
                                    <td data-label="Price">{transaction.price} ETH</td>
                                    <td data-label="Status">
                                        <p className={"status status-" + transaction.status}>
                                            {transaction.status.toUpperCase()}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

// Export the HistoryTable component for use in other parts of the application
export default HistoryTable;