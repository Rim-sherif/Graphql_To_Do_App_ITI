import { usersModel } from "../../models/user.js";

const userQueries = {
  async users(_, __, context) {
    try {
      if (!context.user) {
        throw new Error("Authentication required");
      }

      const users = await usersModel.find({}).select("-password");
      return users;
    } catch (err) {
      throw new Error(err.message || "Error fetching users");
    }
  },

  async user(_, { id }, context) {
    try {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      const user = await usersModel.findById(id).select("-password");
      if (!user) throw new Error("User not found");
      return user; 
    } catch (err) {
      throw new Error(err.message || "Error fetching user");
    }
  },
};

export default userQueries;
