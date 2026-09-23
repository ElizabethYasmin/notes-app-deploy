import { Client } from "@stomp/stompjs";
import { getAuthHeader } from "./http";

const API_URL = import.meta.env.VITE_API_URL;
// http://localhost:8080/api -> ws://localhost:8080/ws
// https://xxx.up.railway.app/api -> wss://xxx.up.railway.app/ws
const WS_URL = API_URL.replace(/^http/, "ws").replace(/\/api\/?$/, "") + "/ws";

let client: Client | null = null;

/**
 * Opens a STOMP-over-WebSocket connection and calls `onUpdate` every time the server
 * says "something changed for this user" — the caller decides what to refetch.
 * Credentials go in the STOMP CONNECT frame (connectHeaders), not the WS handshake itself,
 * since a browser WebSocket can't carry a custom Authorization header.
 */
export function connectRealtime(onUpdate: () => void) {
  const authHeader = getAuthHeader();
  if (!authHeader) return;

  client = new Client({
    brokerURL: WS_URL,
    connectHeaders: { Authorization: authHeader },
    reconnectDelay: 5000,
    onConnect: () => {
      client?.subscribe("/user/queue/updates", () => {
        onUpdate();
      });
    },
  });

  client.activate();
}

export function disconnectRealtime() {
  client?.deactivate();
  client = null;
}
