import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
      filterName:{
    type:String,
    required:false,
    },
    filters:[
    
String],
    status: {
      type: String,
      default: "inactive",
    },
    name: {
      type: String,
      required: true,
      maxLength: 100,
    },
    sku: {
      type: String,
      unique: true,
      index: 1,
      required: true,
      maxLength: 100,
    },
    slug: {
      type: String,
      unique: true,
      index: 1,
      required: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      maxLength: 500,
    },
    catId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sub-category",
      require: true,
    },
    subCatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sub-category",
      require: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      require: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    fromSuburb: {
      type: String,
      required: true,
      default: "",
    },
    fromState: {
      type: String,
      required: true,
      default: "",
    },
    fromPostCode: {
      type: Number,
      required: true,
      default: 0,
    },
    length: {
      type: Number,
      required: true,
      default: 0,
    },
    width: {
      type: Number,
      required: true,
      default: 0,
    },
    height: {
      type: Number,
      required: true,
      default: 0,
    },
    weight: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [{ secure_url: String, public_id: String }],
    thumbnail: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    salesPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    salesStartDate: {
      type: Date,
      default: null,
    },
    salesEndDate: {
      type: Date,
      default: null,
    },
    rating: {
      type: Number,
      max: 5,
      default: 5,
    },
  },
  { timestamps: true }
);
export default mongoose.model("item", itemSchema);
