import express from "express";
import slugify from "slugify";
import {
  addItem,
  deleteItemById,
  getAllItems,
  getItemById,
} from "../../models/common/itemModel/itemModel.js";
import {
  newItemValidation,
  updateItemValidation,
} from "../../middlewares/admin/joi-validation/joiValidation.js";
const router = express.Router();
import { updateItemById } from "../../models/common/itemModel/itemModel.js";
import cloudinary from "../../helpers/admin/cloudinary.js";
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const items = _id ? await getItemById(_id) : await getAllItems();
    res.json({
      status: "success",
      message: "to do get method",
      items,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", newItemValidation, async (req, res, next) => {
  try {
    const { images } = req.body;
    let uploadedImages = [];
    if (images.length) {
      for (const image of images) {
        const response = await cloudinary.uploader.upload(image, {
          upload_preset: "ecomitems",
        });
        uploadedImages.push({
          secure_url: response.secure_url,
          public_id: response.public_id,
        });
      }
    }
    req.body.slug = slugify(req.body.name, { lower: true, trim: true });
    req.body.images = uploadedImages;
    req.body.thumbnail = uploadedImages[0].secure_url;
    [0];
    const result = await addItem(req.body);
    result?._id
      ? res.json({
          status: "success",
          message: "the item has been successfully added",
        })
      : res.json({
          status: "error",
          message: "Unable to add the item, please try again later",
        });
  } catch (error) {
    let message = error.message;
    if (message.includes("E11000 duplicate key error collection")) {
      error.message =
        "There is already one another item with either same name or same sku ";
    }
    next(error);
  }
});

router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    //  delete the item from the database based on the given id
    const item = await deleteItemById(_id);
    const { images } = item;
    if (images.length) {
      for (const image of images) {
        const response = await cloudinary.uploader.destroy(image.public_id);
      }
    }
    item?._id
      ? res.json({
          status: "success",
          message: "The item has been deleted successfully",
        })
      : res.json({
          status: "error",
          message: "Unable to delete the item",
        });
  } catch (error) {
    error.status = 500;
  }
});

router.put("/", updateItemValidation, async (req, res, next) => {
  try {
    const { imgToDelete, newImages, images, ...rest } = req.body;
    const { _id } = rest;
    const item = await getItemById(_id);
    if (imgToDelete.length) {
      // filter out the images objects that have a matching public_id
      item.images = item.images.filter(
        (image) => !imgToDelete.includes(image.public_id)
      );
      await item.save();
      for (const image of imgToDelete) {
        const response = await cloudinary.uploader.destroy(image);
      }
    }
    let uploadedImages = [];
    if (newImages.length) {
      for (const image of newImages) {
        const response = await cloudinary.uploader.upload(image, {
          upload_preset: "ecomitems",
        });
        uploadedImages.push({
          secure_url: response.secure_url,
          public_id: response.public_id,
        });
      }
    }
    item.images.push(...uploadedImages);
    await item.save();
    const result = await updateItemById(rest);
    result?._id
      ? res.json({
          status: "success",
          message: "The item has been updated",
        })
      : res.json({
          status: "error",
          message: "Unable to update the item, please try again later",
        });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
