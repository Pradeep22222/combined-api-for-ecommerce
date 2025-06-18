import express from "express";
const router = express.Router();
const usersArg = [
  {
    _id: "dlkfdfdjdslkfj43f",
    firstName: "Pradeep",
    lastName: "Dhital",
    phone: "0452637485",
    email: "Pradeepdhital003@gmail.com",
  },
  {
    _id: "dlkfjdssfdslkfj43f",
    firstName: "Anjan",
    lastName: "Dhital",
    phone: "0453276538",
    email: "Anjandhital22@gmail.com",
  },
  {
    _id: "dlkfjadfedslkfj43f",
    firstName: "Pradeep",
    lastName: "Sharma",
    phone: "0452675456",
    email: "Sharmapradeep@gmail.com",
  },
];
router.get("/:_id?", (req, res, next) => {
  try {
    const { _id } = req.params;
    const users = _id
      ? usersArg.filter((item) => item._id === _id)[0]
      : usersArg;
    res.json({
      status: "success",
      message: "order list",
      users,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
