import mongoose from "mongoose";

const purchasesSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemCount:{
        type:Number,
        required:true
    },
    cardEnding: {
      type: String,
      required: true,
    },
    cardHolderName: {
      type: String,
      required: true,
    },
    totalPaid: {
      type: Number, 
      required: true,
    },
    timePlaced: {
      type: Date, 
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    itemPrice: {
      type: Number, 
      required: true,
    },
    duplicate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("purchases", purchasesSchema);
