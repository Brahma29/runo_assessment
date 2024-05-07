import mongoose from "mongoose";

import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    aadharNo: {
      type: String,
      required: true,
      unique: true,
    },
    vaccinationStatus: {
      type: String,
      enum: ["notVaccinated", "firstDoseCompleted", "fullyVaccinated"],
      default: "notVaccinated",
    },
    password: {
      type: String,
      required: true,
    },
    registeredSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot'
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
