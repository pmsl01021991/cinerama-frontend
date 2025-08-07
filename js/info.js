class Slider {
    constructor(selector, interval = 3000) {
        this.slides = document.querySelectorAll(`${selector} .slide`);
        this.currentSlide = 0;
        this.interval = interval;
        this.start();
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(this.currentSlide);
    }

    start() {
        this.showSlide(this.currentSlide);
        setInterval(() => this.nextSlide(), this.interval);
    }
}

// Inicialización
const slider = new Slider('.slider');


// Menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');


hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

class TrailerModal {
    constructor(modalSelector, videoSelector, closeSelector) {
        this.modal = document.querySelector(modalSelector);
        this.trailerVideo = document.querySelector(videoSelector);
        this.closeButton = document.querySelector(closeSelector);

        this.closeButton.addEventListener('click', () => this.closeModal());

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    openModal(videoUrl) {
        this.trailerVideo.src = videoUrl;
        this.modal.style.display = 'block';
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.trailerVideo.src = '';
    }
}

const trailerModal = new TrailerModal('#trailerModal', '#trailerVideo', '.close');

const trailerButtons = document.querySelectorAll('.btn-trailer');

trailerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const videoUrl = button.getAttribute('data-video');
        trailerModal.openModal(videoUrl);
    });
});

class InfoPelicula {
    constructor() {
        this.params = new URLSearchParams(window.location.search);
        this.pelicula = this.params.get('pelicula');

        this.titulo = document.querySelector('#titulo-pelicula');
        this.director = document.querySelector('#director');
        this.duracion = document.querySelector('#duracion');
        this.estreno = document.querySelector('#estreno');
        this.reparto = document.querySelector('#reparto');
        this.sinopsis = document.querySelector('#sinopsis');
        this.poster = document.querySelector('#poster-pelicula');

        this.categorias = {
            cat1: document.getElementById('categoria-1'),
            cat2: document.getElementById('categoria-2'),
            cat3: document.getElementById('categoria-3')
        };

        this.btnTrailer = document.querySelector('.btn-trailer');

        this.modal = document.querySelector('#trailerModal');
        this.trailerVideo = document.querySelector('#trailerVideo');
        this.closeButton = document.querySelector('.close');

        this.peliculasInfo = {
            // Películas quemadas aquí se eliminarán y se conectará con backend
        };

        this.cargarPelicula();
        this.configurarModal();
    }

    cargarPelicula() {
        // Esta función se modificará para usar PHP via fetch
    }

    configurarModal() {
        this.closeButton.addEventListener('click', () => this.cerrarModal());

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.cerrarModal();
            }
        });
    }

    abrirModal(trailerUrl) {
        this.trailerVideo.src = trailerUrl;
        this.modal.style.display = 'flex';
    }

    cerrarModal() {
        this.modal.style.display = 'none';
        this.trailerVideo.src = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InfoPelicula();
});

class BtnHoraHandler {
    constructor(selector) {
        this.buttons = document.querySelectorAll(selector);
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (event) => this.handleClick(event));
        });
    }

    handleClick(event) {
        const button = event.currentTarget;

        const horarioSeleccionado = button.getAttribute('data-hora');
        localStorage.setItem('horarioSeleccionado', horarioSeleccionado);

        const tipoCine = button.getAttribute('data-cine');
        localStorage.setItem('tipoCine', tipoCine);

        // Se reemplazará por id_funcion desde backend
        window.location.href = './asientos.html';
    }
}

const btnHoraHandler = new BtnHoraHandler('.btn-hora');
