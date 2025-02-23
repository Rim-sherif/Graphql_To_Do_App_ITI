import { usersModel } from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const userMutations = {
  register: async (_, { user }) => {
    try {
  
      if (!validator.isEmail(user.email)) {
        throw new Error("Invalid email format");
      }
      if (user.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }


      const existingUser = await usersModel.findOne({ email: user.email });
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const newUser = await usersModel.create({
        ...user,
        password: user.password, 
      });

      return newUser
    } catch (err) {
      console.error("Registration error:", err);
      throw new Error("Registration failed: " + err.message);
    }
  },

  login: async (_, { user }) => {
    try {
      if (!validator.isEmail(user.email)) {
        throw new Error("Invalid email format");
      }
  
      const existingUser = await usersModel.findOne({ email: user.email });
  
      if (!existingUser) {
        throw new Error("User not found");
      }
  
    
      console.log("Entered Password:", user.password);
      console.log("Stored Hashed Password:", existingUser.password);
      
      const passwordMatch = await bcrypt.compare(user.password, existingUser.password);
      console.log("Password Match Result:", passwordMatch);
  
      if (!passwordMatch) {
        throw new Error("Incorrect password");
      }
  
      const token = jwt.sign(
        { id: existingUser.id, role: existingUser.role },
        process.env.SECRET,
        { expiresIn: "1h" }
      );
  
      return token;
  
    } catch (err) {
      console.error("Login error:", err);
      throw new Error("Authentication failed: " + err.message);
    }
  },
  
  

  deleteUser: async (_, { id }, context) => {
    try {
    
      if (!context.user) {
        throw new Error("Authentication required");
      }
      if (context.user.role !== "admin") {
        throw new Error("Unauthorized access");
      }
      const deletedUser = await usersModel.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new Error("User not found");
      }
      return "User deleted successfully";
    } catch (err) {
      console.error("Deletion error:", err);
      throw new Error("Deletion failed: " + err.message);
    }
  },

   updateUser: async(_, { id, newFields }, context)=> {
    if (!context.user) { 
      throw new Error("Authentication required");
    }
    const updatedUser = await usersModel.findByIdAndUpdate(
      id,
      { $set: newFields },
      { new: true}
    );
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  },
};

export default userMutations;
