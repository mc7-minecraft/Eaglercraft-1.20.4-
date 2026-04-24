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
    const buttons = [
        { text: "Singleplayer", x: 50, y: 150 },
        { text: "Multiplayer", x: 50, y: 220 },
        { text: "Options", x: 50, y: 290 },
    ];

    buttons.forEach(btn => {
        ctx.fillStyle = "#333";
        ctx.fillRect(btn.x, btn.y - 30, 200, 50);
        ctx.strokeStyle = "#0f0";
        ctx.strokeRect(btn.x, btn.y - 30, 200, 50);

        ctx.fillStyle = "#0f0";
        ctx.font = "24px Arial";
        ctx.fillText(btn.text, btn.x + 20, btn.y);
    });

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
