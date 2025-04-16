// Inject socket.io.min.js
const script = document.createElement('script');
script.src = chrome.runtime.getURL('socket.io.min.js'); // Extension se script inject hota hai
document.head.appendChild(script);

// Wait for Socket.IO to load
script.onload = () => {
  const socket = io("http://localhost:4000");  // Socket server ke saath connect
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");  // URL se room ID fetch karo

  if (!roomId) return;

  console.log("✅ Extension loaded on video");
  console.log("🆔 Room ID:", roomId);

  // Check if the room already exists in an open tab
  chrome.tabs.query({ url: `*://*.youtube.com/*` }, (tabs) => {
    let existingTab = null;

    // Loop through tabs to find one with the same roomId
    for (const tab of tabs) {
      if (tab.url.includes(roomId)) {
        existingTab = tab;
        break;
      }
    }

    // If an existing tab is found, focus on it
    if (existingTab) {
      console.log("✅ Found existing tab with the same room ID, focusing on it.");
      chrome.tabs.update(existingTab.id, { active: true });

      // Inject code to sync the video on that tab
      chrome.scripting.executeScript({
        target: { tabId: existingTab.id },
        func: syncVideo,
        args: [roomId],
      });
    } else {
      // If no tab found, open a new one
      console.log("🔴 No existing tab found with the room ID. Opening a new tab.");
      chrome.tabs.create({ url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&roomId=${roomId}` });
    }
  });

  // Function to sync video in the tab
  function syncVideo(roomId) {
    const video = document.querySelector("video");
    if (!video) return;

    const socket = io("http://localhost:4000");
    socket.emit("join-room", roomId);  // Room join karo

    // Local play event
    video.addEventListener("play", () => {
      console.log("🟢 Local Play", video.currentTime);
      socket.emit("play", {  // Play event ko emit karo
        roomId,
        time: video.currentTime,
        senderId: socket.id,
      });
    });

    // Local pause event
    video.addEventListener("pause", () => {
      console.log("🔴 Local Pause", video.currentTime);
      socket.emit("pause", {  // Pause event ko emit karo
        roomId,
        time: video.currentTime,
        senderId: socket.id,
      });
    });

    // Remote play event (Doosre user se sync)
    socket.on("play", ({ time, senderId }) => {
      if (socket.id === senderId) return;
      console.log("▶️ Remote Play", time);
      video.currentTime = time;  // Video ko sync karo
      video.play();
    });

    // Remote pause event (Doosre user se sync)
    socket.on("pause", ({ time, senderId }) => {
      if (socket.id === senderId) return;
      console.log("⏸️ Remote Pause", time);
      video.currentTime = time;  // Video ko sync karo
      video.pause();
    });
  }
};
