import { Router, Request, Response } from "express";
import Hand from "../models/hand";
import { registerSchema } from "../schemas/register";
import { addHand } from "../services/storage";

const router = Router();

router.post("/register", (req: Request, res: Response) => {
    const parseBody = registerSchema.safeParse(req.body);
    if (!parseBody.success) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    const {name, publicKey, publicSignKey} = parseBody.data;
    const hand = new Hand(name, publicKey, publicSignKey);
    addHand(hand);

    res.status(201).json({
        uuid: hand.uuid,
        name: hand.name
    });
});

export default router;
