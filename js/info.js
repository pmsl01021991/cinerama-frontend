// ===============================
// CARGAR FICHA DE LA PELÍCULA
// ===============================
const params = new URLSearchParams(window.location.search);
const codigo = params.get("pelicula");

const infoPeliculas = {
    chavin: {
        titulo: "CHAVIN DE HUANTAR EL RESCATE DEL SIGLO",
        director: "DIEGO DE LEÓN",
        duracion: "01:35:00",
        estreno: "2025-10-30",
        reparto: "ALFONSO DIBÓS, ANDRE SILVA, CARLOS THORNTON, ...",
        sinopsis: "En una operación de rescate sin precedentes...",
        poster: "imagenes/estrenos/CHAVIN_DE_HUANTAR.jpg",
        categorias: ["MAYORES DE 14", "ANIMADO", "BF"],
        trailer: "https://www.youtube.com/embed/12mqyFbUo6Q"
    },
    hurry: {
        titulo: "Hurry",
        director: "DIRECTOR X",
        duracion: "01:40:00",
        estreno: "2025-08-01",
        reparto: "Actores y actrices reconocidos",
        sinopsis: "Una emocionante carrera contra el tiempo.",
        poster: "imagenes/hurry.jpg",
        categorias: ["TODO ESPECTADOR", "AVENTURA", "FAMILIAR"],
        trailer: "https://www.youtube.com/embed/ZWoFMg7XVHA"
    },
    zootopia2: {
        titulo: "ZOOTOPIA 2",
        director: "JARED BUSH, BYRON HOWARD",
        duracion: "01:48:00",
        estreno: "2025-11-27",
        reparto: "-",
        sinopsis: "Judy Hopps y Nick vuelven a resolver un caso...",
        poster: "imagenes/estrenos/zootopia2.jpg",
        categorias: ["TODO ESPECTADOR", "ANIMACION", "CINECOLOR"],
        trailer: "https://www.youtube.com/embed/A-7RMaQaygI"
    },
    nada3: {
        titulo: "NADA ES LO QUE PARECE 3",
        director: "RUBEN FLEISCHER",
        duracion: "01:52:00",
        estreno: "2025-11-13",
        reparto: "MORGAN FREEMAN, ROSAMUND PIKE, ...",
        sinopsis: "Los cuatro jinetes regresan...",
        poster: "imagenes/estrenos/NADAESLOQUEPARECE.jpg",
        categorias: ["MAYORES DE 14", "ACCION", "BF"],
        trailer: "https://www.youtube.com/embed/wDJ2L37Xn94"
    }
};

const data = infoPeliculas[codigo];

// Cargar datos a la página
if(data){
    document.getElementById("poster-pelicula").src = data.poster;
    document.getElementById("titulo-pelicula").textContent = data.titulo;

    document.getElementById("director").textContent = data.director;
    document.getElementById("duracion").textContent = data.duracion;
    document.getElementById("estreno").textContent = data.estreno;
    document.getElementById("reparto").textContent = data.reparto;
    document.getElementById("sinopsis").textContent = data.sinopsis;

    // Categorías
    document.getElementById("categoria-1").textContent = data.categorias[0] || "";
    document.getElementById("categoria-2").textContent = data.categorias[1] || "";
    document.getElementById("categoria-3").textContent = data.categorias[2] || "";

    // Trailer
    const btn = document.getElementById("btnTrailer");
    btn.onclick = () => {
        document.getElementById("trailerVideo").src = data.trailer;
        document.getElementById("trailerModal").style.display = "flex";
    };
}


class BtnHoraHandler {
    constructor(selector) {
        this.buttons = document.querySelectorAll(selector);
        this.peliculasInfo = this.getPeliculasInfo();
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', (event) => this.handleClick(event));
        });
    }

    async handleClick(event) {
        const button = event.currentTarget;

        // Hora y tipo de sala (2D / 3D)
        const horarioSeleccionado = button.getAttribute('data-hora');
        const tipoCine = button.getAttribute('data-cine');   // ← OJO: nombre coherente

        // Código de la película que viene en la URL: ?pelicula=hurry
        const parametro = new URLSearchParams(window.location.search);
        const codigoPelicula = parametro.get('pelicula');    // ej: "hurry"

        const data = this.peliculasInfo[codigoPelicula];
        if (!data) {
            alert("Película no encontrada");
            return;
        }

        // id de la reserva creada en index (cuando eliges el cine)
        const reservaId = localStorage.getItem("reservaId");
        if (!reservaId) {
            alert("Selecciona primero un cine.");
            window.location.href = "index.html#cines";
            return;
        }

        // Guardamos info para la pantalla de asientos
        localStorage.setItem("dataCine", JSON.stringify(data));
        localStorage.setItem("horarioSeleccionado", horarioSeleccionado);
        localStorage.setItem("tipoCine", tipoCine); // ← la misma key que lees en asientos.js

        // Datos que van a la BD
        const peliculaCodigo = codigoPelicula;   // ej: "hurry"
        const peliculaTitulo = data.titulo;      // ej: "Hurry"

        try {
            const resp = await fetch(`http://localhost:3001/api/reservas/${reservaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pelicula_codigo: peliculaCodigo,
                    pelicula_titulo: peliculaTitulo,
                    tipo_cine: tipoCine,                 // '2D' o '3D'
                    sala: data.sala,                     // '01', '02', etc.
                    horario: horarioSeleccionado         // '04:00 pm'
                })
            });

            if (!resp.ok) throw new Error("Error al actualizar película");

            console.log("Reserva actualizada con película y horario");
            window.location.href = "./asientos.html";
        } catch (err) {
            console.error(err);
            alert("No se pudo actualizar la reserva.");
        }
    }

    getPeliculasInfo() {
        return {
            chavin: {
                titulo: "CHAVIN DE HUANTAR EL RESCATE DEL SIGLO",
                director: "DIEGO DE LEÓN",
                duracion: "01:35:00",
                estreno: "2025-10-30",
                reparto: "ALFONSO DIBÓS, ANDRE SILVA, CARLOS THORNTON, CHRISTIAN ESQUIVEL, CONNIE CHAPARRO, MIGUEL IZA, RODRIGO SÁNCHEZ, SERGIO GALLIANI",
                sinopsis: "En una operación de rescate sin precedentes, comandos de élite se infiltran en una embajada sitiada por terroristas para liberar a decenas de rehenes.",
                poster: "imagenes/estrenos/CHAVIN_DE_HUANTAR.jpg",
                categorias: ["MAYORES DE 14", "ANIMADO", "BF"],
                trailer: "https://www.youtube.com/embed/12mqyFbUo6Q",
                sala: "01",
                url: "info.html?pelicula=chavin"
            },
            hurry: {
                titulo: "Hurry",
                director: "DIRECTOR X",
                duracion: "01:40:00",
                estreno: "2025-08-01",
                reparto: "Actores y actrices reconocidos",
                sinopsis: "Una emocionante carrera contra el tiempo.",
                poster: "imagenes/hurry.jpg",
                categorias: ["TODO ESPECTADOR", "AVENTURA", "FAMILIAR"],
                trailer: "https://www.youtube.com/embed/ZWoFMg7XVHA",
                sala: "02",
                url: "info.html?pelicula=hurry"
            },
            zootopia2: {
                titulo: "ZOOTOPIA 2",
                director: "JARED BUSH, BYRON HOWARD",
                duracion: "01:48:00",
                estreno: "2025-11-27",
                reparto: "-",
                sinopsis: "La policía coneja Judy Hopps y su amigo el zorro Nick Wilde vuelven a unirse para resolver su caso más peligroso y complejo.",
                poster: "imagenes/estrenos/zootopia2.jpg",
                categorias: ["TODO ESPECTADOR", "ANIMACION", "CINECOLOR"],
                trailer: "https://www.youtube.com/embed/A-7RMaQaygI",
                sala: "03",
                url: "info.html?pelicula=zootopia2"
            },
            nada3: {
                titulo: "NADA ES LO QUE PARECE 3",
                director: "RUBEN FLEISCHER",
                duracion: "01:52:00",
                estreno: "2025-11-13",
                reparto: "MORGAN FREEMAN, ROSAMUND PIKE, WOODY HARRELSON",
                sinopsis: "Los cuatro jinetes vuelven con más giros, trampas y espectáculo que nunca.",
                poster: "imagenes/estrenos/NADAESLOQUEPARECE.jpg",
                categorias: ["MAYORES DE 14", "ACCION", "BF"],
                trailer: "https://www.youtube.com/embed/wDJ2L37Xn94",
                sala: "04",
                url: "info.html?pelicula=nada3"
            }
        };
    }
}

// Inicialización
const btnHoraHandler = new BtnHoraHandler('.btn-hora');
