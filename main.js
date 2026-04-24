// main.js — pseudo Minecraft launcher scaffold

window.addEventListener("load", () => {
    const gameFrame = document.getElementById("game-frame");

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";
    gameFrame.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // Simple background
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#0f0";
    ctx.font = "40px Arial";
    ctx.fillText("Eaglercraft Launcher", 50, 80);

    // Menu buttons (pseudo)
    // main.js — Minecraft-style launcher scaffold

window.addEventListener("load", () => {
    const gameFrame = document.getElementById("game-frame");

    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameFrame.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // --- Helper: draw blocky button ---
    function drawButton(btn) {
        ctx.fillStyle = "#555"; // dark gray background
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

        ctx.strokeStyle = "#000"; // black outline
        ctx.lineWidth = 4;
        ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

        ctx.fillStyle = "#fff"; // white text
        ctx.font = "20px 'Courier New', monospace"; // pixel-ish font
        ctx.fillText(btn.text, btn.x + 20, btn

    // Example asset loader hook
    function loadAssets(epkFile) {
        console.log("Pretend loading assets from:", epkFile);
        // In real client, this would unpack assets.epk
    }

    loadAssets("assets.epk");

    // Example game loop placeholder
    function loop() {
        // Animate a spinning square
        const time = Date.now() / 500;
        const x = 400 + Math.sin(time) * 100;
        const y = 200 + Math.cos(time) * 100;

        ctx.fillStyle = "#ff0";
        ctx.clearRect(300, 100, 300, 300);
        ctx.fillRect(x, y, 50, 50);

        requestAnimationFrame(loop);
    }

    loop();
});
async function loadAssets(epkFile) {
    try {
        const response = await fetch(epkFile);
        if (!response.ok) throw new Error("Failed to load assets");
        console.log("Loaded assets.epk:", await response.blob());
    } catch (err) {
        console.error("Asset load error:", err);
    }
}
loadAssets("assets.epk");
// main.js — Minecraft-style launcher scaffold

window.addEventListener("load", () => {
    const gameFrame = document.getElementById("game-frame");

    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gameFrame.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // --- Helper: draw blocky button ---
    function drawButton(btn) {
        ctx.fillStyle = "#555"; // dark gray background
        ctx.fillRect(btn.x, btn.y, btn.w, btn.h);

        ctx.strokeStyle = "#000"; // black outline
        ctx.lineWidth = 4;
        ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);

        ctx.fillStyle = "#fff"; // white text
        ctx.font = "20px 'Courier New', monospace"; // pixel-ish font
        ctx.fillText(btn.text, btn.x + 20, btn
                     // main.js — Minecraft-style launcher with clickable buttons

window.addEventListener("load", () => {
    const gameFrame = document.getElementById("game-frame");

    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas
//this is not officially complete
