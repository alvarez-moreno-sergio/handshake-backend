import { Router, Request, Response } from "express";
import { getHand } from "../services/storage";

const router = Router();

// GET /peers/:uuid - returns the public key of a peer hand
router.get("/peers/:uuid", (req: Request, res: Response) => {
  const { uuid } = req.params;
  const hand = getHand(uuid);

  if (!hand) {
    return res.status(404).json({ error: "Hand not found" });
  }

  // Only expose public key for intended peer
  res.status(200).json({
    uuid: hand.uuid,
    publicKey: hand.publicKey
  });
});

export default router;
