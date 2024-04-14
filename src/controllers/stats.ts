import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import {
  calculatePercentage,
  calculatePropertyTotal,
  getChartData,
  getInventories,
} from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};
  const KEY = "admin-stats";

  if (myCache.has(KEY)) stats = JSON.parse(myCache.get(KEY) as string);
  else {
    const today = new Date();
    // REVENUE & TRANSACTION
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    // REVENUE & TRANSACTION END

    // WIDGET START
    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    // thismonth 2 product sell and last month 4 product sell
    // 2-4 = 2
    // 2/4 -> 4 means last month sell product
    // 2/4*100 = -50% Decreased compaire with last month
    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // User
    const thisMonthUsersPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    // Order
    const thisMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    // WIDGET START END

    // REVENUE & TRANSACTION
    const lastSixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    // TOP 5 TRANSACTION
    const latestTransactionsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(5);

    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      // REVENUE & TRANSACTION
      lastSixMonthOrders,
      // INVENTORY
      categories,
      // GENDER RATIO
      femaleUsersCount,
      // TOP 5 TRANSACTION
      latestTransactions,
    ] = await Promise.all([
      thisMonthProductsPromise,
      thisMonthUsersPromise,
      thisMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      // REVENUE & TRANSACTION
      lastSixMonthOrdersPromise,
      // INVENTORY
      Product.distinct("category"),
      // GENDER RATIO
      User.countDocuments({ gender: "female" }),
      // TOP 5 TRANSACTION
      latestTransactionsPromise,
    ]);
    // WIDGET PERCENT START
    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + order.total || 0,
      0
    );

    const count = {
      revenue,
      product: productsCount,
      user: usersCount,
      order: allOrders.length,
    };
    // WIDGET START PERCENT END

    // REVENUE & TRANSACTION
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthyRevenue = new Array(6).fill(0);
    const sixMonths = 6;

    lastSixMonthOrders.forEach((order) => {
      // order date
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      // last 6 month made order

      if (monthDiff < sixMonths) {
        // count   // why -1 month start from zero
        orderMonthCounts[sixMonths - monthDiff - 1] += 1;
        // revenue
        orderMonthyRevenue[sixMonths - monthDiff - 1] += order.total;
      }
    });

    // INVENTORY START

    const categoryCount = await getInventories({ categories, productsCount });

    // INVENTORY END

    // GENDER RATIO
    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };

    // TOP 5 TRANSACTION
    const modifiedLatestTransaction = latestTransactions.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));

    stats = {
      changePercent,
      count,
      // REVENUE & TRANSACTION
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthyRevenue,
      },
      // INVENTORY
      categoryCount,
      // GENDER RATIO
      userRatio,
      // TOP 5 TRANSACTION
      latestTransactions: modifiedLatestTransaction,
    };
 
    myCache.set(KEY, JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = TryCatch(async (req, res) => {
  let charts;
  const KEY = "admin-pie-charts";

  if (myCache.has(KEY)) {
    charts = JSON.parse(myCache.get(KEY) as string);
  } else {
    const allOrderPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      productOutOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    // PRODUCT CATEGORIES RATIO
    const productCategories = await getInventories({
      categories,
      productsCount,
    });

    // STOCK AVAILABILITY
    const stockAvailability = {
      inStock: productsCount - productOutOfStock,
      outOfStock: productOutOfStock,
    };

    // REVENUE DISTRIBUTION

    const grossIncome = calculatePropertyTotal(allOrders, "total");

    const discount = calculatePropertyTotal(allOrders, "discount");

    const productionCost = calculatePropertyTotal(allOrders, "shippingCharges");

    const burnt = calculatePropertyTotal(allOrders, "tax");

    const howMuchPercent = Number(process.env.HOW_MUCH_PERCENTAGE);

    const marketingCost = Math.round(grossIncome * (howMuchPercent / 100));

    const netMargin =
      grossIncome - marketingCost - discount - burnt - productionCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt, // kitna paisa west hua hai barbad hua hai
      marketingCost,
    };

    // USERS AGE GROUP
    const usersAgeGroup = {
      teen: allUsers.filter((user) => user.age < 20).length,
      adult: allUsers.filter((user) => user.age >= 20 && user.age <= 40).length,
      old: allUsers.filter((user) => user.age >= 40).length,
    };

    // ADMIN AND CUSTOMER
    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFullfillment,
      productCategories,
      stockAvailability,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };

    myCache.set(KEY, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getBarCharts = TryCatch(async (req, res) => {
  let charts;
  const KEY = "admin-bar-charts";

  if (myCache.has(KEY)) {
    charts = JSON.parse(myCache.get(KEY) as string);
  } else {
    const today = new Date();
    const sixMonths = 6;
    const twelveMonths = 12;

    const sixMonthsAgoDate = new Date();
    sixMonthsAgoDate.setMonth(sixMonthsAgoDate.getMonth() - 6);

    const twelveMonthsAgoDate = new Date();
    twelveMonthsAgoDate.setMonth(twelveMonthsAgoDate.getMonth() - 12);

    const lastSixMonthProductsPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgoDate,
        $lte: today,
      },
    }).select("createdAt");

    const lastSixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgoDate,
        $lte: today,
      },
    }).select("createdAt");

    const lastTwelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgoDate,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      lastSixMonthProductsPromise,
      lastSixMonthUsersPromise,
      lastTwelveMonthOrdersPromise,
    ]);
    const productCounts = getChartData({
      length: sixMonths,
      today,
      docArr: products,
    });
    const usersCounts = getChartData({
      length: sixMonths,
      today,
      docArr: users,
    });
    const ordersCounts = getChartData({
      length: twelveMonths,
      today,
      docArr: orders,
    });

    charts = {
      products: productCounts,
      users: usersCounts,
      orders: ordersCounts,
    };

    myCache.set(KEY, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getLineCharts = TryCatch(async (req, res) => {
  let charts;
  const KEY = "admin-line-charts";

  if (myCache.has(KEY)) {
    charts = JSON.parse(myCache.get(KEY) as string);
  } else {
    const today = new Date();
    const twelveMonths = 12;

    const twelveMonthsAgoDate = new Date();
    twelveMonthsAgoDate.setMonth(twelveMonthsAgoDate.getMonth() - twelveMonths);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgoDate,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt","discount","total"]),
    ]);

    const productCounts = getChartData({
      length: twelveMonths,
      today,
      docArr: products,
    });

    const usersCounts = getChartData({
      length: twelveMonths,
      today,
      docArr: users,
    });

    const discount = getChartData({
      length: twelveMonths,
      today,
      docArr: orders,
      property: "discount",
    });

    const revenue = getChartData({
      length: twelveMonths,
      today,
      docArr: orders,
      property: "total",
    });

    charts = {
      users: usersCounts,
      products: productCounts,
      discount,
      revenue,
    };

    myCache.set(KEY, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

/*

else {
    const today = new Date();

    const endOfThisMonth = today;

    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

     const startOfLastMonth = new Date(today.getFullYear(),today.getMonth() - 1);
    
     today date is 8 april last month means martch 31
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const thisMonthProducts = await Product.find({
        createdAt:{
            $gte:startOfThisMonth,
            $lte: endOfThisMonth
        }
    });
   }



   // PRODUCTS PERCENTANCE THIS MONTH AND LASTMONT
    const productsChangePercentage = calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      );
    
    // USERS PERCENTANCE THIS MONTH AND LASTMONT
    const usersChangePercentage = calculatePercentage(
      thisMonthUsers.length,
      lastMonthUsers.length
    );

     // ORDERS PERCENTANCE THIS MONTH AND LASTMONT
     const ordersChangePercentage = calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      );
     
      stats = {
        productsChangePercentage,
        usersChangePercentage,
        ordersChangePercentage
      }
   */
