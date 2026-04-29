const hamburgerBtn = document.getElementById('hamburger-btn');
const navbar = document.getElementById('navbar');

if(hamburgerBtn && navbar) {
    hamburgerBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });
}
