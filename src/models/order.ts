import mongoose from "mongoose";

const shippingInfoSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "Please enter Address"],
  },
  city: {
    type: String,
    required: [true, "Please enter City"],
  },
  state: {
    type: String,
    required: [true, "Please enter State"],
  },
  country: {
    type: String,
    required: [true, "Please enter Country"],
  },
  pinCode: {
    type: Number,
    required: [true, "Please enter PinCode"],
    minlength: [6, "PinCode must be 6 digits"], 
  maxlength: [6, "PinCode must be 6 digits"], 
  },
});

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      type: shippingInfoSchema,
      required: true,
    },
    user: {
      type: String,
      ref: "User",
      required: [true, "Please provide User ID"],
    },
    subtotal: {
      type: Number,
      required: [true, "Please enter Subtotal"],
      min: [0, "Subtotal cannot be negative"],
    },
    tax: {
      type: Number,
      required: [true, "Please enter Tax"],
      min: [0, "Tax cannot be negative"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "Please enter Shipping Charges"],
      min: [0, "Shipping Charges cannot be negative"],
    },
    discount: {
      type: Number,
      required: [true, "Please enter Discount"],
      min: [0, "Discount cannot be negative"],
    },
    total: {
      type: Number,
      required: [true, "Please enter Total"],
      min: [0, "Total cannot be negative"],
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
    orderItems: [
        {
          name: {
          type: String,
          required: [true, "Please enter Name"]
         },
          photo: {
            type: String,
            required: [true, "Please enter Photo"]
          },
          price: {
            type: Number,
            required: [true, "Please enter Price"],
            min: [0, "Price cannot be negative"],
          },
          quantity: {
            type: Number,
            required: [true, "Please enter Quantity"],
            min: [1, "Quantity must be at least 1"],
          },
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Please provide Product ID"],
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

export const Order = mongoose.model("Order", orderSchema);
