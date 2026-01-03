import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import healthRouter from "./routes/health";
import rootRouter from "./routes/root";

const app = express();

const HOST: string = process.env.HOST ?? "localhost";
const PORT: number = Number(process.env.PORT) || 3000;

app.disable("x-powered-by");

/* -----------------------------
   Security Middleware
------------------------------ */

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: true
  })
);

app.use(
  express.json({
    limit: "10kb",
    strict: true
  })
);

/* -----------------------------
   Routes
------------------------------ */

app.use(healthRouter);
app.use(rootRouter);

/* -----------------------------
   Error Handling
------------------------------ */

app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error(err);

    res.status(500).json({
      error: "Internal server error"
    });
  }
);

/* -----------------------------
   Startup
------------------------------ */

app.listen(PORT, () => {
  console.log(`Secure API running on http://${HOST}:${PORT}`);
});
