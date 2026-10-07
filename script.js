/* =========================================
   ANIL BIKE RENTAL HAMPI
========================================= */


/* MOBILE MENU */

const menuToggle =
    document.querySelector(".menu-toggle");

const navLinks =
    document.querySelector(".nav-links");


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const open =
            navLinks.classList.toggle("open");

        menuToggle.textContent =
            open ? "✕" : "☰";

        menuToggle.setAttribute(
            "aria-expanded",
            open
        );

    });

}


/* CLOSE MENU */

document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener("click", () => {

            navLinks?.classList.remove("open");

            if (menuToggle) {
                menuToggle.textContent = "☰";
            }

        });

    });


/* NAVBAR SHADOW */

const navbar =
    document.querySelector(".navbar");


window.addEventListener("scroll", () => {

    if (!navbar) return;


    if (window.scrollY > 20) {

        navbar.style.boxShadow =
            "0 10px 35px rgba(0,0,0,.10)";

    } else {

        navbar.style.boxShadow =
            "none";

    }

});


/* SMOOTH SCROLL */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener("click", function(event) {

            const id =
                this.getAttribute("href");


            if (!id || id === "#") {
                return;
            }


            const target =
                document.querySelector(id);


            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


/* SIMPLE REVEAL */

const elements =
    document.querySelectorAll(
        ".feature, .ride-card, .gallery-image, .explore-content"
    );


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(element => {

        element.classList.add("reveal");

        observer.observe(element);

    });

}


/* CURRENT YEAR */

const year =
    document.getElementById("year");


if (year) {

    year.textContent =
        new Date().getFullYear();

}