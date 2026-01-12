import Hand from "../models/hand.js";

const hands = new Map<string, Hand>();

export function addHand(hand: Hand) {
  hands.set(hand.uuid, hand);
}

export function getHand(uuid: string): Hand | undefined {
  return hands.get(uuid);
}

export function hasHand(name: string): boolean {
  return [...hands.values()].some(h => h.name === name);
}

export function listHands(): Hand[] {
  return Array.from(hands.values());
}

export function rotateHandKeys(uuid: string, publicKey: string, publicSignKey: string): boolean {
  let hand: Hand | undefined = getHand(uuid);
  if (!hand) return false;
  
  hand.publicKey = publicKey;
  hand.publicSignKey = publicSignKey;

  return true;
}

export function clearHands() {
  hands.clear();
}