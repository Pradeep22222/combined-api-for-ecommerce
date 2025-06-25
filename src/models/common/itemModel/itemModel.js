import { calculateDimensionsAndWeight } from "../../../helpers/client/calculateDimensionAndWeight.js";
import itemSchema from "./itemSchema.js";


// export const getselectedProducts = (filter) => {
//   return itemSchema.find(filter);
// };
// export const getsingleItem = (filter) => {
//   return itemSchema.find(filter);
// };

export const addItem = (obj) => {
  return itemSchema(obj).save();
};

export const updateItemById = ({ _id, ...rest }) => {
  return itemSchema.findByIdAndUpdate(_id, rest);
};
// export const updateItemById = (_id, { update }) => {
//   return itemSchema.findByIdAndUpdate(_id, { update });
// };
export const deleteItemById = (_id) => {
  return itemSchema.findByIdAndDelete(_id);
};
// export const deleteImageOnUpdate = (_id, { images }) => {
//   return itemSchema.findByIdAndUpdate(_id, { images });
// };
// see if a product has any items
export const hasItemsById = async (_id) => {
  const item = await itemSchema.findOne({ productId: _id });
  return item?._id ? true : false;
};
// find items by productId ( used while updating products so that the related items gets updated)
export const findItemsByProduct = async (_id) => {
  const items = await itemSchema.find({ productId: _id });
  return items;
};
// update multiple items ( used while updating items if product they are associated is updated)
export const updateMultipleItemsCat = async (
  productId,
  { catId, subCatId }
) => {
  return itemSchema.updateMany({ productId }, { $set: { catId, subCatId } });
};
export const updateMultipleItemsSubCat = async (productId, { subCatId }) => {
  return itemSchema.updateMany({ productId }, { $set: { subCatId } });
};

export const getAllItems = () => {
  return itemSchema.find();
};
export const getItemById = (_id) => {
  return itemSchema.findById(_id);
};

export const getItemsByProduct = (_id) => {
  return itemSchema.find({ productId: _id });
};
// checking price and count with quantity while authorizing the payment while purchasing
export const checkItemDetailsAndGetDimensions = async (items) => {
  try {
    const itemDetails = [];

    for (let i = 0; i < items.length; i++) {
      const { name, _id, price, count } = items[i];

      const item = await itemSchema.findById(_id);
      if (!item) {
        return { success: false, message: `${name} is not available anymore` };
      }

      if (item.status === "inactive") {
        return {
          success: false,
          message: `${name} is not available at the moment`,
        };
      }

      if (count > item.quantity) {
        return {
          success: false,
          message: `Available stock for ${name} is only ${item.quantity}`,
        };
      }

      if (item.price !== price) {
        return {
          success: false,
          message: `Price didn't match for ${name}`,
        };
      }

      itemDetails.push({
        length: item.length,
        height: item.height,
        width: item.width,
        weight: item.weight,
        count: Number(count), // ensure count is numeric
      });
    }

    // ✅ Now calculate dimensions and weight
    const dimensions = calculateDimensionsAndWeight(itemDetails);

    return { success: true, dimensions, itemDetails };
  } catch (error) {
    console.error("Error checking items details:", error);
    return {
      success: false,
      message: "An error occurred while checking items details",
    };
  }
};


// decrease the quantity of the item by the count when the purchase goes successful
export const decreaseItemQuantity = async (itemId, count) => {
  try {
    const item = await itemSchema.findById(itemId);

    // Check if item exists and has enough stock
    if (item && item.quantity >= count) {
      // Decrease the item quantity
      item.quantity -= count;

      // Check if the quantity goes to 0 or below and set status to "inactive"
      if (item.quantity <= 0) {
        item.status = "inactive";
      }

      // Save the updated item
      await item.save();

      return { success: true };
    } else {
      return { success: false, message: "Insufficient stock" };
    }
  } catch (error) {
    console.error("Error decreasing item quantity:", error);
    return {
      success: false,
      message: "Failed to update item quantity on purchase",
    };
  }
};
