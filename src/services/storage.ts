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

export function clearHands() {
  hands.clear();
}