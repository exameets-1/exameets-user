import { User } from "../models/User.js";
import { catchAsync } from "@/lib/middlewares/catchAsync.js";
import ErrorHandler from "@/lib/middlewares/error.js";
import jwt from "jsonwebtoken"

export const isAuthenticated = catchAsync(async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return next(new ErrorHandler("Please login to access this resource", 401));
        }
        console.log(process.env.JWT_SECRET_KEY);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            algorithms: ["HS256"]
        });
        
        const user = await User.findById(decoded._id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        req.user = user;
        next();

    } catch (error) {

        if (error.name === 'JsonWebTokenError') {
            return next(new ErrorHandler("Invalid token", 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorHandler("Token expired", 401));
        }

        return next(new ErrorHandler("Authentication failed", 401));
    }
});