import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./router.js";
import cookieParser from "cookie-parser";
import { NASDatabase } from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const db = new NASDatabase();
db.init();
await db.close();

router(app);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}.`);
});
