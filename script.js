const body = document.body;
const themeToggleBtn = document.getElementById("themeToggle");
const copySlideBtn = document.getElementById("copySlideBtn");
const copyToast = document.getElementById("copyToast");

const MOON_ICON = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const SUN_ICON = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function applyTheme(theme) {
  const isLight = theme === "light";

  body.classList.toggle("theme-light", isLight);
  body.classList.toggle("theme-dark", !isLight);

  themeToggleBtn.innerHTML = isLight ? SUN_ICON : MOON_ICON;
  themeToggleBtn.setAttribute("aria-label", isLight ? "Zu Dunkel-Modus wechseln" : "Zu Hell-Modus wechseln");
  localStorage.setItem("presentation-theme", theme);
}

function getCurrentSlideText() {
  const currentSlide = document.querySelector(".slides section.present");
  if (!currentSlide) return "";

  const text = currentSlide.textContent
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .join("\n");

  return text;
}

async function copyCurrentSlide() {
  const text = getCurrentSlideText();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showToast("Aktuelle Folie kopiert");
  } catch (error) {
    showToast("Kopieren nicht möglich");
  }
}

function showToast(message) {
  copyToast.textContent = message;
  copyToast.classList.add("show");

  clearTimeout(showToast._timeout);
  showToast._timeout = setTimeout(() => {
    copyToast.classList.remove("show");
  }, 1800);
}

const storedTheme = localStorage.getItem("presentation-theme") || "dark";
applyTheme(storedTheme);

themeToggleBtn.addEventListener("click", () => {
  const nextTheme = body.classList.contains("theme-light") ? "dark" : "light";
  applyTheme(nextTheme);
});

copySlideBtn.addEventListener("click", copyCurrentSlide);

Reveal.initialize({
  hash: true,
  slideNumber: true,
  transition: "fade",
  controls: true,
  progress: true,
  center: true
});