# Handshake Backend

**Handshake Backend** is the server-side signaling component for the Handshake secure chat application.  
It provides real-time message relay and public key exchange without ever accessing plaintext messages. This backend complements the frontend client to enable secure end-to-end encrypted (E2EE) chat.

---

## 📌 Table of Contents

0. Live Demo
1. Project Overview  
2. Motivation  
3. Features  
4. Architecture  
5. WebSocket Protocol & Signaling  
6. Install & Development  
7. Configuration  
8. Testing  
9. Deployment  
10. Security Considerations  
11. Contributing  
12. License  

---

## 0. Live Demo

Access the live demo [here](https://handshake-backend-y29h.onrender.com)

---

## 1. Project Overview

Handshake Backend handles:

- WebSocket-based signaling for real-time communication
- Public key exchange between clients
- Relaying encrypted messages without decryption

**Technology stack**

- Runtime: Node.js  
- Language: TypeScript  
- Real-time: WebSocket
- Build: npm / tsconfig  

This repository contains only the backend; frontend can be found [here](https://github.com/alvarez-moreno-sergio/handshake-frontend).

---

## 2. Motivation

The backend ensures the **server never sees plaintext messages**, while clients can:

- Exchange public encryption/signing keys securely  
- Relay encrypted messages in real time  
- Maintain active WebSocket sessions  

The design keeps cryptography client-side while providing reliable real-time delivery.

---

## 3. Features

- Real-time WebSocket signaling  
- Public key exchange for RSA encryption and signing  
- Relay of end-to-end encrypted messages  
- Session management for active clients  
- Simple, auditable, and minimalistic backend design  

---

## 4. Architecture
```
Client A (Browser)
└─ WebSocket
│
▼
Handshake Backend (Node.js / TypeScript)
│
▼
Client B (Browser)
```


The server **never decrypts message content**. It only relays encrypted payloads and public keys.

---

## 5. WebSocket Protocol & Signaling

### Connection Flow

1. Client connects to WebSocket server  
2. Client sends event to register  
3. Encrypted messages are sent via websocket 
4. Server relays messages to intended recipients without inspecting content  
5. Disconnect events are handled to clean up session data  

## 6. Install & Development
### Requirements
- Node.js 18+
- npm

---

### Setup
```bash
git clone https://github.com/alvarez-moreno-sergio/handshake-backend.git
cd handshake-backend`
npm install
```
### Run Locally
```bash
npm run dev
```
Starts the WebSocket server for local development.

---

## 7. Configuration
None required.

---

## 8. Testing
```bash
npm run test
```
Validate WebSocket connection events, key exchange, and message relay.

Extend tests as the project grows.

---

## 9. Deployment
```bash
npm run build
```

---

## 10. Security Considerations
- Never log private keys.
- Use HTTPS/WSS for all communication.
- Rate-limit connections to prevent abuse.
- Monitor WebSocket events and sessions.

---

## 11. Contributing
- Fork the repository
- Create a feature branch
- Submit a pull request with clear documentation and tests

---

## 12. License
Apache-2.0 2026 Sergio Alvarez Moreno