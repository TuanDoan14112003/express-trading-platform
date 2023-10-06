const express = require("express");
const authenticationController = require("./../controllers/AuthenticationController");
const router = express.Router();
router.route("/users/:id")
    .get(authenticationController.getOneUser);

router.route("/register")
    .post(authenticationController.register)

router.route("/login")
    .post(authenticationController.login)


module.exports = router;