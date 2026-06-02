import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 7000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "hi!" });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
