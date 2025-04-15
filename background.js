window.addEventListener("message", function (event) {
  if (event.source !== window) return;

  if (event.data.type === "EXTENSION_PING") {
    console.log("[EXTENSION] Received EXTENSION_PING");
    window.postMessage({ type: "EXTENSION_PONG" }, "*");
  }
});
