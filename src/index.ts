import http from "http";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import healthRouter from "./routes/health.js";
import rootRouter from "./routes/root.js";
import registerRouter from "./routes/register.js";
import peersRouter from "./routes/peers.js";
import clearRouter from "./routes/clear.js";
import { initWebSocket } from "./services/socket.js";

const HOST: string = process.env.HOST ?? "localhost";
const PORT: number = Number(process.env.PORT) || 3000;

const app = express();
app.set("trust proxy", 1); // Trust Railway
app.disable("x-powered-by");

/* -----------------------------
   Security Middleware
------------------------------ */
app.use(
  cors({
    origin: `http://${HOST}:5173`,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false
  })
);

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
app.use(registerRouter);
app.use(peersRouter);

app.use(clearRouter);

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
const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Secure API running on http://${HOST}:${PORT}`);
});
