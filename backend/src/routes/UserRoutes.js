const express = require("express");
const transactionController = require("./../controllers/TransactionController");
const userController = require("./../controllers/UserController");
const JwtMiddleware = require("./../middlewares/JwtMiddleware");

const router = express.Router();

// router.route("/:id")
//     .get(userController.getOneUser);

router.route("/profile/transactions")
    .get(JwtMiddleware.authenticateToken,transactionController.getAllTransactions);

router.route("/profile")
    .get(JwtMiddleware.authenticateToken,userController.getCurrentUser);




module.exports = router;