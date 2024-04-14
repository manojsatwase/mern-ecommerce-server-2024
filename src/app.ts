import express from 'express';
import NodeCache from 'node-cache';
import {config} from 'dotenv';
import morgan from 'morgan';
import Stripe from 'stripe';
import cors from 'cors';

import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';

// Importing Routes
import userRoute from './routes/user.js';
import productRoute from './routes/products.js';
import orderRoute from './routes/order.js';
import paymentRoute from './routes/payment.js';
import dashboardRoute from './routes/stats.js';

// make sure before DB 
config({
    path:"./.env"
})

const port = process.env.PORT || 4000;
const mongoURL = process.env.MONGO_URL || "";
const stripeKey = process.env.STRIPE_KEY || "";

connectDB(mongoURL);


// instance create 

// stripe 
export const stripe = new Stripe(stripeKey);

// cache means temporty store in memory
export const myCache = new NodeCache(); 

const app = express();


// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get('/',(req,res)=>{
    res.send('API Working with /api/v1');
})


// Using Routes
app.use('/api/v1/user',userRoute);
app.use('/api/v1/product',productRoute);
app.use('/api/v1/order',orderRoute);
app.use('/api/v1/payment',paymentRoute);
app.use('/api/v1/dashboard', dashboardRoute);


app.use('/uploads',express.static('uploads'));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
})