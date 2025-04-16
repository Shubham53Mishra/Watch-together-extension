const socket = io("http://localhost:4000");
let currentRoom = null;

// ✅ Update room status text
function updateRoomStatus(roomId) {
  const status = document.getElementById("roomStatus");
  status.textContent = `Connected to room: ${roomId}`;
}

// ✅ Update user count
function updateUserCount(userCount) {
  const userCountElement = document.getElementById("userCount");
  userCountElement.textContent = `Users in this room: ${userCount}`;
}

// ✅ Open a URL in the current tab
function openInCurrentTab(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    chrome.tabs.update(currentTab.id, { url });
  });
}

// ✅ Create Room (YouTube)
document.getElementById("createRoomYouTube").addEventListener("click", () => {
  const roomId = `room-${Math.random().toString(36).substring(2, 9)}`;
  currentRoom = roomId;

  socket.emit("create-room", roomId, "youtube");
  updateRoomStatus(roomId); // Update status in the popup

  // Wait for the socket event to be processed before opening YouTube
  setTimeout(() => {
    const url = `https://www.youtube.com/watch?v=dQw4w9WgXcQ&roomId=${roomId}`;
    openInCurrentTab(url); // Open the YouTube link in the current tab
  }, 1500); // Adjust the delay time if necessary
});

// ✅ Create Room (Netflix)
document.getElementById("createRoomNetflix").addEventListener("click", () => {
  const roomId = `room-${Math.random().toString(36).substring(2, 9)}`;
  currentRoom = roomId;

  socket.emit("create-room", roomId, "netflix");
  updateRoomStatus(roomId); // Update status in the popup

  // Wait for the socket event to be processed before opening Netflix
  setTimeout(() => {
    const url = `https://www.netflix.com/watch/12345?roomId=${roomId}`;
    openInCurrentTab(url); // Open the Netflix link in the current tab
  }, 1500); // Adjust the delay time if necessary
});

// ✅ Join Room
document.getElementById("joinRoom").addEventListener("click", () => {
  const roomId = document.getElementById("roomId").value.trim();
  if (roomId) {
    currentRoom = roomId;
    socket.emit("join-room", roomId);
    updateRoomStatus(roomId); // Update status in the popup

    // Wait for the socket event to be processed before opening YouTube
    setTimeout(() => {
      const url = `https://www.youtube.com/watch?v=dQw4w9WgXcQ&roomId=${roomId}`;
      openInCurrentTab(url); // Open the YouTube link in the current tab
    }, 1500); // Adjust the delay time if necessary
  }
});

// ✅ Copy Room Link (YouTube default)
document.getElementById("copyRoomLink").addEventListener("click", () => {
  if (!currentRoom) return alert("No room created yet!");
  const url = `https://www.youtube.com/watch?v=dQw4w9WgXcQ&roomId=${currentRoom}`;
  navigator.clipboard.writeText(url).then(() => {
    alert("Room link copied!");
  });
});

// ✅ Listen for user count updates
socket.on("room-users", (userCount) => {
  updateUserCount(userCount); // Update the user count in the popup
});
