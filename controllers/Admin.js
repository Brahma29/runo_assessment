import Admin from "../models/Admin.js";
import { tokenGenerator } from "../utils/tokenGenerator.js";

export const AdminLogin = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ username: 'admin' });
        if (!admin) {
            return res.status(401).json({ message: 'Admin credentials not found' });
        }

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(401).json({ message: 'Username or password is missing' });
        }

        if (username !== admin.username || password !== admin.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = tokenGenerator({ isAdmin: true });

        return res.status(200).json({ success: true, token })
    } catch (error) {
        next(error)
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        let query = {};
        const { age, pincode, vaccinationStatus, page = 1, limit = 10 } = req.query;

        if (age) {
            query.age = age;
        }
        if (pincode) {
            query.pincode = pincode;
        }
        if (vaccinationStatus) {
            query.vaccinationStatus = vaccinationStatus;
        }

        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);

        const skip = (pageNumber - 1) * pageSize;

        const users = await User.find(query).skip(skip).limit(pageSize);

        const totalCount = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            count: users.length,
            totalCount: totalCount,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCount / pageSize),
            data: users,
        });
    } catch (error) {
        next(error);
    }
};