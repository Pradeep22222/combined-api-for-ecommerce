import express from "express";
import slugify from "slugify";
import {
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  hasChildCategoryById,
  insertCategory,
  updateCategoryById,
} from "../../models/common/categoriesModel/CategoriesModel.js";
import {
  newCategoryValidation,
  updateCategoryValidation,
} from "../../middlewares/admin/joi-validation/joiValidation.js";
import { hasProductsById } from "../../models/common/productsModel/productsModel.js";
const router = express.Router();
// get categories
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const categories = _id
      ? await getCategoryById(_id)
      : await getAllCategories();
    res.json({
      status: "success",
      message: "category list",
      categories,
    });
  } catch (error) {
    next(error);
  }
});
// post new category
router.post("/", newCategoryValidation, async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name, {
      lower: true,
      trim: true,
    });
    const result = await insertCategory(req.body);
    result?._id
      ? res.json({
          status: "success",
          message: "category added",
        })
      : res.json({
          status: "error",
          message: "category couldn't be added",
        });
  } catch (error) {
    next(error);
  }
});

// update category
router.put("/", updateCategoryValidation, async (req, res, next) => {
  try {
    if (req.body.catId) {
      const hasChildCats = await hasChildCategoryById(req.body._id);
      if (hasChildCats) {
        return res.json({
          status: "error",
          message:
            "This category has child categories, please delete them or re-assign them to other categories first.",
        });
      }
    }
    const catUpdate = await updateCategoryById(req.body);
    catUpdate?._id
      ? res.json({
          status: "success",
          message: "the category has been updated",
        })
      : res.json({
          status: "error",
          message: "Unable to update the category, please try again later",
        });
  } catch (error) {
    next(error);
  }
});
// Delete Category
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const hasChildCats = await hasChildCategoryById(_id);
    if (hasChildCats) {
      return res.json({
        status: "error",
        message:
          "The category has child categories, please delete them or re-assign them to other categories first.",
      });
    }
    const hasChildProducts = await hasProductsById(_id);
    console.log(hasChildProducts);
    if (hasChildProducts) {
      return res.json({
        status: "error",
        message:
          "The category has products assigned, please delete them or re-assign them to other categories first.",
      });
    }
    const result = await deleteCategoryById(_id);
    result?._id
      ? res.json({
          status: "success",
          message: "the category has been deleted",
        })
      : res.json({
          status: "error",
          message: "Unable to delete the category, please try again later",
        });
  } catch (error) {
    next(error);
  }
});
export default router;
