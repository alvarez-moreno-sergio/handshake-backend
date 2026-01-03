import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { getHand } from "./storage.js";
import Hand from "../models/hand.js";

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

interface Connection {
  socket: WebSocket;
  uuid: string;
}

const connections = new Map<string, Connection>();

/** Broadcast the current peer list to all connected Hands */
function broadcastPeerList() {
  const peerList = Array.from(connections.values()).map(({ uuid }) => {
    const hand = getHand(uuid);
    return hand;
  }).filter(Boolean);

  const msg = JSON.stringify({ type: "peerList", peers: peerList });
  console.log("Broadcasting peer list to", connections.size, "connections");

  for (const { socket } of connections.values()) {
    try {
      socket.send(msg);
    } catch (err) {
      console.error("Failed to send peer list:", err);
    }
  }
}

export function initWebSocket(server: any) {
  const wss = new WebSocketServer({
    server,
    verifyClient: (
      info: { origin: string; req: IncomingMessage },
      done
    ) => {
      const { origin } = info;

      if (origin === FRONTEND_ORIGIN) {
        done(true);
      } else {
        done(false, 403, "Forbidden");
      }
    }
  });

  wss.on("connection", (socket, _req) => {
    let hand: Hand | undefined = undefined;

    socket.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());

        // First message should be { type: "subscribe", uuid: "..." }
        if (msg.type === "subscribe") {
          hand = getHand(msg.uuid);
          if (!hand) {
            socket.send(JSON.stringify({ error: "Invalid Hand UUID" }));
            socket.close();
            return;
          }
          connections.set(hand.uuid, { socket, uuid: hand.uuid });
          socket.send(JSON.stringify({ status: "subscribed" }));

          broadcastPeerList();
          return;
        }

        // Forward encrypted chat messages
        if (msg.type === "send" && hand) {
          console.log(`Forwarding message from Hand: ${hand.name} (${hand.uuid}) to Hand UUID: ${msg.to}: `, msg.content);
          const peerConn = connections.get(msg.to);
          if (peerConn) {
            peerConn.socket.send(JSON.stringify({
              type: "message",
              from: hand.uuid,
              content: msg.content
            }));
          }
          return;
        }

        if (!hand) {
          socket.send(JSON.stringify({ error: "Handshake not established" }));
          return;
        }
      } catch (err) {
        socket.send(JSON.stringify({ error: "Malformed message", details: err instanceof Error ? err.message : String(err) }));
      }
    });

    socket.on("close", () => {
      if (hand) {
        console.log(`Connection closed for Hand: ${hand.name} (${hand.uuid})`);
        connections.delete(hand.uuid);
        broadcastPeerList();
      }
    });
  });

  return wss;
}