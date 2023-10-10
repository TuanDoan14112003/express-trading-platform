const User = require("./../models/User");
exports.getOneUser =  (req,res) => {
    User.findUserById(req.params.id, (err,data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get the user"
            })
        }

        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the user"
            })
        }
        return res.status(200).json({
            status: "success",
            data : {
                user : data[0]
            }
        })
    })

}

exports.getCurrentUser = (req,res) => {
    User.findUserById(req.user.id, (err,data) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "cannot get profile"
            })
        }

        if (data.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "cannot find the user"
            })
        }
        return res.status(200).json({
            status: "success",
            data : {
                user : data[0]
            }
        })
    })
}