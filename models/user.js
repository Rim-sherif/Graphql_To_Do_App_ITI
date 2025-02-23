import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 2,
      maxLength: 16,
    },
    email: {
        
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          return /^[a-zA-Z]{4,10}[0-9]{0,4}(@)(gmail|yahoo|outlook)(.com)$/.test(
            email
          );
        },
        message: (obj) => `${obj.value} is not correct`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { Collection: "User" }
);

userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) {
    return next();
  }


  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});
const usersModel = mongoose.model("User", userSchema);
export { usersModel };
