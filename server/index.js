import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import captionRouter from "./routes/caption.js";
import imageRouter from "./routes/image.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/caption", captionRouter);
app.use("/api/generate-image", imageRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
