const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const secret = process.env.JWT_SECRET || "change-me-in-development";

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
