import { Router, Request, Response } from "express";
import { clearHands } from "../services/storage.js";

const router = Router();

router.get("/clear", (_req: Request, res: Response) => {
    // clearHands();
    // console.log("Cleared all registered hands.");
    res.status(200).json({ status: "Not Implemented." });
});

export default router;
