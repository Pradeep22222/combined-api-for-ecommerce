import express from "express";
import {
  deleteproductById,
  getAllproducts,
  getproductById,
  insertproduct,
  updateproductById,
} from "../../models/common/productsModel/productsModel.js";
import {
  findItemsByProduct,
  hasItemsById,
  updateMultipleItemsCat,
  updateMultipleItemsSubCat,
} from "../../models/common/itemModel/itemModel.js";
const router = express.Router();
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const products = _id ? await getproductById(_id) : await getAllproducts();
    res.json({
      status: "success",
      message: "product list",
      products,
    });
  } catch (error) {
    next(error); 
  }
});
router.post("/", async (req, res, next) => {
  try {
      // unauthorsed
return res.json({
status:"error",
message:"Unathorised due to constant data manupulating"
})
// 
    const result = await insertproduct(req.body);
    result?._id
      ? res.json({
          status: "success",
          message: "product added",
        })
      : res.json({
          status: "error",
          message: "product couldn't be added",
        });
  } catch (error) {
    next(error);
  }
});
// update product
router.put("/", async (req, res, next) => {
  try {
      // unauthorsed
return res.json({
status:"error",
message:"Unathorised due to constant data manupulating"
})
// 
    const { _id, catId, subCatId } = req.body;
    const product = getproductById(_id);
    if (product.catId !== catId) {
      const items = await findItemsByProduct(_id);
      if (items.length) {
        await updateMultipleItemsCat(_id, { catId, subCatId });
      }
    }
    if (product.catId === catId && product.subCatId !== subCatId) {
      const items = await findItemsByProduct(_id);
      if (items.length) {
        await updateMultipleItemsSubCat(_id, {
          subCatId,
        });
      }
    }
    const productUpdate = await updateproductById(req.body);
    productUpdate?._id
      ? res.json({
          status: "success",
          message: "the product has been updated",
        })
      : res.json({
          status: "error",
          message: "Unable to update the product, please try again later",
        });
  } catch (error) {
    next(error);
  }
});
// delete  product
router.delete("/:_id", async (req, res, next) => {
  try {
      // unauthorsed
return res.json({
status:"error",
message:"Unathorised due to constant data manupulating"
})
// 
    const { _id } = req.params;
    const hasItems = await hasItemsById(_id);
    if (hasItems) {
      return res.json({
        status: "error",
        message:
          "The product has items assigned to it, either delete or move the items first.",
      });
    }
    const result = await deleteproductById(_id);
    result?._id
      ? res.json({
          status: "success",
          message: "the product has been deleted",
        })
      : res.json({
          status: "error",
          message: "Unable to delete the product, please try again later",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
