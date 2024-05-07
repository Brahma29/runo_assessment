import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
  {
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true,
    },
    availableDoses: {
      type: Number,
      required: true,
    },
    bookings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        dose: { type: Number, required: true }
      }
    ],
  },
  { timestamps: true }
);

const Slot = mongoose.model("Slot", SlotSchema);

export default Slot;
