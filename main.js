// main.js — Minecraft-like launcher with pixel font, tiled background, and mock server list
(() => {
  const config = {
    title: "Eaglercraft Launcher",
    titleColor: "#7FFF7F",
    fontFamily: "PixelFont, 'Courier New', monospace",
    titleFont: "36px PixelFont, monospace",
    buttonFont: "18px PixelFont, monospace",
    bgTile: "assets/img/tile.png", // put a small tile image here (32x32 or 64x64)
    assetFile: "assets.epk",
  };

  let state = "menu"; // menu | single | multi | options | loading
  let hoverIndex = -1;
  let selectedIndex = 0;
  let assetsInfo = { loaded: false, size: 0, received: 0 };

  const buttons = [
    { id: "single", text: "Singleplayer" },
    { id: "multi", text: "Multiplayer" },
    { id: "options", text: "Options" },
    { id: "quit", text: "Quit" },
  ];

  // Mock server list (editable)
  const mockServers = [
    { name: "Localhost", address: "127.0.0.1:25565", players: "1/20" },
    { name: "Vanilla Fun", address: "vanilla.example:25565", players: "12/100" },
    { name: "Creative Realm", address: "creative.example:25565", players: "4/50" },
  ];

  window.onAssetsReady = window.onAssetsReady || function (blob) {
    console.log("Assets ready (blob):", blob);
  };
  window.startEngine = window.startEngine || function () {
    console.log("startEngine called (replace with real engine).");
  };

  window.addEventListener("load", () => {
    const container = document.getElementById("game-frame") || document.body;
    const canvas = document.createElement("canvas");
    canvas.id = "mc-canvas";
    canvas.width = Math.max(900, window.innerWidth);
    canvas.height = Math.max(600, window.innerHeight);
    canvas.style.display = "block";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    // Load tile image if present
    const tileImg = new Image();
    tileImg.src = config.bgTile;
    tileImg.onload = () => draw();

    function clear() {
      ctx.fillStyle = "#0b0b0b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function tileBackground() {
      if (tileImg.complete && tileImg.naturalWidth) {
        const tw = tileImg.naturalWidth;
        const th = tileImg.naturalHeight;
        for (let y = 0; y < canvas.height; y += th) {
          for (let x = 0; x < canvas.width; x += tw) {
            ctx.drawImage(tileImg, x, y, tw, th);
          }
        }
        // subtle dark overlay
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        clear();
      }
    }

    function drawText(text, x, y, font, color) {
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.fillText(text, x, y);
    }

    function drawBlock(x, y, w, h, fill, border) {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = border;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, h);
    }

    function menuLayout() {
      const left = 60;
      const top = 140;
      const w = 340;
      const h = 56;
      return { left, top, w, h, gap: 18 };
    }

    function drawMenu() {
      tileBackground();
      drawText(config.title, 60, 90, config.titleFont, config.titleColor);

      const layout = menuLayout();
      buttons.forEach((b, i) => {
        const x = layout.left;
        const y = layout.top + i * (layout.h + layout.gap);
        const w = layout.w;
        const h = layout.h;
        const bg = i === hoverIndex ? "#8fbf8f" : "#6b6b6b";
        drawBlock(x, y, w, h, bg, "#000");
        ctx.fillStyle = "#000";
        ctx.font = config.buttonFont;
        ctx.fillText(b.text, x + 18, y + 36);
        b._rect = { x, y, w, h };
      });

      ctx.fillStyle = "#cfcfcf";
      ctx.font = "12px PixelFont, monospace";
      ctx.fillText("assets: " + (assetsInfo.loaded ? "ready" : "not loaded"), 60, canvas.height - 36);
    }

    function drawLoading(progress, total) {
      clear();
      drawText("Loading Assets", 60, 120, "28px PixelFont, monospace", "#fff");
      const barX = 60;
      const barY = 160;
      const barW = 600;
      const barH = 28;
      ctx.fillStyle = "#333";
      ctx.fillRect(barX, barY, barW, barH);
      const pct = total ? Math.min(1, progress / total) : 0;
      ctx.fillStyle = "#7FFF7F";
      ctx.fillRect(barX, barY, Math.floor(barW * pct), barH);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeRect(barX, barY, barW, barH);
      ctx.fillStyle = "#fff";
      ctx.font = "14px PixelFont, monospace";
      ctx.fillText(`${Math.floor(pct * 100)}%`, barX + barW + 12, barY + 20);
    }

    function drawSingleplayer() {
      tileBackground();
      drawText("Singleplayer", 60, 90, "28px PixelFont, monospace", "#fff");
      drawText("No worlds yet. (placeholder)", 60, 150, "16px PixelFont, monospace", "#ddd");
      drawBackHint();
    }

    function drawMultiplayer() {
      tileBackground();
      drawText("Multiplayer", 60, 90, "28px PixelFont, monospace", "#fff");
      ctx.font = "16px PixelFont, monospace";
      ctx.fillStyle = "#ddd";
      ctx.fillText("Server List:", 60, 140);

      // draw server list box
      const sx = 60, sy = 160, sw = 700, sh = 260;
      drawBlock(sx, sy, sw, sh, "#2b2b2b", "#000");

      // list entries
      ctx.font = "16px PixelFont, monospace";
      mockServers.forEach((s, i) => {
        const entryY = sy + 36 + i * 48;
        ctx.fillStyle = "#fff";
        ctx.fillText(s.name, sx + 12, entryY);
        ctx.fillStyle = "#bfbfbf";
        ctx.fillText(s.address + " • " + s.players, sx + 12, entryY + 20);
      });

      drawBackHint();
    }

    function drawOptions() {
      tileBackground();
      drawText("Options", 60, 90, "28px PixelFont, monospace", "#fff");
      drawText("Volume: 100% (stored in localStorage)", 60, 150, "16px PixelFont, monospace", "#ddd");
      drawBackHint();
    }

    function drawBackHint() {
      ctx.fillStyle = "#bfbfbf";
      ctx.font = "12px PixelFont, monospace";
      ctx.fillText("Press Escape to return to menu", 60, canvas.height - 36);
    }

    function getMousePos(evt) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.round((evt.clientX - rect.left) * (canvas.width / rect.width)),
        y: Math.round((evt.clientY - rect.top) * (canvas.height / rect.height)),
      };
    }

    canvas.addEventListener("mousemove", (e) => {
      const pos = getMousePos(e);
      if (state === "menu") {
        let found = -1;
        buttons.forEach((b, i) => {
          if (b._rect && pos.x >= b._rect.x && pos.x <= b._rect.x + b._rect.w && pos.y >= b._rect.y && pos.y <= b._rect.y + b._rect.h) {
            found = i;
          }
        });
        if (found !== hoverIndex) {
          hoverIndex = found;
          draw();
        }
      }
    });

    canvas.addEventListener("click", (e) => {
      const pos = getMousePos(e);
      if (state === "menu") {
        buttons.forEach((b, i) => {
          if (b._rect && pos.x >= b._rect.x && pos.x <= b._rect.x + b._rect.w && pos.y >= b._rect.y && pos.y <= b._rect.y + b._rect.h) {
            handleButton(b.id);
          }
        });
      } else if (state === "loading") {
        // ignore
      } else {
        state = "menu";
        draw();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (state === "menu") {
        if (e.key === "ArrowDown") {
          selectedIndex = (selectedIndex + 1) % buttons.length;
          hoverIndex = selectedIndex;
          draw();
        } else if (e.key === "ArrowUp") {
          selectedIndex = (selectedIndex - 1 + buttons.length) % buttons.length;
          hoverIndex = selectedIndex;
          draw();
        } else if (e.key === "Enter") {
          const b = buttons[selectedIndex];
          if (b) handleButton(b.id);
        }
      } else {
        if (e.key === "Escape") {
          state = "menu";
          draw();
        }
      }
    });

    function handleButton(id) {
      if (id === "single") {
        state = "single";
        draw();
      } else if (id === "multi") {
        state = "multi";
        draw();
      } else if (id === "options") {
        state = "options";
        draw();
      } else if (id === "quit") {
        clear();
        drawText("Goodbye!", 60, 120, "28px PixelFont, monospace", "#fff");
        setTimeout(() => window.close && window.close(), 600);
      }
    }

    async function loadAssetsWithProgress(url) {
      state = "loading";
      drawLoading(0, 1);
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Failed to fetch assets");
        const contentLength = resp.headers.get("Content-Length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        if (!resp.body || !resp.body.getReader) {
          const blob = await resp.blob();
          assetsInfo = { loaded: true, size: blob.size, received: blob.size };
          window.onAssetsReady(blob);
          state = "menu";
          draw();
          return;
        }

        const reader = resp.body.getReader();
        let received = 0;
        const chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          assetsInfo.received = received;
          assetsInfo.size = total;
          drawLoading(received, total);
        }
        const blob = new Blob(chunks);
        assetsInfo = { loaded: true, size: blob.size, received: blob.size };
        window.onAssetsReady(blob);
        state = "menu";
        draw();
      } catch (err) {
        console.error("Asset load failed", err);
        clear();
        drawText("Failed to load assets.epk", 60, 120, "20px PixelFont, monospace", "#ff8080");
      }
    }

    function drawLoading(progress, total) {
      // reuse earlier function but ensure it's available
      const barX = 60;
      const barY = 160;
      const barW = 600;
      const barH = 28;
      clear();
      drawText("Loading Assets", 60, 120, "28px PixelFont, monospace", "#fff");
      ctx.fillStyle = "#333";
      ctx.fillRect(barX, barY, barW, barH);
      const pct = total ? Math.min(1, progress / total) : 0;
      ctx.fillStyle = "#7FFF7F";
      ctx.fillRect(barX, barY, Math.floor(barW * pct), barH);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeRect(barX, barY, barW, barH);
      ctx.fillStyle = "#fff";
      ctx.font = "14px PixelFont, monospace";
      ctx.fillText(`${Math.floor(pct * 100)}%`, barX + barW + 12, barY + 20);
    }

    function draw() {
      if (state === "menu") drawMenu();
      else if (state === "loading") drawLoading(assetsInfo.received || 0, assetsInfo.size || 1);
      else if (state === "single") drawSingleplayer();
      else if (state === "multi") drawMultiplayer();
      else if (state === "options") drawOptions();
    }

    draw();

    // Auto-load assets if present
    fetch(config.assetFile, { method: "HEAD" })
      .then((r) => {
        if (r.ok) setTimeout(() => loadAssetsWithProgress(config.assetFile), 400);
      })
      .catch(() => {});

    window.loadLauncherAssets = (file) => loadAssetsWithProgress(file || config.assetFile);
    window.startEngineWhenReady = async () => {
      if (assetsInfo.loaded) window.startEngine();
      else {
        await loadAssetsWithProgress(config.assetFile);
        window.startEngine();
      }
    };

    window.addEventListener("resize", () => {
      canvas.width = Math.max(900, window.innerWidth);
      canvas.height = Math.max(600, window.innerHeight);
      draw();
    });
  });
})();
