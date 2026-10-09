/* Style demo switcher — lets visitors flip between the original page and the 3 redesigns.
   Include on each page with: <script src="style-switcher.js" defer></script> */
(function () {
  var STYLES = [
    { file: "index.html",           label: "Original",  dot: "#b9b4f5" },
    { file: "index-editorial.html", label: "Editorial", dot: "#b5462a" },
    { file: "index-dark.html",      label: "Dark",      dot: "#c6f432" },
    { file: "index-bold.html",      label: "Bold",      dot: "#1f3fff" }
  ];

  var path = location.pathname.split("/").pop() || "index.html";
  var current = STYLES.some(function (s) { return s.file === path; }) ? path : "index.html";

  var host = document.createElement("div");
  host.id = "style-switcher";
  host.style.cssText = "display:block;position:relative;z-index:9999;";
  var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

  var css =
    ":host{all:initial}" +
    ".bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:center;" +
      "padding:10px 16px;background:#14161c;color:#e9eaee;font:500 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;" +
      "border-bottom:1px solid #2a2e38;box-sizing:border-box;width:100%}" +
    ".lbl{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#9aa0ad}" +
    ".opts{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}" +
    "a{display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;border:1px solid #343947;" +
      "color:#e9eaee;text-decoration:none;transition:background .15s,border-color .15s}" +
    "a:hover{background:#232733;border-color:#4a5163}" +
    "a[aria-current=page]{background:#e9eaee;color:#14161c;border-color:#e9eaee;font-weight:700}" +
    "a:focus-visible{outline:2px solid #7aa2ff;outline-offset:2px}" +
    "@media (max-width:480px){.lbl{display:none}.bar{padding:8px 10px}a{padding:6px 10px;font-size:13px;gap:6px}}" +
    ".dot{width:10px;height:10px;border-radius:50%;flex:none;box-shadow:0 0 0 1px rgba(255,255,255,.25)}";

  var html = '<style>' + css + '</style><nav class="bar" aria-label="Page style demo">' +
    '<span class="lbl">Style demo</span><div class="opts">' +
    STYLES.map(function (s) {
      return '<a href="' + s.file + '"' + (s.file === current ? ' aria-current="page"' : '') +
        '><span class="dot" style="background:' + s.dot + '"></span>' + s.label + '</a>';
    }).join("") + '</div></nav>';

  if (root === host) { host.innerHTML = html; } else { root.innerHTML = html; }

  // Keep the visitor on the same section (#about, #projects, ...) when switching styles
  (root.querySelectorAll ? root : host).querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { if (location.hash) a.href = a.getAttribute("href") + location.hash; });
  });

  function mount() { document.body.insertBefore(host, document.body.firstChild); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
