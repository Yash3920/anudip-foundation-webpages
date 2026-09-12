/* =========================================================
   THEME  — runs immediately before paint (no flash)
========================================================= */

(function () {
    var saved = localStorage.getItem("theme");
    document.documentElement.setAttribute(
        "data-theme",
        saved === "dark" ? "dark" : "light"
    );
})();


/* =========================================================
   LOAD HEADER + FOOTER
   Works with both  file://  and  http://  protocols.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /*  Decide the base path.
        - Served via HTTP: use relative path from current page.
        - Opened as file://: walk back to root using location.pathname.  */

    var isFile   = window.location.protocol === "file:";
    var path     = window.location.pathname;
    var isNested = path.includes("/components/");

    /* For file:// we need to resolve the real filesystem root.
       For http://, a simple relative string is enough.           */
    var basePath;

    if (isFile) {
        /* Build an absolute file:// URL to header.html */
        var parts   = path.split("/");
        /* parts looks like [..., "components", "about", "about.html"]
           We need to walk back to the folder that contains header.html */
        var depth   = isNested ? 2 : 0;   /* levels below root */
        var rootParts = parts.slice(0, parts.length - 1 - depth);
        basePath = window.location.origin + rootParts.join("/") + "/";
    } else {
        basePath = isNested ? "../../" : "./";
    }


    /* -------------------------------------------------------
       Generic loader — tries fetch first, falls back to XHR
       (XHR can read local file:// in some browsers / Electron)
    ------------------------------------------------------- */

    /* -------------------------------------------------------
       fixPaths — rewrites logo src + nav hrefs so they
       resolve correctly from any page depth after injection.
       Works for both root (index.html) and nested pages
       (components/about/about.html, etc.)
    ------------------------------------------------------- */
    function fixPaths(container) {
        /* Logo image */
        var imgs = container.querySelectorAll('img[src]');
        imgs.forEach(function (img) {
            var src = img.getAttribute('src');
            /* Strip any leading slashes / relative dots, normalise to filename */
            var file = src.replace(/^(\/|\.\.\/)*/g, '').replace(/^.*\/([^/]+)$/, '$1');
            if (file === 'anudip-logo.png') {
                img.setAttribute('src', isNested ? '../../anudip-logo.png' : './anudip-logo.png');
            }
        });

        /* All anchor hrefs */
        var anchors = container.querySelectorAll('a[href]');
        anchors.forEach(function (a) {
            var href = a.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#')) return;

            /* Normalise: strip leading slash or ../ */
            var clean = href.replace(/^(\/|\.\.\/)*/g, '');
            /* Prepend the correct prefix */
            a.setAttribute('href', isNested ? '../../' + clean : './' + clean);
        });
    }

    function loadFragment(url, containerId, callback) {

        var container = document.getElementById(containerId);
        if (!container) return;

        /* ---- FETCH (works on http://, blocked on file:// in Chrome) ---- */
        if (window.fetch) {
            fetch(url)
                .then(function (r) {
                    if (!r.ok) throw new Error(r.status);
                    return r.text();
                })
                .then(function (html) {
                    container.innerHTML = html;
                    fixPaths(container);   /* ← fix logo + nav paths */
                    if (callback) callback();
                })
                .catch(function () {
                    /* Fetch failed — inline fallback */
                    inlineFallback(containerId, callback);
                });
        } else {
            /* Old browsers — XHR */
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onload = function () {
                if (xhr.status === 200 || xhr.status === 0) {
                    container.innerHTML = xhr.responseText;
                    fixPaths(container);   /* ← fix logo + nav paths */
                    if (callback) callback();
                } else {
                    inlineFallback(containerId, callback);
                }
            };
            xhr.onerror = function () { inlineFallback(containerId, callback); };
            xhr.send();
        }
    }


    /* -------------------------------------------------------
       INLINE FALLBACK
       If fetch is blocked (file:// in Chrome), inject the
       header / footer HTML directly so the page never breaks.
    ------------------------------------------------------- */

    function inlineFallback(containerId, callback) {

        var container = document.getElementById(containerId);
        if (!container) return;

        /* Resolve logo path relative to THIS page */
        var logoPath = isNested ? "../../anudip-logo.png" : "./anudip-logo.png";

        /* Link prefix for nav hrefs */
        var p = isNested ? "../../" : "./";

        if (containerId === "header") {
            container.innerHTML = [
                '<header class="site-header" id="siteHeader">',
                '  <div class="wrap header-inner">',
                '    <a href="' + p + 'index.html" class="brand">',
                '      <img src="' + logoPath + '" alt="Anudip Foundation" class="brand-logo">',
                '    </a>',
                '    <input type="checkbox" id="navCheck">',
                '    <nav class="main-nav" aria-label="Primary">',
                '      <a href="' + p + 'index.html">Home</a>',
                '      <a href="' + p + 'components/about/about.html">About</a>',
                '      <a href="' + p + 'components/courses/courses.html">Courses</a>',
                '      <a href="' + p + 'components/students/students.html">Students</a>',
                '      <a href="' + p + 'components/faculty/faculty.html">Faculty</a>',
                '      <a href="' + p + 'components/events/events.html">Events</a>',
                '      <a href="' + p + 'components/contact/contact.html">Contact</a>',
                '    </nav>',
                '    <div class="header-actions">',
                '      <button type="button" class="theme-toggle" id="themeToggle" aria-label="Switch to dark theme">',
                '        <span class="icon-light" aria-hidden="true">&#9728;</span>',
                '        <span class="icon-dark"  aria-hidden="true">&#9789;</span>',
                '        <span class="theme-toggle-label">Dark mode</span>',
                '      </button>',
                '      <label class="nav-toggle-label" for="navCheck" aria-label="Toggle menu">',
                '        <span></span><span></span><span></span>',
                '      </label>',
                '    </div>',
                '  </div>',
                '</header>'
            ].join("\n");

            markActiveNavLink();
            if (callback) callback();

        } else if (containerId === "footer") {
            container.innerHTML = [
                '<footer class="site-footer">',
                '  <div class="wrap footer-grid">',
                '    <div class="footer-brand">',
                '      <a href="' + p + 'index.html" class="brand">',
                '        <img src="' + logoPath + '" alt="Anudip Foundation" class="brand-logo">',
                '      </a>',
                '    </div>',
                '    <div class="footer-links">',
                '      <div>',
                '        <h4>Explore</h4>',
                '        <a href="' + p + 'components/about/about.html">About Us</a>',
                '        <a href="' + p + 'components/courses/courses.html">Courses</a>',
                '        <a href="' + p + 'components/students/students.html">Student Portfolio</a>',
                '      </div>',
                '      <div>',
                '        <h4>More</h4>',
                '        <a href="' + p + 'components/faculty/faculty.html">Faculty</a>',
                '        <a href="' + p + 'components/events/events.html">Events &amp; Gallery</a>',
                '        <a href="' + p + 'components/contact/contact.html">Contact Us</a>',
                '      </div>',
                '      <div>',
                '        <h4>Follow</h4>',
                '        <a href="https://www.facebook.com/AnudipFoundation/" target="_blank" rel="noopener">Facebook</a>',
                '        <a href="https://www.instagram.com/anudipfoundation/" target="_blank" rel="noopener">Instagram</a>',
                '        <a href="https://www.linkedin.com/company/anudip-foundation-for-social-welfare" target="_blank" rel="noopener">LinkedIn</a>',
                '      </div>',
                '    </div>',
                '  </div>',
                '  <div class="wrap footer-bottom">',
                '    <p>&copy; 2026 Anudip Foundation for Social Welfare. Built as a student project, inspired by the real Anudip Foundation.</p>',
                '  </div>',
                '</footer>'
            ].join("\n");
        }
    }


    /* -------------------------------------------------------
       Mark the current page's nav link as active
    ------------------------------------------------------- */

    function markActiveNavLink() {
        var currentPath = window.location.pathname.toLowerCase();
        var links = document.querySelectorAll(".main-nav a");

        links.forEach(function (link) {
            var href = link.getAttribute("href") || "";
            /* Normalise both to lowercase filenames for comparison */
            var hrefFile = href.split("/").pop().toLowerCase();
            var curFile  = currentPath.split("/").pop().toLowerCase();

            if (hrefFile && curFile && hrefFile === curFile) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        /* Special case: root index */
        if (curFile === "" || curFile === "index.html") {
            var homeLink = document.querySelector('.main-nav a[href$="index.html"]');
            if (homeLink) homeLink.setAttribute("aria-current", "page");
        }
    }

    /* Cache curFile in outer scope for markActiveNavLink */
    var curFile = window.location.pathname.split("/").pop().toLowerCase();


    /* -------------------------------------------------------
       KICK OFF LOADS
    ------------------------------------------------------- */

    loadFragment(basePath + "header.html", "header", function () {
        setupHeader();
        markActiveNavLink();
    });

    loadFragment(basePath + "footer.html", "footer", null);

});


/* =========================================================
   HEADER INTERACTIVE FUNCTIONS
   Called after header HTML is injected (fetch OR fallback).
========================================================= */

function setupHeader() {

    var toggle  = document.getElementById("themeToggle");
    var navCheck = document.getElementById("navCheck");
    var header  = document.getElementById("siteHeader");


    /* -------------------------------------------------------
       DARK / LIGHT MODE TOGGLE
    ------------------------------------------------------- */

    if (toggle) {

        var root = document.documentElement;

        function currentTheme() {
            return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
        }

        function updateThemeLabel() {
            var isDark = currentTheme() === "dark";
            toggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light theme" : "Switch to dark theme"
            );
            var label = toggle.querySelector(".theme-toggle-label");
            if (label) label.textContent = isDark ? "Light mode" : "Dark mode";
        }

        updateThemeLabel();

        toggle.addEventListener("click", function () {
            var next = currentTheme() === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
            updateThemeLabel();
        });
    }


    /* -------------------------------------------------------
       STICKY / SCROLLED SHADOW
    ------------------------------------------------------- */

    if (header) {

        function updateHeader() {
            header.classList.toggle("scrolled", window.scrollY > 8);
        }

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }


    /* -------------------------------------------------------
       MOBILE NAV — close on link click
    ------------------------------------------------------- */

    if (navCheck) {
        document.querySelectorAll(".main-nav a").forEach(function (link) {
            link.addEventListener("click", function () {
                navCheck.checked = false;
            });
        });
    }

}