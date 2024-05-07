import jwt from "jsonwebtoken";

export const tokenGenerator = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return token;
  } catch (error) {
    console.log("Error genrating token: ", error.message);
  }
};
