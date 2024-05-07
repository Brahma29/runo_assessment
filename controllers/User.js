import moment from "moment";
import Drive from "../models/Drive.js";
import Slot from "../models/Slot.js";
import User from "../models/User.js";
import { tokenGenerator } from "../utils/tokenGenerator.js";
import bcrypt from "bcryptjs";



export const registerUser = async (req, res, next) => {
  try {
    const isUserExists = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });

    if (isUserExists)
      return res.status(400).json({
        success: false,
        message: "Phone number is already registered!",
      });

    const newUser = await User.create(req.body);

    const token = tokenGenerator({ user: newUser._id });

    return res.status(201).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });

    const token = tokenGenerator({ user: user._id });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const registerSlot = async (req, res, next) => {
  try {
    const { time, date, driveId, doseNo } = req.body;
    const user = req.user;

    const drive = await Drive.findById(driveId);

    if (!drive)
      return res.status(404).json({
        success: false,
        message: `Drive not found with id ${driveId}!`,
      });

    const userToBeBooked = await User.findById(user);

    if (!userToBeBooked)
      return res.status(404).json({
        success: false,
        message: `User not found with id ${user}!`,
      });

    const existingSlot = await Slot.findOne({ "bookings.user": user });
    if (existingSlot)
      return res.status(400).json({
        success: false,
        message: "User is already booked in another slot!",
      });

    if (userToBeBooked.vaccinationStatus === "fullyVaccinated")
      return res.status(400).json({
        success: false,
        message: "User is already fully vaccinated!",
      });

    if (userToBeBooked.vaccinationStatus === "none" && doseNo === 2)
      return res.status(400).json({
        success: false,
        message: "User needs to take first dose before second!",
      });

    if (
      userToBeBooked.vaccinationStatus === "firstDoseCompleted" &&
      doseNo === 1
    )
      return res.status(400).json({
        success: false,
        message: "User has already taken the first dose!",
      });

    let slot = await Slot.findOne({ time, date });

    if (!slot) {
      slot = await Slot.create({
        time,
        date,
        availableDoses: drive.slotCapacity - 1,
        bookings: [{ user, dose: doseNo }],
      });
    } else {
      if (slot.availableDoses === 0)
        return res.status(400).json({
          success: false,
          message: "Slots not available in this time period!",
        });

      if (slot.bookings.some((booking) => booking.user.equals(user)))
        return res.status(400).json({
          success: false,
          message: "User already booked this slot!",
        });

      slot.bookings.push({ user, dose: doseNo });
      slot.availableDoses -= 1;
      await slot.save();
    }

    userToBeBooked.registeredSlot = slot._id;
    await userToBeBooked.save();

    return res.status(200).json({
      success: true,
      message: "Slot booked successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlot = async (req, res, next) => {
  try {
    const { time, date, driveId } = req.body;
    const user = req.user;

    const drive = await Drive.findById(driveId);

    if (!drive)
      return res.status(404).json({
        success: false,
        message: `Drive not found with id ${driveId}!`,
      });

    const userToBeUpdated = await User.findById(user);

    if (!userToBeUpdated)
      return res.status(404).json({
        success: false,
        message: `User not found with id ${user}!`,
      });

    const slot = await Slot.findById(userToBeUpdated.registeredSlot);

    if (!slot)
      return res.status(404).json({
        success: false,
        message: `Slot does not exist with the id ${userToBeUpdated.registeredSlot}!`,
      });

    const isUserRegistered = slot.bookings.some((booking) =>
      booking.user.equals(user)
    );
    if (!isUserRegistered)
      return res.status(400).json({
        success: false,
        message: `User is not registered in this slot!`,
      });

    let doseNo = slot.bookings.filter((booking) => booking.user.equals(user))[0]
      .dose;

    slot.bookings = slot.bookings.filter(
      (booking) => !booking.user.equals(user)
    );
    slot.availableDoses += 1;
    await slot.save();

    let updatedSlot = await Slot.findOne({ time, date });

    if (!updatedSlot) {
      const newSlot = await Slot.create({
        time,
        date,
        availableDoses: drive.slotCapacity - 1,
        bookings: [{ user, dose: doseNo }],
      });

      userToBeUpdated.registeredSlot = newSlot._id;
      await userToBeUpdated.save();
    } else if (
      updatedSlot.availableDoses > 0 &&
      !updatedSlot.bookings.some((booking) => booking.user.equals(user))
    ) {
      updatedSlot.bookings.push({ user, dose: doseNo });
      updatedSlot.availableDoses -= 1;
      await updatedSlot.save();
      userToBeUpdated.registeredSlot = updatedSlot._id;
      await userToBeUpdated.save();
    } else {
      return res.status(400).json({
        success: false,
        message:
          updatedSlot.availableDoses === 0
            ? "Slots not available in this time period!"
            : "User already booked this slot!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slot updated successfully!",
    });
  } catch (error) {
    next(error);
  }
};
