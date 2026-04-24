// main.js — Minecraft-like launcher scaffold with interactivity and asset hook
// Drop into your repo as main.js

(() => {
  // ---------- Config and State ----------
  const config = {
    title: "Eaglercraft Launcher",
    canvasBg: "#1e1e1e",
    titleColor: "#7FFF7F",
    buttonBg: "#6b6b6b",
    buttonBorder: "#000000",
    buttonText: "#ffffff",
    font: "20px 'Courier New', monospace",
    titleFont: "48px 'Courier New', monospace",
    pixelScale: 1, // change to 2 for larger UI
    assetFile: "assets.epk",
  };

  let state = "menu"; // menu | single | multi | options | loading
  let hoverIndex = -1;
  let selectedIndex = 0;
  let assetsInfo = { loaded: false, size: 0, received: 0 };

  // Buttons definition
  const buttons = [
    { id: "single", text: "Singleplayer" },
    { id: "multi", text: "Multiplayer" },
    { id: "options", text: "Options" },
    { id: "quit", text: "Quit" },
  ];

  // Hooks for engine integration
  // Replace or override these in another script when you have engine.js
  window.onAssetsReady = window.onAssetsReady || function (assetBlob) {
    console.log("onAssetsReady hook called. assetBlob:", assetBlob);
    // Example: startEngineWithAssets(assetBlob);
  };
  window.startEngine = window.startEngine || function () {
    console.log("startEngine hook called. Replace with real engine start.");
  };

  // ---------- Setup Canvas ----------
  window.addEventListener("load", () => {
    const container = document.getElementById("game-frame") || document.body;
    const canvas = document.createElement("canvas");
    canvas.id = "mc-canvas";
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = Math.max(800, window.innerWidth);
    canvas.height = Math.max(600, window.innerHeight);
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    // Utility helpers
    function clear() {
      ctx.fillStyle = config.canvasBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawText(text, x, y, font, color) {
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.fillText(text, x, y);
    }

    function drawBlockyRect(x, y, w, h, fill, border) {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = border;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, h);
    }

    // Layout helpers
    function menuLayout() {
      const left = 60;
      const top = 140;
      const w = 320;
      const h = 56;
      return { left, top, w, h, gap: 18 };
    }

    // Hit test
    function hitTest(x, y, btnRect) {
      return x >= btnRect.x && x <= btnRect.x + btnRect.w && y >= btnRect.y && y <= btnRect.y + btnRect.h;
    }

    // ---------- Draw Screens ----------
    function drawMenu() {
      clear();
      drawText(config.title, 60, 90, config.titleFont, config.titleColor);

      const layout = menuLayout();
      buttons.forEach((b, i) => {
        const x = layout.left;
        const y = layout.top + i * (layout.h + layout.gap);
        const w = layout.w;
        const h = layout.h;

        // hover effect
        const bg = i === hoverIndex ? shadeColor(config.buttonBg, -12) : config.buttonBg;
        drawBlockyRect(x, y, w, h, bg, config.buttonBorder);

        ctx.fillStyle = config.buttonText;
        ctx.font = config.font;
        ctx.fillText(b.text, x + 20, y + 36);
        // store rect for hit testing
        b._rect = { x, y, w, h };
      });

      // footer
      ctx.fillStyle = "#bfbfbf";
      ctx.font = "14px 'Courier New', monospace";
      ctx.fillText("assets: " + (assetsInfo.loaded ? "ready" : "not loaded"), 60, canvas.height - 40);
    }

    function drawLoading(progress, total) {
      clear();
      drawText("Loading Assets", 60, 120, "36px 'Courier New', monospace", "#ffffff");
      const barX = 60;
      const barY = 160;
      const barW = 600;
      const barH = 28;
      // background
      ctx.fillStyle = "#333";
      ctx.fillRect(barX, barY, barW, barH);
      // progress
      const pct = total ? Math.min(1, progress / total) : 0;
      ctx.fillStyle = "#7FFF7F";
      ctx.fillRect(barX, barY, Math.floor(barW * pct), barH);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeRect(barX, barY, barW, barH);

      ctx.fillStyle = "#fff";
      ctx.font = "16px 'Courier New', monospace";
      ctx.fillText(`${Math.floor(pct * 100)}%`, barX + barW + 12, barY + 20);
    }

    function drawSingleplayer() {
      clear();
      drawText("Singleplayer", 60, 90, "36px 'Courier New', monospace", "#fff");
      drawText("This is a placeholder screen.", 60, 150, config.font, "#ddd");
      drawBackHint();
    }

    function drawMultiplayer() {
      clear();
      drawText("Multiplayer", 60, 90, "36px 'Courier New', monospace", "#fff");
      drawText("Server list placeholder.", 60, 150, config.font, "#ddd");
      drawBackHint();
    }

    function drawOptions() {
      clear();
      drawText("Options", 60, 90, "36px 'Courier New', monospace", "#fff");
      drawText("Volume: 100% (localStorage)", 60, 150, config.font, "#ddd");
      drawBackHint();
    }

    function drawBackHint() {
      ctx.fillStyle = "#bfbfbf";
      ctx.font = "14px 'Courier New', monospace";
      ctx.fillText("Press Escape to return to menu", 60, canvas.height - 40);
    }

    // ---------- Input Handling ----------
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
          if (b._rect && hitTest(pos.x, pos.y, b._rect)) found = i;
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
          if (b._rect && hitTest(pos.x, pos.y, b._rect)) {
            handleButton(b.id);
          }
        });
      } else if (state === "loading") {
        // ignore clicks while loading
      } else {
        // in sub screens, clicking returns to menu
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

    // ---------- Button Actions ----------
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
        // Quit placeholder
        clear();
        drawText("Goodbye!", 60, 120, "36px 'Courier New', monospace", "#fff");
        setTimeout(() => window.close && window.close(), 800);
      }
    }

    // ---------- Asset Loader with Progress ----------
    async function loadAssetsWithProgress(url) {
      state = "loading";
      drawLoading(0, 1);
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error("Failed to fetch assets");
        const contentLength = resp.headers.get("Content-Length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        if (!resp.body || !resp.body.getReader) {
          // Fallback: read as blob
          const blob = await resp.blob();
          assetsInfo = { loaded: true, size: blob.size, received: blob.size };
          window.onAssetsReady(blob);
          assetsInfo.loaded = true;
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
        // combine chunks into a blob
        const blob = new Blob(chunks);
        assetsInfo = { loaded: true, size: blob.size, received: blob.size };
        // call hook so engine can use the blob
        try {
          window.onAssetsReady(blob);
        } catch (err) {
          console.error("onAssetsReady hook error", err);
        }
        state = "menu";
        draw();
      } catch (err) {
        console.error("Asset load failed", err);
        clear();
        drawText("Failed to load assets.epk", 60, 120, "28px 'Courier New', monospace", "#ff8080");
        drawText("Check console for details", 60, 160, config.font, "#ddd");
      }
    }

    // ---------- Main Draw Dispatcher ----------
    function draw() {
      if (state === "menu") drawMenu();
      else if (state === "loading") {
        const total = assetsInfo.size || 1;
        drawLoading(assetsInfo.received || 0, total);
      } else if (state === "single") drawSingleplayer();
      else if (state === "multi") drawMultiplayer();
      else if (state === "options") drawOptions();
    }

    // ---------- Utilities ----------
    function shadeColor(color, percent) {
      // color in hex or #rgb
      try {
        const f = color.slice(1);
        const t = percent < 0 ? 0 : 255;
        const p = Math.abs(percent) / 100;
        const R = parseInt(f.substring(0, 2), 16);
        const G = parseInt(f.substring(2, 4), 16);
        const B = parseInt(f.substring(4, 6), 16);
        const newR = Math.round((t - R) * p) + R;
        const newG = Math.round((t - G) * p) + G;
        const newB = Math.round((t - B) * p) + B;
        return "#" + (0x1000000 + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
      } catch (e) {
        return color;
      }
    }

    // ---------- Initial Draw and Auto Asset Load ----------
    draw();

    // Try to auto-load assets.epk if present
    // This will show progress if server supports streaming
    fetch(config.assetFile, { method: "HEAD" })
      .then((r) => {
        if (r.ok) {
          // small delay so user sees menu first
          setTimeout(() => loadAssetsWithProgress(config.assetFile), 400);
        } else {
          // no assets found, leave menu as-is
        }
      })
      .catch(() => {
        // network error or file not present
      });

    // Expose a manual loader for dev use
    window.loadLauncherAssets = function (file) {
      loadAssetsWithProgress(file || config.assetFile);
    };

    // Expose a startEngine adapter that waits for assets
    window.startEngineWhenReady = async function () {
      if (assetsInfo.loaded) {
        window.startEngine();
      } else {
        // load then start
        await loadAssetsWithProgress(config.assetFile);
        window.startEngine();
      }
    };

    // Resize handling
    window.addEventListener("resize", () => {
      canvas.width = Math.max(800, window.innerWidth);
      canvas.height = Math.max(600, window.innerHeight);
      draw();
    });
  });
})();
let state = "menu";

function draw() {
  if (state === "menu") drawMenu();
  else if (state === "single") drawSingleplayer();
  else if (state === "multi") drawMultiplayer();
  else if (state === "options") drawOptions();
}
localStorage.setItem("volume", "80");

       
    

