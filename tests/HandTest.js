import { generateRSAKeys, generateRSASigningKeys, exportPublicKey } from "./helpers/RSA.ts";
import WebSocket from "ws";

let amount = 0;

const handName = process.argv[2];
const targetName = process.argv[3];
const isSender = targetName !== undefined;

function validate() {
  console.log(`=== Parameters ===`);
  console.log(`Hand Name:    ${handName}`);
  console.log(`Target Hand:  ${targetName}`);

  if (!handName) {
    console.error("Error: Hand name is required as the first argument.");
    process.exit(1);
  }

  if (isSender) {
    console.info("This Hand will send messages to Hand:", targetName);
  }
  else {
    console.info("This Hand will only receive messages.");
  }

  console.log(`==================`);
}

async function run() {
  validate();

  const keys = await generateRSAKeys();
  const signKeys = await generateRSASigningKeys();
  const hand = {
    name: handName,
    publicKey: await exportPublicKey(keys.publicKey),
    publicSignKey: await exportPublicKey(signKeys.publicKey)
  };
  console.log(`Registering: ${hand.name} ...`);

  const res = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hand)
  });
  const data = await res.json();
  console.log("Register response:", data);

  hand.uuid = data.uuid;

  const ws = new WebSocket("ws://localhost:3000");

  ws.on("open", () => {
    ws.send(JSON.stringify({ type: "subscribe", uuid: hand.uuid }));
  });

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    console.log(`${hand.name} received message: `, data);

    if (isSender && data.type === "peerList" && amount++ < 1) {
      const targetHand = data.peers.find((p) => p.name === targetName);
      if (!targetHand) {
        console.error(`Target Hand: ${targetName} not found in peer list.`);
        return;
      }

      console.log(`Sending a message to ${targetHand.name} (${targetHand.uuid}) ...`);
      ws.send(JSON.stringify({
        type: "send",
        to: targetHand.uuid,
        from: hand.uuid,
        content: `Hello ${targetHand.name}, this is ${hand.name}!`
      }));
    }
  });

  ws.on("error", (err) => console.error("WS Error:", err));
}

run();
