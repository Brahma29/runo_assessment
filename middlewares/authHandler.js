import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const authHandler = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token is missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded.user;
        next();
    });
};

export const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res
                .status(401)
                .json({ message: "Authorization header is missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            if (!decoded.isAdmin) return res.status(403).json({ message: "Forbidden" });
            next();
        });
    } catch (error) {
        console.error("Error in isAdmin middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
