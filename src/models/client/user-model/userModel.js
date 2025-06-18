import userSchema from "./userSchema.js";
export const insertUser = (obj) => {
  return userSchema(obj).save();
};
export const findOneUser = (filter) => {
  return userSchema.findOne(filter);
};
export const updateOneUser = (filter, update) => {
  return userSchema.findOneAndUpdate(filter, update, { new: true });
};
// export const updateUser = (_id, obj) => {
//   return userSchema.findByIdAndUpdate(_id, obj);
// };
// export const deleteUser = (_id) => {
//   return userSchema.findByIdAndDelete(_id);
// };
export const updateUserAddress = async (userId, newAddress) => {
  try {
    // Destructure the new address fields
    const { streetAddress, suburb, state, postCode } = newAddress;

    // Find the user by ID and update the address
    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      {
        $set: {
          "address.streetAddress": streetAddress,
          "address.suburb": suburb,
          "address.state": state,
          "address.postCode": postCode,
        },
      },
      { new: true, runValidators: true } // Return the updated document
    );

    // Return the updated user or null if not found
    return updatedUser;
  } catch (error) {
    throw error; // Re-throw error for the calling function to handle
  }
};