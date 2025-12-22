import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");

app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: true
}));

app.use(express.json({
    limit: "10kb",
    strict: true
}));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", content: "hello world" })
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({ error: "Internal server error" })
});

app.listen(PORT, () => {
    console.log(`Secure API running on http://${HOST}:${PORT}`)
});
