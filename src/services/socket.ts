import { WebSocket, Server as WebSocketServer } from "ws";
import { getHand } from "./storage.js";

interface Connection {
  socket: WebSocket;
  handUuid: string;
}

const connections = new Map<string, Connection>();

/** Broadcast the current peer list to all connected Hands */
function broadcastPeerList() {
  const peerList = Array.from(connections.values()).map(({ handUuid }) => {
    const hand = getHand(handUuid);
    return hand ? { 
        uuid: hand.uuid,
        publicKey: hand.publicKey,
        publicSignKey: hand.publicSignKey
    } : null;
  }).filter(Boolean);

  const msg = JSON.stringify({ type: "peerList", peers: peerList });

  for (const { socket } of connections.values()) {
    socket.send(msg);
  }
}

export function initWebSocket(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket, req) => {
    let handUuid: string | null = null;

    socket.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());

        // First message should be { type: "register", uuid: "..." }
        if (msg.type === "connect") {
          const hand = getHand(msg.uuid);
          if (!hand) {
            socket.send(JSON.stringify({ error: "Invalid Hand UUID" }));
            socket.close();
            return;
          }
          handUuid = hand.uuid;
          connections.set(handUuid, { socket, handUuid });
          socket.send(JSON.stringify({ status: "connected" }));

          broadcastPeerList();
          return;
        }

        // Forward encrypted chat messages
        if (msg.type === "chat" && handUuid) {
          const peerConn = connections.get(msg.to);
          if (peerConn) {
            peerConn.socket.send(JSON.stringify({
              from: handUuid,
              content: msg.content
            }));
          }
        }
      } catch (err) {
        socket.send(JSON.stringify({ error: "Malformed message", details: err }));
      }
    });

    socket.on("close", () => {
      if (handUuid) {
        connections.delete(handUuid);
        broadcastPeerList();
      }
    });
  });

  return wss;
}
