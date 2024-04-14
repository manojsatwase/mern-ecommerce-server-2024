import { Request, Response, NextFunction } from "express";

//-------- User -------------

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

// ----- TryCatch ---------

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

//------- Product -----------

export interface NewProductRequestBody {
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Search request query

export type SearchRequestQuery = {
  search?: string; // // ? means optional
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

// BASE QUERY TYPE
export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}

// Invalidates Cache
export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

// Order

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type ShippingInfoType = {
   address: string;
   city: string;
   state: string;
   country: string;
   pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}

export interface OrderPropertyType {
  total: number;
  discount: number;
  shippingCharges: number;
  tax: number;
}

