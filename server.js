import express from "express";

import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import bodyParser from "body-parser";
import cors from "cors";

//Routes
import userRoutes from "./routes/User.js";
import adminRoutes from "./routes/Admin.js";

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

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

app.listen(process.env.PORT || 8000, () => {
  console.log(`App is listening at port: ${process.env.PORT}`);
});
