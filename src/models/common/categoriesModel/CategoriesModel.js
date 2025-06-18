import categoriesSchema from "./CategoriesSchema.js";


// post categories
export const insertCategory = (obj) => {
  return categoriesSchema(obj).save();
};
// get one category
export const getCategoryById = (_id) => {
  return categoriesSchema.findById(_id);
};
// get all categories
export const getAllCategories = () => {
  return categoriesSchema.find();
};
// update category
export const updateCategoryById = ({ _id, ...update }) => {
  return categoriesSchema.findByIdAndUpdate(_id, update, { new: true });
};
// see if a category has a child category
export const hasChildCategoryById = async (_id) => {
  const cat = await categoriesSchema.findOne({ catId: _id });
  return cat?._id ? true : false;
};

// delete category
export const deleteCategoryById = async (_id) => {
  return categoriesSchema.findByIdAndDelete(_id);
};
