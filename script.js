/* =========================================================
   THEME
========================================================= */

(function () {

    var saved = localStorage.getItem("theme");

    if (saved === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }

})();


/* =========================================================
   LOAD HEADER + FOOTER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /*
       If page is inside /components/,
       go two folders back.

       index.html:
       ./header.html

       components/about/about.html:
       ../../header.html
    */

    var path = window.location.pathname;

    var basePath = path.includes("/components/")
        ? "../../"
        : "./";


    /* =====================================================
       HEADER
    ===================================================== */

    fetch(basePath + "header.html")

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Header could not be loaded: " +
                    response.status
                );
            }

            return response.text();

        })

        .then(function (html) {

            var headerContainer =
                document.getElementById("header");

            if (headerContainer) {

                headerContainer.innerHTML = html;

                setupHeader();

            }

        })

        .catch(function (error) {

            console.error("HEADER ERROR:", error);

        });


    /* =====================================================
       FOOTER
    ===================================================== */

    fetch(basePath + "footer.html")

        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Footer could not be loaded: " +
                    response.status
                );
            }

            return response.text();

        })

        .then(function (html) {

            var footerContainer =
                document.getElementById("footer");

            if (footerContainer) {

                footerContainer.innerHTML = html;

            }

        })

        .catch(function (error) {

            console.error("FOOTER ERROR:", error);

        });

});


/* =========================================================
   HEADER FUNCTIONS
========================================================= */

function setupHeader() {

    var toggle =
        document.getElementById("themeToggle");

    var navCheck =
        document.getElementById("navCheck");

    var header =
        document.getElementById("siteHeader");


    /* =====================================================
       DARK MODE
    ===================================================== */

    if (toggle) {

        var root = document.documentElement;


        function currentTheme() {

            return root.getAttribute("data-theme") === "dark"
                ? "dark"
                : "light";

        }


        function updateThemeLabel() {

            var isDark =
                currentTheme() === "dark";


            toggle.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light theme"
                    : "Switch to dark theme"
            );


            var label =
                toggle.querySelector(
                    ".theme-toggle-label"
                );


            if (label) {

                label.textContent =
                    isDark
                        ? "Light mode"
                        : "Dark mode";

            }

        }


        updateThemeLabel();


        toggle.addEventListener(
            "click",
            function () {

                var next =
                    currentTheme() === "dark"
                        ? "light"
                        : "dark";


                root.setAttribute(
                    "data-theme",
                    next
                );


                localStorage.setItem(
                    "theme",
                    next
                );


                updateThemeLabel();

            }
        );

    }


    /* =====================================================
       STICKY HEADER
    ===================================================== */

    if (header) {

        function updateHeader() {

            header.classList.toggle(
                "scrolled",
                window.scrollY > 8
            );

        }


        updateHeader();


        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

    }


    /* =====================================================
       MOBILE NAV
    ===================================================== */

    if (navCheck) {

        document
            .querySelectorAll(".main-nav a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navCheck.checked = false;

                    }
                );

            });

    }

}