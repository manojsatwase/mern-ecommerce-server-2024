import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code:{
         type: String,
         required: [true, "Please enter the Coupon Code"],
         unique: true
    },
    amount: {
        type: Number,
        required: [true, "Please enter the Discount Amount"],
    }
})

export const Coupon = mongoose.model("Coupon",couponSchema);



/*

const couponSchema = new mongoose.Schema({
  coupons: [
    {
      code: {
        type: String,
        required: [true, "Please enter the Coupon Code"],
        unique: true,
      },
      amount: {
        type: Number,
        required: [true, "Please enter the Discount Amount"],
      },
    },
  ],
});

export const Coupon = mongoose.model('Coupon', couponSchema);

import { Request, Response, NextFunction } from 'express'; // Import necessary types

// Assuming you have defined your Coupon model and other dependencies

export const createCoupon = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { code, amount } = req.body; // Assuming you send code and amount in the request body

  try {
    if (!code || !amount) {
      return next(new ErrorHandler("Please provide both code and amount", 400));
    }

    // Check if the coupon code already exists
    const existingCoupon = await Coupon.findOne({ 'coupons.code': code });
    if (existingCoupon) {
      return next(new ErrorHandler("Coupon code already exists", 400));
    }

    // Create a new coupon object
    const newCoupon = {
      code,
      amount,
    };

    // Add the new coupon object to the existing coupons array in the database
    const updatedCoupon = await Coupon.findOneAndUpdate(
      {},
      { $push: { coupons: newCoupon } },
      { new: true, upsert: true }
    );

    return res.status(201).json({
      success: true,
      message: `Coupon ${code} created successfully`,
      data: updatedCoupon,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to create coupon", 500));
  }
});


*/