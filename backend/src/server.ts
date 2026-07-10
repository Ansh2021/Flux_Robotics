import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes/frcRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;
const environment = process.env.NODE_ENV;
const FRONTEND_URL =
  environment === "production"
    ? "https://fluxrobotics.vercel.app"
    : "http://localhost:5000";

const frcRouter = router;

app.get("/api/frc/health", (req, res) => {
  res.json({ status: "backend is up and running" });
});

app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "apikey",
      "x-client-info",
    ],
    credentials: true,
  }),
);
app.use(express.json());

// app.get("/", (req: Request, res: Response) => {
//   res.json({ message: "hi!" });
// });

// app.get("/api/health", (req: Request, res: Response) => {
//   res.json({ status: "ok", message: "Backend is running!" });
// });

app.use("/api/frc", frcRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
