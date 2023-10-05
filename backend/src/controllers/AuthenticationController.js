const User = require("./../models/User");
const jwtUtils = require("./../utils/JwtUtils");
exports.register = async (req,res) => {

    try {
        await User.getRegisterValidationSchema().validateAsync(req.body);
    } catch (error) {
        let errorMessage = error.details.map(err => err.message.replace(/"/g,'')).join(", ");
        return res.status(400).json({
            status: "fail",
            message: errorMessage
        })
    }


    const user = new User(req.body.first_name,req.body.last_name,req.body.email,req.body.password);

    User.register(user, (err,data) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({
                    status: "fail",
                    message: "An user with the email already exists"
                })
            } else {
                return res.status(500).json({
                    status: "error",
                    message: "cannot register a new user"
                })
            }
        }
        return res.status(200).json({
            status: "success",
            data : {
                user: data,
                access_token: jwtUtils.generateAccessToken(data.user_id,data.email)
            }
        })
    });
}

exports.login = async (req,res) => {
    try {
        await User.getLoginValidationSchema().validateAsync(req.body);
    } catch (error) {
        let errorMessage = error.details.map(err => err.message.replace(/"/g,'')).join(", ");
        return res.status(400).json({
            status: "fail",
            message: errorMessage
        })
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findUserByEmail(email,(err, data) => {

        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Server error: cannot login"
            })
        }

        if (data.length === 0 || data[0].password !== password) {
            return res.status(404).json({
                status: "error",
                message: "Wrong detail"
            })
        }
        const user = data[0];

        return res.status(200).json({
            status: "success",
            data : {
                access_token: jwtUtils.generateAccessToken(user.user_id,user.email)
            }
        })

    })

}