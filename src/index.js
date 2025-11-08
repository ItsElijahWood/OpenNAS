import express from "express";
import cors from "cors";
import { database } from "./database.js";
import dotenv from "dotenv";
import { router } from "./router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

database();
router(app);

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}.`);
});
