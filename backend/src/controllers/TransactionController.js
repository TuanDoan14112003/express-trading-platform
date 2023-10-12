const Transaction = require("./../models/Transaction");

exports.getAllTransactions = async (req,res) => {
    let transactions;
    try {
        transactions = await Transaction.getAllTransactions(req.user.id);
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: err
        })
    }
    return res.status(200).json({
        status: "success",
        data: {
            transactions: transactions
        }
    })
}