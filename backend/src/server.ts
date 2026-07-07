import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes/frcRoutes.js";

const app = express();
const PORT = process.env.PORT || 7000;
const FRONTEND_URL = process.env.VERCEL_ENV ? false : "http://localhost:3000";

const frcRouter = router;

app.use(
  cors({
    origin: FRONTEND_URL,
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

app.use("/frc", frcRouter);

if (!process.env.VERCEL_ENV) {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

export default app;
