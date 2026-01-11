import { Router, Request, Response } from "express";
import Hand from "../models/hand.js";
import { registerSchema } from "../schemas/register.js";
import { addHand, hasHand } from "../services/storage.js";

const router = Router();

router.post("/register", (req: Request, res: Response) => {
    console.log("Received registration request:", req.body);

    const parseBody = registerSchema.safeParse(req.body);
    if (!parseBody.success) {
        return res.status(400).json({
            msg: "Rejected: Invalid registration data",
            issues: parseBody.error.issues,
            body: req.body
        });
    }

    const {name, avatarUrl, publicKey, publicSignKey} = parseBody.data;
    if (hasHand(name)) {
        return res.status(409).json({ error: "Rejected: Hand with this name already exists" });
    }

    const hand = new Hand(name, avatarUrl, publicKey, publicSignKey);
    addHand(hand);

    res.status(201).json({
        key: hand.uuid,
        uuid: hand.uuid,
        name: hand.name
    });
});

export default router;
