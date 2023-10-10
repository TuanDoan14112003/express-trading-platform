const Transaction = require("./../models/Transaction");

exports.getAllTransactions = async (req,res) => {
    console.log(req.user.id);
    Transaction.getAllTransactions(req.user.id, (err,data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot view transactions"
            })
        }
        return res.status(200).json({
            status: "success",
            data: {
                transactions: data
            }
        })
    })
}