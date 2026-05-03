const hamburgerBtn = document.getElementById('hamburger-btn');
const navbar = document.getElementById('navbar');

if(hamburgerBtn && navbar) {
    hamburgerBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });
}

/* Carrusel continentes */
const track2 = document.getElementById("continents-track");
const prev2 = document.querySelector(".prev-continent");
const next2 = document.querySelector(".next-continent");

let index2 = 0;

function updateContinents() {
    const item = track2.children[0];
    const gap = 32;
    const width = item.offsetWidth + gap;

    track2.style.transform = `translateX(-${index2 * width}px)`;
}

if (track2 && prev2 && next2) {

    next2.addEventListener("click", () => {
        if (index2 < track2.children.length - 3) { // 👈 importante
            index2++;
            updateContinents();
        }
    });

    prev2.addEventListener("click", () => {
        if (index2 > 0) {
            index2--;
            updateContinents();
        }
    });

    window.addEventListener("resize", updateContinents);
}

/* ================= FILTROS ================= */
const filterButtons = document.querySelectorAll(".filter-btn");
const imageContainer = document.getElementById("filter-images");
const filtersSection = document.querySelector(".filters");

const data = {
    playas: [
        "./src/images/playa_stiniva_croacia_vis.jpg",
        "./src/images/playa2Corralejo.jpg",
        "./src/images/playa3la-digue-seychelles_bea7ddd0_1255x836.jpg"
    ],
    cascadas: [
        "./src/images/cascadasigazu.jpg",
        "./src/images/Cascada2niagara-falls---aerial-view--niagara-falls-tourism-.3l0.jpg",
        "./src/images/cascada3zambia-cataratas-victoria12.jpg"
    ],
    lagunas: [
        "./src/images/lago-di-braies-italia_1d38ca01_1254x836.jpg",
        "./src/images/Lagos2-de-Plitvice-el-secre.jpg",
        "./src/images/Lago3NahuelArgentina.jpg"
    ],
    volcanes: [
        "./src/images/cotopaxi-volcano-landscape.jpg",
        "./src/images/volca2TONGARIRO.jpg",
        "./src/images/volcan3MonteBromo.jpg"
    ],
    templos: [
        "./src/images/templos.jpg",
        "./src/images/Templo2MonasterionidodelTigre.jpg",
        "./src/images/tenplo3-LaSagradiaFamilia.jpg"
    ],
    castillos: [
        "./src/images/Castillo-de-Neuschwanstein.jpg",
        "./src/images/castillo2S-AlcazardeSegovia.jpg",
        "./src/images/Castillo3-de-Liechtenstein.jpg"
    ]
};

function showImages(category) {
    imageContainer.innerHTML = "";

    data[category].forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        imageContainer.appendChild(img);
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        const category = btn.dataset.category;
        showImages(category);
    });
});

filtersSection.addEventListener("mouseleave", () => {
    imageContainer.innerHTML = "";
});