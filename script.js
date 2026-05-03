// CONFIGURACIÓN Y DATOS DE VEHÍCULOS
const WHATSAPP_NUMBER = "18096015110";
const VEHICLES = [
    {
        id: 1,
        name: "CRV Touring 2021 Azul",
        price: 55,
        image: "Vehiculos/CRV Touring 2021 Azul.jpg",
        category: "SUV",
        features: ["5 Asientos", "Automático", "Touring Edition"]
    },
    {
        id: 2,
        name: "CRV Honda Blanca 2021",
        price: 55,
        image: "Vehiculos/CRV Honda Blanca 2021.jpg",
        category: "SUV",
        features: ["5 Asientos", "Automático", "Eco Mode"]
    },
    {
        id: 3,
        name: "Nissan Altima 2018 blanco",
        price: 35,
        image: "Vehiculos/Nissan Altima 2018 blanco.webp",
        category: "Sedán",
        features: ["5 Asientos", "Automático", "Confort"]
    },
    {
        id: 4,
        name: "Nissan Altima 2018 negro",
        price: 35,
        image: "Vehiculos/Nissan Altima 2018 negro.webp",
        category: "Sedán",
        features: ["5 Asientos", "Automático", "Elegante"]
    },
    {
        id: 5,
        name: "Honda Pilot 2016 Negra",
        price: 60,
        image: "Vehiculos/Honda Pilot 2016 Negra.jpg",
        category: "SUV / Familiar",
        features: ["7 Asientos", "4x4", "Espacioso"]
    },
    {
        id: 6,
        name: "CRV Honda 2016 Gris",
        price: 45,
        image: "Vehiculos/CRV Honda 2016 Gris.webp",
        category: "SUV",
        features: ["5 Asientos", "Automático", "Versátil"]
    },
    {
        id: 7,
        name: "CRV Honda 2021 Gris",
        price: 55,
        image: "Vehiculos/CR-V 2021 GRIS.webp",
        category: "SUV",
        features: ["5 Asientos", "Automático", "Moderna"]
    },
    {
        id: 8,
        name: "Super Moto 4k 450cc 2024",
        price: 45,
        image: "Vehiculos/Super Moto 4k 450cc 2024.jpeg",
        category: "Moto",
        features: ["450cc", "Deportiva", "Modelo 2024"]
    }
];

let selectedCar = null;

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    renderStockSlider();
    renderFeaturedCars();
    initNavbarEffect();
    initMobileMenu();
    initSmoothScroll();
    initBookingForm();
});

// NAVBAR EFFECT
function initNavbarEffect() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
}

// MOBILE MENU
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });
}

// STOCK SLIDER
function renderStockSlider() {
    const track = document.getElementById('stock-slider-track');
    const container = document.getElementById('stock-slider-container');
    if (!track) return;

    const displayVehicles = [...VEHICLES, ...VEHICLES, ...VEHICLES];
    track.innerHTML = displayVehicles.map(car => `
        <div class="stock-card">
            <img src="${car.image}" alt="${car.name}">
            <h3>${car.name}</h3>
            <p class="price">$${car.price} <span>/ día</span></p>
            <button onclick="openBookingModal(${car.id})" class="btn-sm">Reservar</button>
        </div>
    `).join('');

    let scrollAmount = 0;
    let isPaused = false;
    function step() {
        if (!isPaused) {
            scrollAmount += 0.8;
            if (scrollAmount >= track.scrollWidth / 3) scrollAmount = 0;
            container.scrollLeft = scrollAmount;
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    container.addEventListener('mouseenter', () => isPaused = true);
    container.addEventListener('mouseleave', () => isPaused = false);
    container.addEventListener('touchstart', () => isPaused = true);
    container.addEventListener('touchend', () => isPaused = false);
}

// FEATURED GRID
function renderFeaturedCars() {
    const grid = document.getElementById('featured-cars-grid');
    if (!grid) return;
    grid.innerHTML = VEHICLES.map(car => `
        <div class="car-card" data-aos="fade-up">
            <div class="car-img-box"><img src="${car.image}"></div>
            <div class="car-content">
                <span class="gold" style="font-size:0.8rem; font-weight:700;">${car.category}</span>
                <h3>${car.name}</h3>
                <div class="car-features">
                    ${car.features.map(f => `<span><i class="fas fa-check-circle"></i> ${f}</span>`).join('')}
                </div>
                <div class="car-footer">
                    <div class="car-price"><span>Desde</span><strong>$${car.price}</strong></div>
                    <button onclick="openBookingModal(${car.id})" class="btn btn-gold">Alquilar</button>
                </div>
            </div>
        </div>
    `).join('');
}

// CALCULAR TOTAL
function calculateTotal() {
    const startInput = document.getElementById('book-start');
    const endInput = document.getElementById('book-end');
    const totalBox = document.getElementById('modal-total-box');
    const totalPriceSpan = document.getElementById('modal-total-price');
    const summaryDays = document.getElementById('summary-days');
    const extraChecks = document.querySelectorAll('.extra-check');

    if (!selectedCar || !startInput.value || !endInput.value) {
        if (totalBox) totalBox.style.display = 'none';
        return;
    }

    const start = new Date(startInput.value);
    const end = new Date(endInput.value);

    // Diferencia en milisegundos
    const diffTime = end - start;
    // Convertir a días (mínimo 1 día)
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) diffDays = 1;

    let extrasTotal = 0;
    extraChecks.forEach(check => {
        if (check.checked) {
            extrasTotal += parseFloat(check.dataset.price || 0);
        }
    });

    const total = diffDays * (selectedCar.price + extrasTotal);

    if (summaryDays) summaryDays.innerText = diffDays;
    if (totalPriceSpan) totalPriceSpan.innerText = `RD$ ${total.toLocaleString()}`;
    if (totalBox) totalBox.style.display = 'block';
}

// MODAL LOGIC
function openBookingModal(carId) {
    selectedCar = VEHICLES.find(c => c.id === carId);
    if (!selectedCar) return;

    document.getElementById('modal-car-name').innerText = selectedCar.name;
    document.getElementById('modal-car-img').src = selectedCar.image;
    document.getElementById('modal-car-price').innerHTML = `<strong>$${selectedCar.price}</strong> / día`;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    document.getElementById('book-start').value = today;
    document.getElementById('book-start').min = today;
    document.getElementById('book-end').value = tomorrowStr;
    document.getElementById('book-end').min = tomorrowStr;

    calculateTotal();
    document.getElementById('booking-modal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.remove('active');
}

function initBookingForm() {
    const form = document.getElementById('modal-booking-form');
    const startInput = document.getElementById('book-start');
    const endInput = document.getElementById('book-end');
    const extraChecks = document.querySelectorAll('.extra-check');

    if (startInput) startInput.addEventListener('change', calculateTotal);
    if (endInput) endInput.addEventListener('change', calculateTotal);
    extraChecks.forEach(check => {
        check.addEventListener('change', calculateTotal);
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const start = document.getElementById('book-start').value;
            const end = document.getElementById('book-end').value;

            const startDate = new Date(start);
            const endDate = new Date(end);
            let diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) diffDays = 1;

            let selectedExtras = [];
            let extrasTotal = 0;
            extraChecks.forEach(check => {
                if (check.checked) {
                    const label = check.parentElement.innerText.split('(')[0].trim();
                    selectedExtras.push(label);
                    extrasTotal += parseFloat(check.dataset.price || 0);
                }
            });

            const total = diffDays * (selectedCar.price + extrasTotal);

            // FORMATO DE WHATSAPP
            let msg = "✨ *NUEVA RESERVA - MANAN RENT CAR* ✨\n\n";
            msg += `🚗 *Vehículo:* ${selectedCar.name}\n`;
            msg += `📅 *Desde:* ${start}\n`;
            msg += `📅 *Hasta:* ${end}\n`;
            msg += `⏳ *Duración:* ${diffDays} día${diffDays > 1 ? 's' : ''}\n`;

            if (selectedExtras.length > 0) {
                msg += `➕ *Extras:* ${selectedExtras.join(', ')}\n`;
            }

            msg += `💰 *Precio base/día:* $${selectedCar.price}\n`;
            msg += `💵 *TOTAL ESTIMADO:* RD$ ${total.toLocaleString()}\n\n`;
            msg += "==========================\n";
            msg += "¡Hola! Me gustaría confirmar la disponibilidad de este vehículo. 😊";

            const encoded = encodeURIComponent(msg);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;

            window.open(whatsappUrl, '_blank');
            closeBookingModal();
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target.id === 'booking-modal') closeBookingModal();
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        });
    });
}
