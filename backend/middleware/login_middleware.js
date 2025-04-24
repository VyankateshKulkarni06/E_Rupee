const jwt = require('jsonwebtoken');
const secret = require("../secret"); 

function UserVerification(req, res, next) {
    const token = req.header('token')?.split(' ')[1]; 


    if (!token) {
        return res.status(403).json({ msg: "Access denied. No token provided." });
    }

    try {
    
        const decoded = jwt.verify(token, secret);
        req.user = decoded; 
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ msg: "Token is not valid." });
    }
}

module.exports = UserVerification;