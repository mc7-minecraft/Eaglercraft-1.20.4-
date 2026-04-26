window.addEventListener("load", () => {
  const container = document.getElementById("game_frame") || document.body;
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  container.appendChild(canvas);

  if (typeof $rt_globals !== "undefined" && $rt_globals.loadLoader) {
    $rt_globals.loadLoader(canvas);
  } else {
    console.error("Runtime loader not found");
    container.innerHTML = "<p style='color:white;text-align:center;'>Game failed to start: loader missing.</p>";
  }
});
