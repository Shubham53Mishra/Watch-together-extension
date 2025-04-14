function setupSync() {
  const video = document.querySelector("video");

  if (!video || !window.socket) {
    console.log("Video or socket not ready");
    return;
  }

  // Send play
  video.addEventListener("play", () => {
    window.socket.emit("play", { time: video.currentTime });
  });

  // Send pause
  video.addEventListener("pause", () => {
    window.socket.emit("pause", { time: video.currentTime });
  });

  console.log("Sync enabled on video");
}

// Retry till video is available
const interval = setInterval(() => {
  const video = document.querySelector("video");
  if (video && window.socket) {
    clearInterval(interval);
    setupSync();
  }
}, 1000);
