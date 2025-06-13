import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

function waitForSocketConnection(callback) {
  if (socket.connected) {
    callback();
  } else {
    socket.on("connect", () => {
      callback();
    });
  }
}

export { socket, waitForSocketConnection };