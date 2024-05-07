import mongoose from "mongoose";

const DriveSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    dosesAvailablePerSlot: {
      type: Number,
      required: true,
    },
    slotDuration: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Drive = mongoose.model("Drive", DriveSchema);

export default Drive;
