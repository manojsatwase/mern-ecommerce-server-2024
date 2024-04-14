

// USER

// NEW USER
REQUEST:
  url : localhost:4000/api/v1/user/new
  method: post
  body : {
      "name":"manoj",
      "email":"manoj@gmail.com",
      "photo":"manoj",
      "gender":"male",
      "_id":"wewarerwe",
      "dob":"1994-07-25"
}

RESPONSE :
{
    "success": true,
    "message": "Welcome, manoj"
}

------------------------------------------------

All USERS:-
REQUEST:
  url : localhost:4000/api/v1/user/all?id=wewarerwe
  method: get

params
 id:wewarerwe

RESPONSE:
{
    "success": true,
    "users": [
        {
            "_id": "wewarerwe",
            "name": "manoj",
            "email": "manoj@gmail.com",
            "photo": "manoj",
            "role": "admin",
            "gender": "male",
            "dob": "1994-07-25T00:00:00.000Z",
            "createdAt": "2024-04-07T02:41:15.288Z",
            "updatedAt": "2024-04-07T02:41:15.288Z",
            "__v": 0
        }
    ]
}


------------------------------------------------

SINGLE USER:-

REQUEST:
  url :localhost:4000/api/v1/user/wewarerwe
  method: get

RESPONSE:
{
    "success": true,
    "user": {
        "_id": "wewarerwe",
        "name": "manoj",
        "email": "manoj@gmail.com",
        "photo": "manoj",
        "role": "user",
        "gender": "male",
        "dob": "1994-07-25T00:00:00.000Z",
        "createdAt": "2024-04-07T02:41:15.288Z",
        "updatedAt": "2024-04-07T02:41:15.288Z",
        "__v": 0
    }
}



DELETE USER:-

REQUEST:
  url :localhost:4000/api/v1/user/wewarerwe
  method: get

RESPONSE:
{
  success:true,
  message:"delete user successfully"
}

------------------------------------------------

PRODUCT

NEW PRODUCT:-
REQUEST:
   url : localhost:4000/api/v1/product/new
   method : post
   body :
   form-data :-
    name "mackbook"
    category laptop
    price  89999
    stock   5
    photo  mackbook.jpg

RESEPONSE:-
{
    "success": false,
    "message": "Please enter all Fileds"
}

------------------------------------------------
LATEST PRODUCT

REQUEST:
 URL : localhost:4000/api/v1/product/latest
 METHOD : GET

RESPONSE : 
{
    "success": true,
    "products": [
        {
            "_id": "661227eb0ed1a1449b392dd2",
            "name": "Macbook",
            "photo": "uploads/bf3aa945-2f4a-4e49-99e2-b09df9e3dafa.jpg",
            "price": 89999,
            "stock": 4,
            "category": "laptop",
            "createdAt": "2024-04-07T04:58:19.778Z",
            "updatedAt": "2024-04-07T04:58:19.778Z",
            "__v": 0
        }
    ]
}

------------------------------------------------

GET ALL CATEGORIES 


REQUEST:
 URL : localhost:4000/api/v1/product/categories
 METHOD : GET

RESPONSE:
{
    "success": true,
    "categories": [
        "laptop"
    ]
}

------------------------------------------------
ADMIN GET ALL PRODUCTS

REQUEST:
   URL:localhost:4000/api/v1/product/admin-products
   METHOD: GET
   
RESPONSE:
{
    "success": true,
    "products": [
        {
            "_id": "661227eb0ed1a1449b392dd2",
            "name": "Macbook",
            "photo": "uploads/bf3aa945-2f4a-4e49-99e2-b09df9e3dafa.jpg",
            "price": 89999,
            "stock": 4,
            "category": "laptop",
            "createdAt": "2024-04-07T04:58:19.778Z",
            "updatedAt": "2024-04-07T04:58:19.778Z",
            "__v": 0
        }
    ]
}


-----------------------------------------------

Get Single Product

REQUEST:
   URL:localhost:4000/api/v1/product/661227eb0ed1a1449b392dd2
  METHOD: GET

RESPONSE :
{
    "success": true,
    "products": {
        "_id": "661227eb0ed1a1449b392dd2",
        "name": "Macbook",
        "photo": "uploads/bf3aa945-2f4a-4e49-99e2-b09df9e3dafa.jpg",
        "price": 89999,
        "stock": 4,
        "category": "laptop",
        "createdAt": "2024-04-07T04:58:19.778Z",
        "updatedAt": "2024-04-07T04:58:19.778Z",
        "__v": 0
    }
}


-----------------------------------------------

UPDATE PRODUCT
REQUEST:
 URL: localhost:4000/api/v1/product/661227eb0ed1a1449b392dd2
METHOD: PUT
BODY: 
form-data
 name : manoj


RESPONSE:-
{
    "success": true,
    "message": "Product Updated Successfully"
}


-----------------------------------------------
DELETE PRODUCT
REQUEST:
URL : localhost:4000/api/v1/product/661227eb0ed1a1449b392dd2
METHOD: DELETE

RESPONSE: 
{
    "success": true,
    "message": "Product Deleted Successfully"
}

-----------------------------------------------

SEARCH ALL QUERY
REQUEST: 
  URL : localhost:4000/api/v1/product/all?search=mac&price=89999&category=laptop
  METHOD: GET
 PARAMS:
   Key      Value
   search    mac
   price     89999
   category  laptop
   page:2

RESPONSE:-
{
    "success": true,
    "products": [
        {
            "_id": "661285c89df05239471daaa3",
            "name": "Electronic Plastic Chair",
            "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
            "price": 73893,
            "stock": 77,
            "category": "Movies",
            "createdAt": "2023-06-14T23:35:38.223Z",
            "updatedAt": "2023-06-14T23:35:38.223Z",
            "__v": 0
        },
        {
            "_id": "661285c89df05239471daaaa",
            "name": "Ergonomic Rubber Table",
            "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
            "price": 31846,
            "stock": 95,
            "category": "Movies",
            "createdAt": "2023-06-12T10:34:05.701Z",
            "updatedAt": "2023-06-12T10:34:05.701Z",
            "__v": 0
        },
        {
            "_id": "661285c89df05239471daaab",
            "name": "Generic Granite Mouse",
            "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
            "price": 71696,
            "stock": 0,
            "category": "Computers",
            "createdAt": "2023-12-08T02:56:48.309Z",
            "updatedAt": "2023-12-08T02:56:48.309Z",
            "__v": 0
        },
        {
            "_id": "661285c89df05239471daaac",
            "name": "Recycled Metal Cheese",
            "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
            "price": 53748,
            "stock": 49,
            "category": "Toys",
            "createdAt": "2023-05-18T20:23:27.962Z",
            "updatedAt": "2023-05-18T20:23:27.962Z",
            "__v": 0
        },
        {
            "_id": "661285c89df05239471daaad",
            "name": "Gorgeous Wooden Shoes",
            "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
            "price": 64735,
            "stock": 25,
            "category": "Electronics",
            "createdAt": "2023-12-31T16:28:26.008Z",
            "updatedAt": "2023-12-31T16:28:26.008Z",
            "__v": 0
        },
        {
            "_id": "661285c89df05239471daaae",
            "name": "Handcrafted Bronze Pizza",
            "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
            "price": 16699,
            "stock": 44,
            "category": "Automotive",
            "createdAt": "2024-03-19T20:34:42.864Z",
            "updatedAt": "2024-03-19T20:34:42.864Z",
            "__v": 0
        },
        {
            "_id": "661285c89df05239471daaaf",
            "name": "Awesome Concrete Tuna",
            "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
            "price": 58467,
            "stock": 13,
            "category": "Toys",
            "createdAt": "2023-10-17T10:34:22.379Z",
            "updatedAt": "2023-10-17T10:34:22.379Z",
            "__v": 0
        },
        {
            "_id": "661285c89df05239471daab0",
            "name": "Bespoke Rubber Table",
            "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
            "price": 23117,
            "stock": 21,
            "category": "Grocery",
            "createdAt": "2023-11-09T12:07:16.522Z",
            "updatedAt": "2023-11-09T12:07:16.522Z",
            "__v": 0
        }
    ],
    "page": 2,
    "itemPerPage": 8,
    "totalPage": 11
}


--------------------------------

Order

REQUEST:
URL : localhost:4000/api/v1/order/new
METHOD: POST
BODY :
  {
    "shippingInfo":{
        "address":"katkumbh",
        "city":"bhaindehi",
        "state":"madhy pradesh",
        "country":"india",
        "pinCode":444807
    },
    "user":"wewarerwe",
    "subtotal":89999,
     "tax":200,
    "shippingCharges":0,
    "discount":200,
    "total":89999,
    "orderItems":[
        {
            "name":"Macbook",
            "photo":"uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
            "price":89999,
            "quantity":2,
            "productId":"66126686a50d4200aedc9d3e"
        }
    ]

}

RESPONSE:
{
    "success": true,
    "message": "Order Placed Succssfully"
}


---------------------------------------------

My Order

REQUEST :- 
  URL : localhost:4000/api/v1/order/my?id=wewarerwe
  METHOD : GET
  QUERY PARAMS
   KEY              VALUE
   id               wewarerwe

RESPONSE:-

{
    "success": true,
    "orders": [
        {
            "_id": "661359cb4f4d60f620d32097",
            "shippingInfo": {
                "address": "katkumbh",
                "city": "bhaindehi",
                "state": "madhy pradesh",
                "country": "india",
                "pinCode": 444807,
                "_id": "661359cb4f4d60f620d32098"
            },
            "user": "wewarerwe",
            "subtotal": 89999,
            "tax": 200,
            "shippingCharges": 0,
            "discount": 200,
            "total": 89999,
            "status": "Processing",
            "orderItems": [
                {
                    "name": "Macbook",
                    "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
                    "price": 89999,
                    "quantity": 2,
                    "productId": "66126686a50d4200aedc9d3e",
                    "_id": "661359cb4f4d60f620d32099"
                }
            ],
            "createdAt": "2024-04-08T02:43:23.624Z",
            "updatedAt": "2024-04-08T02:43:23.624Z",
            "__v": 0
        },
        {
            "_id": "66135b797cb8b2c75b1809f5",
            "shippingInfo": {
                "address": "katkumbh",
                "city": "bhaindehi",
                "state": "madhy pradesh",
                "country": "india",
                "pinCode": 444807,
                "_id": "66135b797cb8b2c75b1809f6"
            },
            "user": "wewarerwe",
            "subtotal": 89999,
            "tax": 200,
            "shippingCharges": 0,
            "discount": 200,
            "total": 89999,
            "status": "Processing",
            "orderItems": [
                {
                    "name": "Macbook",
                    "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
                    "price": 89999,
                    "quantity": 2,
                    "productId": "66126686a50d4200aedc9d3e",
                    "_id": "66135b797cb8b2c75b1809f7"
                }
            ],
            "createdAt": "2024-04-08T02:50:33.840Z",
            "updatedAt": "2024-04-08T02:50:33.840Z",
            "__v": 0
        }
    ]
}

--------------------------------------
All Orders Only Admin Can Allow To See All Orders

REQUEST :- 
 URL : localhost:4000/api/v1/order/all?id=wewarerwe
 METHOD: GET
QUERY PARAMS
KEY             VALUE
id              wewarerwe
 
RESPONSE:-

{
    "success": true,
    "orders": [
        {
            "_id": "661359cb4f4d60f620d32097",
            "shippingInfo": {
                "address": "katkumbh",
                "city": "bhaindehi",
                "state": "madhy pradesh",
                "country": "india",
                "pinCode": 444807,
                "_id": "661359cb4f4d60f620d32098"
            },
            "user": {
                "_id": "wewarerwe",
                "name": "manoj"
            },
            "subtotal": 89999,
            "tax": 200,
            "shippingCharges": 0,
            "discount": 200,
            "total": 89999,
            "status": "Processing",
            "orderItems": [
                {
                    "name": "Macbook",
                    "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
                    "price": 89999,
                    "quantity": 2,
                    "productId": "66126686a50d4200aedc9d3e",
                    "_id": "661359cb4f4d60f620d32099"
                }
            ],
            "createdAt": "2024-04-08T02:43:23.624Z",
            "updatedAt": "2024-04-08T02:43:23.624Z",
            "__v": 0
        },
        {
            "_id": "66135b797cb8b2c75b1809f5",
            "shippingInfo": {
                "address": "katkumbh",
                "city": "bhaindehi",
                "state": "madhy pradesh",
                "country": "india",
                "pinCode": 444807,
                "_id": "66135b797cb8b2c75b1809f6"
            },
            "user": {
                "_id": "wewarerwe",
                "name": "manoj"
            },
            "subtotal": 89999,
            "tax": 200,
            "shippingCharges": 0,
            "discount": 200,
            "total": 89999,
            "status": "Processing",
            "orderItems": [
                {
                    "name": "Macbook",
                    "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
                    "price": 89999,
                    "quantity": 2,
                    "productId": "66126686a50d4200aedc9d3e",
                    "_id": "66135b797cb8b2c75b1809f7"
                }
            ],
            "createdAt": "2024-04-08T02:50:33.840Z",
            "updatedAt": "2024-04-08T02:50:33.840Z",
            "__v": 0
        }
    ]
}

--------------------------------

REQUEST :-
 URL : localhost:4000/api/v1/order/661359cb4f4d60f620d32097
METHOD : GET

RESPONSE :-

{
    "success": true,
    "order": {
        "_id": "661359cb4f4d60f620d32097",
        "shippingInfo": {
            "address": "katkumbh",
            "city": "bhaindehi",
            "state": "madhy pradesh",
            "country": "india",
            "pinCode": 444807,
            "_id": "661359cb4f4d60f620d32098"
        },
        "user": {
            "_id": "wewarerwe",
            "name": "manoj"
        },
        "subtotal": 89999,
        "tax": 200,
        "shippingCharges": 0,
        "discount": 200,
        "total": 89999,
        "status": "Processing",
        "orderItems": [
            {
                "name": "Macbook",
                "photo": "uploads/fc51b23e-dc20-4777-843a-1dd1791c2790.jpg",
                "price": 89999,
                "quantity": 2,
                "productId": "66126686a50d4200aedc9d3e",
                "_id": "661359cb4f4d60f620d32099"
            }
        ],
        "createdAt": "2024-04-08T02:43:23.624Z",
        "updatedAt": "2024-04-08T02:43:23.624Z",
        "__v": 0
    }
}

-------------------------------------

REQUEST :-
URL : localhost:4000/api/v1/order/661359cb4f4d60f620d32097?id=wewarerwe
METHOD: PUT
Query Params
Key            value
id             wewarerwe

RESPONSE :-
{
    "success": true,
    "message": "Order Process Succssfully"
}

----------------------------------------

REQUEST :-
URL : localhost:4000/api/v1/order/661359cb4f4d60f620d32097?id=wewarerwe
METHOD: DELETE
Query Params
Key            value
id             wewarerwe

RESPONSE :-
{
    "success": true,
    "message": "Order Deleted Succssfully"
}