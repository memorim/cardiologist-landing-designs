const viewer = document.createElement("dialog");
viewer.className = "screen-viewer";
viewer.setAttribute("aria-labelledby", "screen-title");
const heading = document.createElement("h2");
heading.id = "screen-title";
const close = document.createElement("button");
close.type = "button";
close.textContent = "Закрыть ×";
close.onclick = () => viewer.close();
const original = document.createElement("a");
original.textContent = "Открыть оригинал ↗";
original.target = "_blank";
original.rel = "noopener";
const image = document.createElement("img");
viewer.append(close, heading, original, image);
document.body.append(viewer);
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});
document.querySelectorAll("main img").forEach((screen) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "screen-preview";
  button.setAttribute("aria-label", "Открыть экран: " + screen.alt);
  screen.before(button);
  button.append(screen);
  button.onclick = () => {
    heading.textContent = screen.alt;
    image.src = screen.src;
    image.alt = screen.alt;
    original.href = screen.src;
    viewer.showModal();
  };
});
