const jwt = require('jsonwebtoken');
const TOKEN_SECRET = require("./../configs/JwtConfig").TOKEN_SECRET;

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({
        status: "fail",
        message: "you must provide access token"
    })

    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.status(403).json({
            status: "fail",
            message: "the access token is not correct"
        })

        req.user = user
        console.log(req.user)
        next()
    })
}

