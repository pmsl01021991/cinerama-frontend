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
    document.body.classList.toggle('menu-open'); // 🔥 Esto es lo que hace que el slider se mueva
});

class TrailerModal {
    constructor(modalSelector, videoSelector, closeSelector) {
        this.modal = document.querySelector(modalSelector);
        this.trailerVideo = document.querySelector(videoSelector);
        this.closeButton = document.querySelector(closeSelector);

        // Cerrar modal al hacer click en la X
        this.closeButton.addEventListener('click', () => this.closeModal());

        // Cerrar modal al hacer click fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    openModal(videoUrl) {
        this.trailerVideo.src = videoUrl;
        this.modal.style.display = 'flex';
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.trailerVideo.src = ''; // Detener el video
    }
}

// Crear instancia del modal
const trailerModal = new TrailerModal('#trailerModal', '#trailerVideo', '.close');

// Seleccionar todos los botones de trailer
const trailerButtons = document.querySelectorAll('.btn-trailer');

// Asignar evento click a cada botón
trailerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const videoUrl = button.getAttribute('data-video');
        trailerModal.openModal(videoUrl);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const id_cine = params.get('id_cine');

    if (!id_cine) {
        alert("No se especificó el cine.");
        return;
    }

    fetch(`obtener-cartelera.php?id_cine=${id_cine}`)
        .then(response => response.json())
        .then(peliculas => {
            const contenedor = document.getElementById('contenedor-cartelera'); // Asegúrate que exista en tu HTML

            if (!peliculas.length) {
                contenedor.innerHTML = "<p>No hay películas disponibles para este cine.</p>";
                return;
            }

            peliculas.forEach(pelicula => {
                const div = document.createElement('div');
                div.classList.add('pelicula');

                div.innerHTML = `
                    <img src="imagenes/${pelicula.imagen || 'pelicula_generica.jpg'}" alt="${pelicula.titulo}">
                    <h3>${pelicula.titulo}</h3>
                    <p>${pelicula.descripcion}</p>
                    <a href="info.html?id_pelicula=${pelicula.id}&id_cine=${id_cine}" class="btn-info">INFO</a>
                `;

                contenedor.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error cargando la cartelera:', error);
        });
});

