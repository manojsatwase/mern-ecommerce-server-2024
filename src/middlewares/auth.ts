import { User } from "../models/user.js";
import { TryCatch } from "./error.js";
import ErrorHandler from "./utility-class.js";

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;

    if (!id) {
        return next(new ErrorHandler("Access denied: Missing user ID", 401));
    }

    const user = await User.findById(id);

    if (!user) {
        return next(new ErrorHandler("Access denied: User not found.", 404));
    }

    if (user.role !== "admin") {
        return next(new ErrorHandler("Access denied: User is not authorized to perform this action.", 403));
    }
    next();
});



// "api/v1/user/:id" 
// "api/v1/user/ssda" // req.params.id
// "api/v1/user/ssda?key=24" // req.query.key
