import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../middlewares/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidatesCatch } from "../utils/features.js";
//import {faker} from '@faker-js/faker';

// Revalidate on New , Update , Delete Product & on New Order
export const getLatestProducts = TryCatch(async (req, res) => {
  const limitPerPage = Number(req.query.limit) || 5;
  let products;
  // when we create new product then we need to re-validate
  if (myCache.has("latest-products")) {
    products = JSON.parse(myCache.get("latest-products")!); // // ! or as string both are work
  } else {
    // accending 1 decending -1
    products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(limitPerPage);
    // store catch
    myCache.set("latest-products", JSON.stringify(products));
  }
  
  return res.status(200).json({
    success: true,
    products,
  });
});

// Revalidate on New , Update , Delete Product & on New Order
export const getAllCategories = TryCatch(async (req, res) => {
  let categories;

  if (myCache.has("categories")) {
    categories = JSON.parse(myCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

// Revalidate on New , Update , Delete Product & on New Order
export const getAdminProducts = TryCatch(async (req, res) => {
  let products;

  if (myCache.has("all-products")) {
    products = JSON.parse(myCache.get("all-products") as string);
  } else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;

  if (myCache.has(`product-${id}`)) {
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  } else {
    product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler("Product not Found", 404));
    }

    myCache.set(`product-${id}`, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) {
      return next(new ErrorHandler("Please add Photo", 400));
    }

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Deleted");
      });

      return next(new ErrorHandler("Please enter all Fileds", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLocaleLowerCase(),
      photo: photo.path,
    });

    // Revalidate
    invalidatesCatch({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  // Revalidate
  invalidatesCatch({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not Found", 404));
  }

  rm(product.photo!, () => {
    console.log("Product Phote Deleted");
  });

  await product.deleteOne();

  // Revalidate
  invalidatesCatch({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// search all products
export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 6;
    const skip = (page - 1) * limit;

    // first query for ? and rest all query for &
    // api/v1/product/all?search=mac&price=6000
    const baseQuery: BaseQuery = {};

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i", // case sensitive
      };
    }

    if (price) {
      baseQuery.price = {
        $lte: Number(price), // less than equal to eg price = 60000 > less then equal to 6000 thousand
      };
    }

    if (category) {
      baseQuery.category = category;
    }

    // promise.all ak hi time pe dono parallel hi chalenge

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const itemPerPage = products.length;

    // const products = await Product.find(baseQuery)
    //   .sort(sort && { price: sort === "asc" ? 1 : -1 })
    //   .limit(limit)
    //   .skip(skip);

    // Math.floor if 10.4 or 10.6 then still floor 10
    // Math.round if 10.4 then round figer 10 if 10.5 then 11
    // Math.ceil if 10.3 or 10.5 still ceil 11 does matter after dot value its round figger plus one value

    // basicaly we want this products without sort and limit
    // const filterdOnlyProduct = await Product.find(baseQuery);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      page,
      itemPerPage,
      totalPage,
    });
  }
);

/*

 const [productsResult] = await Product.aggregate([
        {
          $facet: {
            products: [
              {
                $match: baseQuery,
              },
              {
                $sort: sort && { price: sort === "asc" ? 1 : -1 },
              },
              {
                $limit: limit,
              },
              {
                $skip: skip,
              },
            ],
            filteredOnlyProduct: [
              {
                $match: baseQuery,
              },
            ],
          },
        },
      ]);
      

        const { products, filteredOnlyProduct } = productsResult;
      */

/*  const generateRandomProducts = async (count:number = 10) => {
          const products = [];

          for(let i = 0; i < count; i++){
            const product = {
              name:faker.commerce.productName(),
              photo:"uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
              price:faker.commerce.price({min:1500,max:80000,dec:0}),
              stock:faker.commerce.price({min:0,max:100,dec:0}),
              category:faker.commerce.department(),
              createdAt:new Date(faker.date.past()),
              updatedAt:new Date(faker.date.recent()),
              __v:0
            }
            products.push(product);
          }
          await Product.create(products);
          console.log({success:true});
        }

        //generateRandomProducts(40);

        */

/*
        const deleteRandomsProducts = async(count:number = 10) => {
            const products = await Product.find({}).skip(2);

            for(let i = 0; i < products.length; i++) {
              const product = products[i];
              await product.deleteOne();
            }
            console.log({success: true});
        }
        deleteRandomsProducts(40)

        */
