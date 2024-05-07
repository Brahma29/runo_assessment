import Drive from "../models/Drive.js";

export const createDrive = async (req, res, next) => {
  try {
    const drive = await Drive.create(req.body);

    return res.status(201).json({
      success: true,
      drive,
    });
  } catch (error) {
    next(error);
  }
};
