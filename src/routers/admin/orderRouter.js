import express from "express";
const router = express.Router();
const ordersArg = [
  {
    _id: "1",
    status: "processing", // processing, shipped,  delivered, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Himal",
      lastName: "Kumar",
      email: "Himaldhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Laptop",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "Television",
        productName: "jfldsfjs",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Hall Street",
      suburb: "Auburn",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // card, paypal
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "4",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Khanal",
      email: "Anjan@gmail.com",
      phone: "0451643499",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Desktop",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Bicycle",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "3 Russell Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 2950,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "card", // paypal , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-28",
    },
  },
  {
    _id: "2",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Jhaggu",
      lastName: "Prasadu",
      email: "JhagguPrasad22@gmail.com",
      phone: "045944399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Car",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Bicycle",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1 Bhojpur Street",
      suburb: "Tulsipur",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "pending", // paid , pending
      method: "", // cash , card
      paidAmount: 0,
      transactionId: "kdfljs57349",
      paidDate: "",
    },
  },
  {
    _id: "3",
    status: "completed", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Shiwa",
      lastName: "Bhattarai",
      email: "Shiwabhattaria23@gmail.com",
      phone: "0864644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Lipstick",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Perfume",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 2950,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "Master Card", // cash , card
      paidAmount: 400,
      transactionId: "k5d4flj43s57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "completed", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Anjandhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Paint",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "Paint",
        productName: "jfldsfjs",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "completed", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Anjandhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "T-shirt",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Trousers",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "completed", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Anjandhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Motorcycle",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Car",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Anjandhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Laptop",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Television",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Hilliers Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Anjandhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Jacket",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Jumper",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1 Wentworth Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Anjandhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Shoes",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Gloves",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Wolli Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "cancelled", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Anjandhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Shocks",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "underware",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "27 Lyons Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Anjandhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Shoes",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Boots",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Boulevarde Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "cancelled", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Anjandhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Glasses",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Cap",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "cancelled", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Anjan",
      lastName: "Kumar",
      email: "Pradeepdhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Boots",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Shoes",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Aarosh",
      lastName: "Kumar",
      email: "Aaroshdhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Product 1",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Product 2",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Aarosh",
      lastName: "Kumar",
      email: "Aaroshdhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Product 1",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "Proddfdfuct",
        productName: "product2",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Aarosh",
      lastName: "Kumar",
      email: "Aaroshdhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Product 2",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "ffdf2",
        productName: "jfldsfjs",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Aarosh",
      lastName: "Kumar",
      email: "Aaroshdhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Product 3",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "prodfdduct",
        productName: "Product 3",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Aarosh",
      lastName: "Kumar",
      email: "Pradeepdhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Product 4",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Product 5",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Himal",
      lastName: "Kumar",
      email: "Himaldhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "product 1",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Product 2",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Himal",
      lastName: "Kumar",
      email: "Himaldhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Product 1",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Product 2",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
  {
    _id: "1",
    status: "processing", // processing, completed, cancelled
    buyer: {
      buyerId: "fdfs",
      firstName: "Himal",
      lastName: "Kumar",
      email: "Himaldhital@gmail.com",
      phone: "0451644399",
    },
    cart: [
      {
        productId: "jfldsfjs",
        productName: "Product 1",
        salesPrice: 850,
        qty: 3,
        thumbnail: "http:/...",
        subTotal: 2550,
      },
      {
        productId: "jfldsfjs",
        productName: "Product 2",
        salesPrice: 400,
        qty: 1,
        thumbnail: "http:/...",
        subTotal: 400,
      },
    ],
    shipping: {
      street: "1-3 Clarence Street",
      suburb: "Strathfield",
      state: "NSW",
      country: "Australia",
    },
    cartTotal: 450,
    discount: 50,
    discountCode: "fjdlf53rj",
    totalAmount: 400,
    paymentInfo: {
      status: "paid", // paid , pending
      method: "cash", // cash , card
      paidAmount: 400,
      transactionId: "kdfljs57349",
      paidDate: "2023-05-29",
    },
  },
];
router.get("/:_id?", (req, res, next) => {
  try {
    const { _id } = req.params;
    const orders = _id
      ? ordersArg.filter((item) => item._id === _id)[0]
      : ordersArg;
    res.json({
      status: "success",
      message: "order list",
      orders,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
