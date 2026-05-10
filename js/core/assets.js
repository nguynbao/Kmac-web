// ===== KMAC Tech — Path, Asset, and Color Helpers =====

const IS_PAGES_PAGE = window.location.pathname.includes("/pages/");

function pageUrl(path) {
  return IS_PAGES_PAGE ? path : "pages/" + path;
}

function assetUrl(path) {
  if (/^(https?:|data:|\/)/.test(path)) return path;
  return IS_PAGES_PAGE ? "../" + path : path;
}

const COLOR_HEX_MAP = {
  Clear: "#E0E7FF",
  Blue: "#0A84FF",
  Pink: "#FF6B9D",
  Gray: "#9CA3AF",
  Navy: "#1E3A5F",
  Black: "#1A1A2E",
  "Dark Blue": "#1E3A5F",
  White: "#F8FAFC",
  "White/Blue": "#E8F4FF",
  "Black/Red": "#1A1A2E",
  "Pink/White": "#FFE4EC",
  "Sky Blue": "#87CEEB",
  Lavender: "#C4B5FD",
  Mint: "#6EE7B7",
  "Space Gray": "#6B7280",
  Silver: "#CBD5E1",
};

function getColorHex(name) {
  return COLOR_HEX_MAP[name] || "#CBD5E1";
}

function imgSrc(basePath) {
  if (/^(https?:|data:|\/)/.test(basePath)) return basePath;
  return assetUrl(basePath + ".webp");
}

function imgPicture(basePath, alt, cls = "", lazy = true) {
  const loadAttr = lazy ? 'loading="lazy"' : "";
  if (/^(https?:|data:|\/)/.test(basePath)) {
    return `<img src="${basePath}" alt="${alt}" ${cls ? 'class="' + cls + '"' : ""} ${loadAttr} width="400" height="400">`;
  }
  return `<picture>
    <source srcset="${assetUrl(basePath + ".webp")}" type="image/webp">
    <img src="${assetUrl(basePath + ".png")}" alt="${alt}" ${cls ? 'class="' + cls + '"' : ""} ${loadAttr} width="400" height="400">
  </picture>`;
}
