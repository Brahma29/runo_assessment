import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
    },
    time: {
      type: String,
      required: true,
    },
    availableDoses: {
      type: Number,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Slot = mongoose.model("Slot", SlotSchema);

export default Slot;
