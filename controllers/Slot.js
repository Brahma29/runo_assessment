import Drive from "../models/Drive.js";
import Slot from "../models/Slot.js";

export const getAllSlots = async (req, res, next) => {
  try {
    const slots = await Slot.find({});

    return res.status(200).json({
      success: true,
      slots,
    });
  } catch (error) {
    next(error);
  }
};

export const bookSlot = async (req, res, next) => {
  try {
    const { driveId, time, user } = req.body;

    const drive = await Drive.findById(driveId);

    if (!drive)
      return res.status(400).json({
        success: false,
        message: `Drive with id ${driveId} does not exists!`,
      });

    if (drive.startTime > time || drive.endTime < time)
      return res.status(400).json({
        success: false,
        message: "Please provide time within drive time!",
      });

    const slot = await Slot.findOne({ time });

    if (!slot) {
      const newSlot = await Slot.create({
        drive: driveId,
        time,
        availableDoses: drive.dosesAvailablePerSlot - 1,
        users: [user],
      });
    } else if (slot.availableDoses > 0 && !slot.users.includes(userId)) {
      slot.availableDoses -= 1;
      slot.users.push(user);
      await slot.save();
    } else {
      return res.status(400).json({
        success: false,
        message:
          slot.availableDoses > 0
            ? "Booking already exist for this user!"
            : "Slot is full!",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Slot booked successfully!",
    });
  } catch (error) {
    next(error);
  }
};
