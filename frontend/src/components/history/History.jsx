/*
filename: History.jsx
Author: Anh Tuan Doan
StudentId: 103526745
last date modified: 03/09/2023
*/
import HistoryTable from "./HistoryTable";

// This component serves as a wrapper for displaying the transaction history
function History() {
    return (
        // Main container for the transaction history section
        <div className="history">
            {/* Title for the transaction history section */}
            <h1>Transaction History</h1>
            {/* Rendering the HistoryTable component to display the list of transactions */}
            <HistoryTable/>
        </div>
    );
}

// Export the History component for use in other parts of the application
export default History;