/* ========================================================
   ANIL BIKE RENTAL, HAMPI — VANILLA JAVASCRIPT
   Interactive OpenStreetMap, Sightseeing Guide & Booking
   ======================================================== */

(function () {
    "use strict";

    // 1. DYNAMIC COPYRIGHT YEAR
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. STICKY NAVBAR SCROLL BEHAVIOR
    const navbar = document.getElementById("navbar");
    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 25) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }
    window.addEventListener("scroll", handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // 3. MOBILE MENU TOGGLE
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("open");
            navToggle.classList.toggle("open", isOpen);
            navToggle.setAttribute("aria-expanded", isOpen);
        });

        // Close menu on link click
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                navToggle.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", function (e) {
            if (!navbar.contains(e.target)) {
                navLinks.classList.remove("open");
                navToggle.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // 4. ACTIVE NAV LINK ON SCROLL
    const sections = document.querySelectorAll("section[id]");
    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute("id");
            const navLink = document.querySelector(`.nav-links a[href*="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add("active");
                } else {
                    navLink.classList.remove("active");
                }
            }
        });
    }
    window.addEventListener("scroll", highlightNavOnScroll, { passive: true });

    // 5. INTERACTIVE HAMPI MAP (LEAFLET + OPENSTREETMAP — NO API KEY NEEDED)
    const mapElement = document.getElementById("hampiMap");
    if (mapElement && typeof L !== "undefined") {
        
        // Anil Bike Rental starting point (Hampi Village hub near Bazaar/Virupaksha road)
        const HUB_COORDS = [15.3358, 76.4625];

        // 15 Key Attractions around Anil Bike Rental Hampi with authentic photos
        const ATTRACTIONS = [
            {
                id: "virupaksha",
                name: "Virupaksha Temple",
                badge: "MUST VISIT",
                coords: [15.3354, 76.4600],
                distance: "~400 m • 2 min",
                desc: "Active 7th-century Shiva shrine with a 50m gopuram, the spiritual heart of Hampi.",
                image: "assets/places/virupaksha.jpg"
            },
            {
                id: "bazaar",
                name: "Hampi Bazaar",
                badge: "HERITAGE",
                coords: [15.3353, 76.4635],
                distance: "~300 m • 1 min",
                desc: "Historic kilometer-long stone colonnade street with vibrant handicraft stalls.",
                image: "assets/places/bazaar.jpg"
            },
            {
                id: "hemakuta",
                name: "Hemakuta Hill",
                badge: "SUNSET VIEW",
                coords: [15.3330, 76.4595],
                distance: "~650 m • 3 min",
                desc: "Gentle hilltop with pre-Vijayanagara shrines and breathtaking 360° sunset vistas.",
                image: "assets/places/hemakuta.jpg"
            },
            {
                id: "sasivekalu",
                name: "Sasivekalu Ganesha",
                badge: "MONOLITH",
                coords: [15.3312, 76.4610],
                distance: "~700 m • 3 min",
                desc: "Graceful 8-foot monolithic Lord Ganesha carved from a single massive boulder.",
                image: "assets/places/sasivekalu.jpg"
            },
            {
                id: "ugra_narasimha",
                name: "Ugra Narasimha",
                badge: "MONOLITH",
                coords: [15.3318, 76.4608],
                distance: "~800 m • 3 min",
                desc: "Towering 6.7m monolithic Lakshmi Narasimha statue with a seven-headed snake hood.",
                image: "assets/places/ugra_narasimha.jpg"
            },
            {
                id: "matanga",
                name: "Hampi Matanga Hill",
                badge: "SUNRISE POINT",
                coords: [15.3305, 76.4678],
                distance: "~1.2 km • 5 min",
                desc: "The highest vantage point in central Hampi offering an iconic sunrise over ruins.",
                image: "assets/places/matanga.jpg"
            },
            {
                id: "achyutaraya",
                name: "Achyutaraya Temple",
                badge: "ANCIENT VALLEY",
                coords: [15.3310, 76.4715],
                distance: "~1.6 km • 6 min",
                desc: "Secluded 16th-century temple complex nestled in a quiet valley behind Matanga Hill.",
                image: "assets/places/achyutaraya.jpg"
            },
            {
                id: "underground_shiva",
                name: "Underground Shiva Temple",
                badge: "SUBTERRANEAN",
                coords: [15.3235, 76.4628],
                distance: "~1.8 km • 6 min",
                desc: "Atmospheric sanctuary built meters below ground level with serene water corridors.",
                image: "assets/places/underground_shiva.jpg"
            },
            {
                id: "lotus_mahal",
                name: "Lotus Mahal",
                badge: "ROYAL PAVILION",
                coords: [15.3188, 76.4704],
                distance: "~2.6 km • 8 min",
                desc: "Indo-Islamic pleasure pavilion with arched ceilings and lotus-bud architectural carvings.",
                image: "assets/places/lotus_mahal.jpg"
            },
            {
                id: "elephant_stables",
                name: "Elephant Stables",
                badge: "ROYAL COMPLEX",
                coords: [15.3195, 76.4740],
                distance: "~2.9 km • 9 min",
                desc: "Grand ensemble of 11 domed chambers that once housed the Vijayanagara royal elephants.",
                image: "assets/places/elephant_stables.jpg"
            },
            {
                id: "queens_bath",
                name: "Queen’s Bath",
                badge: "ROYAL BATH",
                coords: [15.3135, 76.4760],
                distance: "~3.4 km • 10 min",
                desc: "Ornate royal aquatic bath enclosed with carved balconies, verandahs, and open skylights.",
                image: "assets/places/queens_bath.jpg"
            },
            {
                id: "vittala",
                name: "Vijaya Vittala Temple",
                badge: "WORLD HERITAGE",
                coords: [15.3216, 76.4800],
                distance: "~3.8 km • 11 min",
                desc: "Masterpiece of Vijayanagara craftsmanship renowned for stone carvings and musical pillars.",
                image: "assets/places/vittala.jpg"
            },
            {
                id: "stone_chariot",
                name: "Stone Chariot",
                badge: "ICON OF INDIA",
                coords: [15.3218, 76.4803],
                distance: "~3.8 km • 11 min",
                desc: "World-famous monolithic chariot carved in granite, dedicated to Garuda inside Vittala complex.",
                image: "assets/places/stone_chariot.jpg"
            },
            {
                id: "anjanadri",
                name: "Anjanadri Hill",
                badge: "SUNSET & TEMPLE",
                coords: [15.3533, 76.4716],
                distance: "~4.5 km • 15 min",
                desc: "Revered birthplace of Lord Hanuman across Tungabhadra River, offering 575 steps and scenic views.",
                image: "assets/places/anjanadri.jpg"
            },
            {
                id: "tungabhadra",
                name: "Tungabhadra Dam",
                badge: "SCENIC RESERVOIR",
                coords: [15.2895, 76.3400],
                distance: "~16 km • 30 min",
                desc: "Expansive reservoir garden and musical fountain overlooking vast blue waters near Munirabad.",
                image: "assets/places/tungabhadra.jpg"
            }
        ];

        // Initialize Leaflet map
        const map = L.map("hampiMap", {
            center: [15.3320, 76.4680],
            zoom: 13,
            minZoom: 10,
            maxZoom: 18,
            scrollWheelZoom: false, // Prevent page scroll interception
            zoomControl: false // Using custom top-right zoom control
        });

        // OpenStreetMap standard tile layer (100% free, reliable, no API key required)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Add Leaflet zoom control at topright
        L.control.zoom({ position: "topright" }).addTo(map);

        // Add custom [Fit All] control at topright directly under zoom buttons
        const FitAllControl = L.Control.extend({
            options: { position: "topright" },
            onAdd: function () {
                const container = L.DomUtil.create("div", "leaflet-bar leaflet-fit-all-container");
                const button = L.DomUtil.create("button", "btn-leaflet-fit-all", container);
                button.type = "button";
                button.title = "Fit all attractions on map";
                button.setAttribute("aria-label", "Fit all attractions on map");
                button.innerHTML = `
                    <svg class="fit-all-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                    <span>Fit All</span>
                `;
                L.DomEvent.disableClickPropagation(container);
                L.DomEvent.disableScrollPropagation(container);
                button.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    map.closePopup();
                    map.flyToBounds(allBounds, {
                        padding: [45, 45],
                        duration: 0.9
                    });
                    if (activePlaceLabel) {
                        activePlaceLabel.textContent = "Anil Bike Rental Hampi (Hub)";
                    }
                    highlightCard(null);
                });
                return container;
            }
        });
        map.addControl(new FitAllControl());

        // Ensure Leaflet invalidates and recalculates container dimensions properly
        setTimeout(() => {
            map.invalidateSize();
        }, 200);

        window.addEventListener("resize", () => {
            map.invalidateSize();
        });

        // Marker dictionary and bounds tracker
        const markersById = {};
        const allBounds = L.latLngBounds();

        // 1. Anil Bike Rental Hub Pill Marker (Matches screenshot rich brown capsule)
        const hubIcon = L.divIcon({
            className: "leaflet-pill-marker-container",
            html: `
                <div class="hampi-pill-pin hub-pill-pin" title="Anil Bike Rental Hampi (Starting Point)">
                    <div class="pill-badge hub-badge">
                        <div class="hub-icon-circle">🛵</div>
                        <div class="hub-label-wrap">
                            <span class="hub-name">Anil Bike Rental</span>
                            <span class="hub-tagline">Start Your Hampi Journey</span>
                        </div>
                    </div>
                    <div class="pill-pointer hub-pointer"></div>
                </div>
            `,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
            popupAnchor: [0, -42]
        });

        const hubPopupContent = `
            <div class="map-popup-card">
                <div class="map-popup-body" style="padding-top:16px;">
                    <div class="map-popup-badge" style="color:var(--orange-primary, #E27238);">📍 STARTING POINT</div>
                    <div class="map-popup-title">Anil Bike Rental Hampi</div>
                    <div class="map-popup-meta">📞 +91 9353008180 • +91 9449533526</div>
                    <div class="map-popup-desc">Your trusted two-wheeler rental hub in Hampi. Well-serviced scooters & bikes ready with helmets for your exploration.</div>
                    <a href="https://wa.me/919353008180?text=Hi%20Anil%20Bike%20Rental%20Hampi%2C%20I%20would%20like%20to%20rent%20a%20bike.%20Please%20share%20the%20available%20bikes%2C%20prices%20and%20booking%20details." target="_blank" rel="noopener noreferrer" class="map-popup-btn">
                        <span>💬 Book Bike on WhatsApp</span>
                    </a>
                </div>
            </div>
        `;

        const hubMarker = L.marker(HUB_COORDS, { icon: hubIcon, zIndexOffset: 1000 })
            .addTo(map)
            .bindPopup(hubPopupContent, { maxWidth: 300, closeButton: true });

        allBounds.extend(HUB_COORDS);

        const activePlaceLabel = document.getElementById("activePlaceLabel");

        hubMarker.on("click", function () {
            if (activePlaceLabel) {
                activePlaceLabel.textContent = "Anil Bike Rental Hampi (Starting Point)";
            }
        });

        // 2. Add Attraction Pill Markers (Matches screenshot: photo + name + pointer arrow)
        ATTRACTIONS.forEach(place => {
            const placeIcon = L.divIcon({
                className: "leaflet-pill-marker-container",
                html: `
                    <div class="hampi-pill-pin" title="${place.name}">
                        <div class="pill-badge">
                            <img src="${place.image}" alt="${place.name}" class="pill-thumb" loading="lazy">
                            <span class="pill-name">${place.name}</span>
                        </div>
                        <div class="pill-pointer"></div>
                    </div>
                `,
                iconSize: [0, 0],
                iconAnchor: [0, 0],
                popupAnchor: [0, -36]
            });

            const encodedWaMsg = encodeURIComponent(
                `Hi Anil Bike Rental Hampi, I want to rent a bike to visit ${place.name}. Please share available bikes and rates.`
            );

            const popupHtml = `
                <div class="map-popup-card">
                    <img src="${place.image}" alt="${place.name}" class="map-popup-photo">
                    <div class="map-popup-body">
                        <div class="map-popup-badge">${place.badge}</div>
                        <div class="map-popup-title">${place.name}</div>
                        <div class="map-popup-meta">📍 ${place.distance} from Anil Bike Rental</div>
                        <div class="map-popup-desc">${place.desc}</div>
                        <a href="https://wa.me/919353008180?text=${encodedWaMsg}" target="_blank" rel="noopener noreferrer" class="map-popup-btn">
                            <span>💬 Rent Bike for This Spot</span>
                        </a>
                    </div>
                </div>
            `;

            const marker = L.marker(place.coords, { icon: placeIcon })
                .addTo(map)
                .bindPopup(popupHtml, { maxWidth: 290, closeButton: true });

            marker.on("click", function () {
                if (activePlaceLabel) {
                    activePlaceLabel.textContent = `${place.name} (${place.distance})`;
                }
                highlightCard(place.id);
            });

            markersById[place.id] = {
                marker: marker,
                data: place
            };

            allBounds.extend(place.coords);
        });

        // Fit all attractions neatly into view
        map.fitBounds(allBounds, { padding: [40, 40] });

        // Highlight place card helper
        function highlightCard(placeId) {
            document.querySelectorAll(".place-card").forEach(card => {
                if (card.getAttribute("data-place-id") === placeId) {
                    card.style.borderColor = "var(--orange-primary, #E27238)";
                    card.style.boxShadow = "0 10px 30px rgba(226, 114, 56, 0.22)";
                } else {
                    card.style.borderColor = "";
                    card.style.boxShadow = "";
                }
            });
        }

        // 3. Connect "View on Map" Buttons on Cards
        const viewMapButtons = document.querySelectorAll(".btn-view-map");
        viewMapButtons.forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const targetId = this.getAttribute("data-target-id");
                const item = markersById[targetId];

                if (item) {
                    // Scroll map smoothly into view if offscreen
                    const mapBox = document.querySelector(".map-interactive-box");
                    if (mapBox) {
                        const rect = mapBox.getBoundingClientRect();
                        if (rect.top < 0 || rect.bottom > window.innerHeight) {
                            mapBox.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                    }

                    // Fly to location and open popup
                    setTimeout(() => {
                        map.flyTo(item.data.coords, 16, {
                            duration: 1.1,
                            easeLinearity: 0.25
                        });
                        item.marker.openPopup();
                        if (activePlaceLabel) {
                            activePlaceLabel.textContent = `${item.data.name} (${item.data.distance})`;
                        }
                        highlightCard(targetId);
                    }, 200);
                }
            });
        });

        // 4. Reset Map View Button
        const btnResetMap = document.getElementById("btnResetMap");
        if (btnResetMap) {
            btnResetMap.addEventListener("click", function () {
                map.closePopup();
                map.flyToBounds(allBounds, {
                    padding: [40, 40],
                    duration: 1.0
                });
                if (activePlaceLabel) {
                    activePlaceLabel.textContent = "Anil Bike Rental Hampi (Hub)";
                }
                highlightCard(null);
            });
        }

        // 5. Connect "Rent Bike" Buttons on Attraction Cards to on-page booking form
        document.querySelectorAll(".btn-place-wa").forEach(btn => {
            btn.addEventListener("click", function (e) {
                const placeName = this.getAttribute("data-place");
                if (placeName) {
                    const notesInput = document.getElementById("bookNotes");
                    if (notesInput) {
                        notesInput.value = `Visiting ${placeName}. Please provide helmets and best route guidance.`;
                    }
                }
                const bookingSection = document.getElementById("booking");
                if (bookingSection) {
                    e.preventDefault();
                    bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    const nameInput = document.getElementById("bookName");
                    if (nameInput) {
                        setTimeout(() => nameInput.focus(), 650);
                    }
                }
            });
        });
    }

    // 6. DYNAMIC BOOKING FORM HANDLER (WHATSAPP REDIRECTION)
    const bookingForm = document.getElementById("bikeBookingForm");
    if (bookingForm) {
        const fromDateInput = document.getElementById("bookFromDate");
        const toDateInput = document.getElementById("bookToDate");
        const feedbackEl = document.getElementById("bookingFormFeedback");

        // Set minimum dates to today
        const today = new Date().toISOString().split("T")[0];
        if (fromDateInput) {
            fromDateInput.min = today;
            fromDateInput.addEventListener("change", function () {
                if (toDateInput) {
                    toDateInput.min = this.value;
                    if (toDateInput.value && toDateInput.value < this.value) {
                        toDateInput.value = this.value;
                    }
                }
            });
        }
        if (toDateInput) {
            toDateInput.min = today;
        }

        // Prefill from URL query params if present (e.g. ?place=virupaksha)
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const placeParam = urlParams.get("place");
            if (placeParam) {
                const notesInput = document.getElementById("bookNotes");
                if (notesInput && (!notesInput.value || notesInput.value === "None")) {
                    const cleanPlace = placeParam.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                    notesInput.value = `Visiting ${cleanPlace}. Please provide helmets and best route guidance.`;
                }
            }
        } catch (err) {}

        // Form submission handler
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Clear previous errors
            document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
            if (feedbackEl) {
                feedbackEl.style.display = "none";
                feedbackEl.className = "form-feedback";
            }

            // Read values
            const name = (document.getElementById("bookName")?.value || "").trim();
            const mobile = (document.getElementById("bookMobile")?.value || "").trim();
            const fromDate = (document.getElementById("bookFromDate")?.value || "").trim();
            const toDate = (document.getElementById("bookToDate")?.value || "").trim();
            const bike = (document.getElementById("bookBike")?.value || "").trim();
            const numBikes = (document.getElementById("bookNumBikes")?.value || "1 Bike").trim();
            const pickup = (document.getElementById("bookPickup")?.value || "").trim();
            const notes = (document.getElementById("bookNotes")?.value || "").trim();

            let hasError = false;

            // Validate Name
            if (!name || name.length < 2) {
                const errName = document.getElementById("errName");
                if (errName) errName.textContent = "Please enter your name.";
                hasError = true;
            }

            // Validate Mobile
            const cleanMobile = mobile.replace(/[^0-9]/g, "");
            if (!cleanMobile || cleanMobile.length < 10) {
                const errMobile = document.getElementById("errMobile");
                if (errMobile) errMobile.textContent = "Please enter a valid 10-digit mobile number.";
                hasError = true;
            }

            // Validate From Date
            if (!fromDate) {
                const errFrom = document.getElementById("errFromDate");
                if (errFrom) errFrom.textContent = "Please select start date.";
                hasError = true;
            }

            // Validate To Date
            if (!toDate) {
                const errTo = document.getElementById("errToDate");
                if (errTo) errTo.textContent = "Please select return date.";
                hasError = true;
            } else if (fromDate && toDate < fromDate) {
                const errTo = document.getElementById("errToDate");
                if (errTo) errTo.textContent = "Return date cannot be earlier than start date.";
                hasError = true;
            }

            // Validate Bike Model
            if (!bike) {
                const errBike = document.getElementById("errBike");
                if (errBike) errBike.textContent = "Please select a bike model.";
                hasError = true;
            }

            if (hasError) {
                if (feedbackEl) {
                    feedbackEl.textContent = "⚠️ Please fill in all required fields highlighted above.";
                    feedbackEl.className = "form-feedback is-error";
                    feedbackEl.style.display = "block";
                }
                return;
            }

            // Dynamically construct WhatsApp booking message
            const message = 
`*BIKE RENTAL BOOKING REQUEST — ANIL BIKE RENTAL HAMPI*
---------------------------------------------
👤 Name: ${name}
📱 Mobile: ${mobile}
📅 From Date: ${fromDate}
📅 To Date: ${toDate}
🛵 Bike: ${bike}
🔢 Number of Bikes: ${numBikes}
📍 Pickup Location: ${pickup}
💬 Additional Message: ${notes || "None"}
---------------------------------------------
Hi Anil Bike Rental Hampi, please confirm bike availability, prices and booking details.`;

            // WhatsApp destination: +919353008180
            const waUrl = `https://wa.me/919353008180?text=${encodeURIComponent(message)}`;

            if (feedbackEl) {
                feedbackEl.textContent = "✓ Opening WhatsApp with your booking details...";
                feedbackEl.className = "form-feedback is-success";
                feedbackEl.style.display = "block";
            }

            // Open WhatsApp in new tab/window
            setTimeout(() => {
                window.open(waUrl, "_blank", "noopener,noreferrer");
            }, 300);
        });
    }

    // 7. SCROLL REVEAL ANIMATIONS (60FPS INTERSECTION OBSERVER)
    if ("IntersectionObserver" in window) {
        const animatedElements = document.querySelectorAll(
            ".benefit-card, .place-card, .step-card, .fleet-banner-card, .booking-card-wrapper, .final-cta-card"
        );

        animatedElements.forEach(el => el.classList.add("fade-up"));

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        });

        animatedElements.forEach(el => revealObserver.observe(el));
    }

})();
