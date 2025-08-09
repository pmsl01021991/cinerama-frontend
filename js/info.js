// @ts-nocheck

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
        this.peliculasInfo = this.getPeliculasInfo(); // ✅ Agrega esta línea
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
        const tipoCine = button.getAttribute('data-cine');
        const idFuncion = button.getAttribute('data-id-funcion'); // ✅

        localStorage.setItem('horarioSeleccionado', horarioSeleccionado);
        localStorage.setItem('tipoCine', tipoCine);
        localStorage.setItem('id_funcion', idFuncion); // ✅ Muy importante
       
        // Guardar la película también
        const parametro = new URLSearchParams(window.location.search);
        const pelicula = parametro.get('pelicula');

        const dataCine = this.peliculasInfo[pelicula];
        localStorage.setItem('dataCine', JSON.stringify(dataCine));

        

        // Se reemplazará por id_funcion desde backend
        window.location.href = './asientos.html';
    }

     // 🔽 Esta función ya la tenías, pero la necesitas dentro de la clase
    getPeliculasInfo() {
    return {
        lilo: {
            titulo: "Lilo y Stitch",
            director: "DEAN FLEISCHER CAMP",
            duracion: "01:48:00",
            estreno: "2025-05-22",
            reparto: "SYDNEY AGUDONG, MAIA KEALOHA, TIA CARRERE, ZACH GALIFIANAKIS, BILLY MAGNUSSEN",
            sinopsis: `Remake en imagen real de "Lilo & Stitch". Narra la historia de una niña hawaiana solitaria y un extraterrestre fugitivo que la ayuda a recomponer su familia rota.`,
            poster: "imagenes/banner1.jpg",
            categorias: ["TODO ESPECTADOR", "ANIMADO", "CINE COLOR"],
            trailer: "https://www.youtube.com/embed/9JIyINjMfcc",
            sala: '01',
            url: 'info.html?pelicula=lilo'
        },
        karate: {
            titulo: "Karate Kid: Leyendas",
            director: "JON M. CHU",
            duracion: "02:05:00",
            estreno: "2025-06-15",
            reparto: "JACKIE CHAN, RALPH MACCHIO, NUEVOS ACTORES",
            sinopsis: "Una nueva generación de Karate Kid que mezcla leyendas y jóvenes aprendices en un torneo mundial.",
            poster: "imagenes/karatekid.jpg",
            categorias: ["TODO ESPECTADOR", "ACCIÓN", "DRAMA"],
            trailer: "https://www.youtube.com/embed/ZWoFMg7XVHA",
            sala: '02',
            url: 'info.html?pelicula=karate'
        },
        encerrado: {
            titulo: "Encerrado",
            director: "ANTHONY HOPKINS",
            duracion: "01:50:00",
            estreno: "2025-07-10",
            reparto: "ANTHONY HOPKINS, OTROS ACTORES",
            sinopsis: "Un thriller psicológico donde un grupo queda atrapado en un extraño edificio.",
            poster: "imagenes/encerrado.jpg",
            categorias: ["MAYORES DE 14", "THRILLER", "DRAMA"],
            trailer: "https://www.youtube.com/embed/py7BEMruWZw",
            sala: '03',
            url: 'info.html?pelicula=encerrado'
        },
        hurry: {
            titulo: "Hurry",
            director: "DIRECTOR X",
            duracion: "01:40:00",
            estreno: "2025-08-01",
            reparto: "ACTORES Y ACTRICES",
            sinopsis: "Historia de una carrera contra el tiempo para salvar a una familia.",
            poster: "imagenes/hurry.jpg",
            categorias: ["TODO ESPECTADOR", "AVENTURA", "FAMILIAR"],
            trailer: "https://www.youtube.com/embed/zFxDwQK0yVQ",
            sala: '04',
            url: 'info.html?pelicula=hurry'
        }
    };
}
}


const btnHoraHandler = new BtnHoraHandler('.btn-hora');
