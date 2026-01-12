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
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production"){
  dotenv.config();
}

const HOST: string = process.env.HOST ?? "localhost";
const PORT: number = Number(process.env.PORT) || 3000;
const ALLOWED_ORIGINS: string[] = [
  process.env.FRONTEND_ORIGIN!
].filter(Boolean);
const WS_URL: string = process.env.WEBSOCKET_URL!;

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

/* -----------------------------
   Security Middleware
------------------------------ */
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: false
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'", WS_URL],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"]
      }
    }
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
