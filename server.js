import express from "express";

import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import bodyParser from "body-parser";
import cors from "cors";

//Routes
import userRoutes from "./routes/User.js";
import driveRoutes from "./routes/drive.js";

dotenv.config();

const app = express();
connectDB();

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/users", userRoutes);
app.use("/drives", driveRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`App is listening at port: ${process.env.PORT}`);
});
