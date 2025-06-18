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

      // Find the product by its ID
      const product = await itemSchema.findById(_id);

      if (!product) {
        return { success: false, message: `${name} is not available anymore` };
      }

      // Check if the item status is inactive
      if (product.status === "inactive") {
        return {
          success: false,
          message: `${name} is not available at the moment`,
        };
      }

      // Check if the count matches the available stock
      const isCountValid = count <= product.quantity;
      if (!isCountValid) {
        return {
          success: false,
          message: `Available stock for ${name} is only ${product.quantity}`,
        };
      }

      // Check if the price matches
      const isPriceMatch = product.price === price;
      if (!isPriceMatch) {
        return {
          success: false,
          message: `Price didn't match for ${name}`,
        };
      }

      // If validation passed, push the product dimensions into the array
      itemDetails.push({
        length: product.length,
        height: product.height,
        width: product.width,
        weight: product.weight,
      });
    }

    // If all products are valid, return their dimensions
    return { success: true, itemDetails };
  } catch (error) {
    console.error("Error checking product details:", error);
    return {
      success: false,
      message: "An error occurred while checking product details",
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
