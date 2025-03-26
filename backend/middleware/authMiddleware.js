const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
    let token = req.header("Authorization");

    if (!token) {
        console.log(" No token provided");
        return res.status(401).json({ success: false, message: "Access denied, no token provided" });
    }

    try {
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }

        console.log(" Received Token:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(" Decoded Token:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        console.log("Token verification failed:", error.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
