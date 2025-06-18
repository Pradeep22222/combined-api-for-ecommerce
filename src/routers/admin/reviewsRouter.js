import express from "express";
const router = express.Router();
const reviewsArg = [
  {
    _id: "9e378refjdf7",
    review: "some text of review",
    productId: "dfjdlkf",
    productName: "I pad",
    rating: 5,
    reviewedBy: "Pradeep",
    reviewedById: "kdfjus987",
  },
  {
    _id: "9e378rdfdefjdf7",
    review: "some text of review",
    productId: "dfjdlkf",
    productName: "I pad",
    rating: 5,
    reviewedBy: "Pradeep",
    reviewedById: "kdfjus987",
  },
  {
  _id: "9e378resdffjdf7",
    review: "some text of review",
    productId: "dfjdlkf",
    productName: "I pad",
    rating: 5,
    reviewedBy: "Pradeep",
    reviewedById: "kdfjus987",
  },
  {
    _id: "9e378rdfdefjdf7",
    review: "some text of review",
    productId: "dfjdlkf",
    productName: "I pad",
    rating: 5,
    reviewedBy: "Pradeep",
    reviewedById: "kdfjus987",
  },
];
router.get("/:_id?", (req, res, next) => {
  try {
    const { _id } = req.params;
    const reviews = _id
      ? reviewsArg.filter((item) => item._id === _id)[0]
      : reviewsArg;
    res.json({
      status: "success",
      message: "order list",
      reviews,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
