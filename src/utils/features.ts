import mongoose, { Document } from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import {
  InvalidateCacheProps,
  OrderItemType,
  OrderPropertyType,
} from "../types/types.js";

export const connectDB = (url: string) => {
  mongoose
    .connect(url, {
      dbName: "Ecommerce_24",
    })
    .then((con) => console.log(`DB connected to ${con.connection.host}`))
    .catch((e) => console.log(e));
};

// cache re-validation
export const invalidatesCatch =  ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    if (typeof productId === "string") productKeys.push(`product-${productId}`);

    if (typeof productId === "object")
      productKeys.forEach((i) => productKeys.push(`product-${i}`));

    myCache.del(productKeys);
  }

  if (order) {
    const ordersKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    myCache.del(ordersKeys);
  }

  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
  }
};

export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");

    product.stock -= order.quantity;
    await product.save();
  }
};

// this formula is for relative percent change means
// change percent + previous value
// 300% of 2 is 6, so change is 6
// 6+2 = 8
export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  // if last month has zero us case me return kar denke this month * 100
  if (lastMonth === 0) return thisMonth * 100;
  const percentage = (thisMonth / lastMonth) * 100;
  return Number(percentage.toFixed(0));
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  // INVENTORY START          // field ke basis pe bhi count kar sakte hai
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });
  // INVENTORY END
  return categoryCount;
};

export const calculatePropertyTotal = (
  orders: OrderPropertyType[],
  property: keyof OrderPropertyType
) => {
  return orders.reduce((prev, order) => prev + (order[property] || 0), 0);
};

interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}

type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  today,
  docArr,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      // count   // why -1 month start from zero
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};
