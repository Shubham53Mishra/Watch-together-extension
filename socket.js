// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Add Socket.IO CDN dynamically
  const script = document.createElement("script");
  script.src = "https://cdn.socket.io/4.5.4/socket.io.min.js";
  
  // When the script is loaded, establish the socket connection
  script.onload = () => {
    window.socket = io("https://watch-together-backend-2z6t.onrender.com");

    window.socket.on("play", ({ time }) => {
      const video = document.querySelector("video");
      if (video) {
        video.currentTime = time;
        video.play();
      }
    });

    window.socket.on("pause", ({ time }) => {
      const video = document.querySelector("video");
      if (video) {
        video.currentTime = time;
        video.pause();
      }
    });
  };

  // Append the script to the document head
  document.head.appendChild(script);
});
