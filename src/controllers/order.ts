import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";

import { invalidatesCatch, reduceStock } from "../utils/features.js";
import ErrorHandler from "../middlewares/utility-class.js";
import { myCache } from "../app.js";
import { Order } from "../models/order.js";

export const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const key = `my-orders-${user}`;

  let orders = [];

  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  }
  if (typeof user === "string") {
    // Explicitly check if user is a string
    orders = await Order.find({ user });
    myCache.set(key, JSON.stringify(orders));
  } else {
    return next(new ErrorHandler("Invalid User ID", 400));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const allOrders = TryCatch(async (req, res, next) => {
  const key = `all-orders`;

  let orders = [];

  if (myCache.has(key)) {
    orders = JSON.parse(myCache.get(key) as string);
  } else {
    orders = await Order.find().populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `order-${id}`;

  let order;

  if (myCache.has(key)) {
    order = JSON.parse(myCache.get(key) as string);
  } else {
    order = await Order.findById(id).populate("user", "name");

    if (!order) {
      return next(new ErrorHandler("Order Not Found", 404));
    }

    myCache.set(key, JSON.stringify(order));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total) {
      return next(new ErrorHandler("Please Enter All Fileds", 400));
    }

   const order =  await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });

    // stock reduce stock
    await reduceStock(orderItems);

    // re-validate cache
    // when we order then product me stock reduce hongo that why product ko bhi catch remove karna hongo
    // let assume new order place kiya when we change myorder ,
    // ya mai order karu ya phir mera order update hua ho ,
    // ya mera order delete hua ho
    invalidatesCatch({
      product: true,
      order: true,
      admin: true,
      userId: user, 
      productId:order.orderItems.map(i=>String(i.productId))
    });

    return res.status(201).json({
      success: true,
      message: "Order Placed Succssfully",
    });
  }
);

export const processOrder = TryCatch(async (req, res, next) => {
  // order id
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;
    default:
      order.status = "Delivered";
      break;
  }
  await order.save();
  // re-validate cache
  // when we order then product me stock reduce hongo that why product ko bhi catch remove karna hongo
  invalidatesCatch({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: "Order Processed Succssfully",
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  await order.deleteOne();
  // re-validate cache
  // when we order then product me stock reduce hongo that why product ko bhi catch remove karna hongo
  invalidatesCatch({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: "Order Deleted Succssfully",
  });
});
