const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please enter your frist name"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Please enter last your name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "password must be up to 6 character"],
    },
    passwordChangedAt: {
      type: Date,
    },
    // passwordResetCode:{
    //   type: String
    // },
    // passwordResetExpires:{
    //   type:Date
    // },
    // passwordResetVerfid:{
    //   type: Boolean,
    //   default: false
    // },

    role: {
      type: String,
      enum: ["admin", "manager", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // chiled refrance {one to many}
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",// reference to the Product model
      },
    ],
    addresses:[
      {
        id:{type:mongoose.Schema.Types.ObjectId},
        alise:String,
        details:String,
        city:String,
        phone:String,
        postalCode:String,
      }
    ]
  },
  { timestamps: true }
);

// encrypt password and save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //hash password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
