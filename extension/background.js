let socket;

// Establish connection to Socket.IO server
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "socket-room") {
    if (!socket) {
      socket = io("http://localhost:4000");

      socket.on("connect", () => {
        console.log("✅ Connected from background:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("❌ Disconnected");
      });

      // Listen for user count updates and forward them to the popup
      socket.on("room-users", (userCount) => {
        port.postMessage({ type: "update-user-count", userCount });
      });

      // Listen for play/pause if needed (optional feature for your app)
      socket.on("play-pause", (action) => {
        port.postMessage({ type: "play-pause", action });
      });
    }

    // Handle incoming messages from the popup
    port.onMessage.addListener((msg) => {
      if (msg.type === "join-room") {
        socket.emit("join-room", msg.roomId);
      } else if (msg.type === "create-room") {
        socket.emit("create-room", msg.roomId, msg.platform);
      }
    });
  }
});
