import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes/frcRoutes.js";

const app = express();
const PORT = process.env.PORT || 7000;
const environment = process.env.VERCEL_ENV;
const FRONTEND_URL =
  environment === "production" || environment === "preview"
    ? false
    : "http://localhost:3000";

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

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

export default app;
