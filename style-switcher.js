/* Style selector — an always-visible bar that lets visitors switch between the
   original page and the 3 redesigns, and remembers their choice for next visit.
   Include on each page with: <script src="style-switcher.js" defer></script> */
(function () {
  var STYLES = [
    { file: "index.html",           label: "Original",  dot: "#b9b4f5" },
    { file: "index-editorial.html", label: "Editorial", dot: "#b5462a" },
    { file: "index-dark.html",      label: "Dark",      dot: "#c6f432" },
    { file: "index-bold.html",      label: "Bold",      dot: "#1f3fff" }
  ];
  var KEY = "ej-style";

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var path = location.pathname.split("/").pop() || "index.html";
  var current = STYLES.some(function (s) { return s.file === path; }) ? path : "index.html";

  // Returning visitor landing on the main page: open the style they chose last time
  var saved = get();
  if (current === "index.html" && saved && saved !== "index.html" &&
      STYLES.some(function (s) { return s.file === saved; })) {
    location.replace(saved + location.hash);
    return;
  }

  var host = document.createElement("div");
  host.id = "style-switcher";
  host.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:2147483000;display:block;";
  var spacer = document.createElement("div");
  spacer.id = "style-switcher-spacer";
  spacer.setAttribute("aria-hidden", "true");
  var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;

  var css =
    ":host{all:initial}" +
    ".bar{display:flex;align-items:center;gap:14px;justify-content:center;" +
      "padding:8px 16px;background:rgba(20,22,28,.94);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);" +
      "color:#e9eaee;font:500 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;" +
      "border-bottom:1px solid #2a2e38;box-shadow:0 2px 10px rgba(0,0,0,.18);box-sizing:border-box;width:100%}" +
    ".lbl{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#9aa0ad;white-space:nowrap}" +
    ".opts{display:flex;gap:6px}" +
    "a{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;border:1px solid #343947;" +
      "color:#e9eaee;text-decoration:none;white-space:nowrap;transition:background .15s,border-color .15s}" +
    "a:hover{background:#232733;border-color:#4a5163}" +
    "a[aria-current=page]{background:#e9eaee;color:#14161c;border-color:#e9eaee;font-weight:700}" +
    "a:focus-visible{outline:2px solid #7aa2ff;outline-offset:2px}" +
    ".dot{width:10px;height:10px;border-radius:50%;flex:none;box-shadow:0 0 0 1px rgba(255,255,255,.25)}" +
    "@media (max-width:520px){.lbl{display:none}.bar{padding:7px 8px}.opts{gap:4px}a{padding:6px 9px;font-size:13px;gap:5px}.dot{width:8px;height:8px}}";

  var html = '<style>' + css + '</style><nav class="bar" aria-label="Choose a page style">' +
    '<span class="lbl">Choose a style</span><div class="opts">' +
    STYLES.map(function (s) {
      return '<a href="' + s.file + '" data-file="' + s.file + '"' +
        (s.file === current ? ' aria-current="page"' : '') +
        '><span class="dot" style="background:' + s.dot + '"></span>' + s.label + '</a>';
    }).join("") + '</div></nav>';

  if (root === host) { host.innerHTML = html; } else { root.innerHTML = html; }

  (root.querySelectorAll ? root : host).querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var file = a.getAttribute("data-file");
      set(file);
      e.preventDefault();
      if (file !== current) location.href = file + location.hash;
    });
  });

  // Reserve space so the fixed bar never covers page content, and expose its
  // height as --style-bar-h so sticky headers can sit just below it.
  function fit() {
    var h = host.offsetHeight || 0;
    spacer.style.height = h + "px";
    document.documentElement.style.setProperty("--style-bar-h", h + "px");
  }

  function mount() {
    document.body.insertBefore(spacer, document.body.firstChild);
    document.body.insertBefore(host, spacer);
    fit();
    window.addEventListener("resize", fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(host);
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();
