const jwt  = require("jsonwebtoken");

// Create Jwt
exports.CreateJwtToken = (payload) => {
    return jwt.sign({
        payload
    }, process.env._JWT_SECRET_KEY, {
        expiresIn:"30d"
    })
}