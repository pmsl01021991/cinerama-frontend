-- db/schema.sql
CREATE DATABASE IF NOT EXISTS cinerama
    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE cinerama;

-- usuarios del sistema (admin/taquilla)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    pass_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin','taquilla') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- cines / locales
CREATE TABLE IF NOT EXISTS cines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL
);

-- películas (cartelera/estrenos)
CREATE TABLE IF NOT EXISTS peliculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    duracion_min INT,
    clasificacion VARCHAR(10),
    imagen VARCHAR(255),
    trailer_url VARCHAR(255),
    estado ENUM('cartelera','estreno','archivo') DEFAULT 'cartelera'
);

-- salas por cine (dimensiones del mapa de asientos)
CREATE TABLE IF NOT EXISTS salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cine INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    filas INT NOT NULL,
    columnas INT NOT NULL,
    FOREIGN KEY (id_cine) REFERENCES cines(id) ON DELETE CASCADE
);

-- asientos (pre-generados según filas/columnas)
CREATE TABLE IF NOT EXISTS seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sala INT NOT NULL,
    fila INT NOT NULL,
    columna INT NOT NULL,
    codigo VARCHAR(10) AS (CONCAT(CHAR(64+fila), LPAD(columna,2,'0'))) STORED,
    UNIQUE KEY uq_seat (id_sala, fila, columna),
    FOREIGN KEY (id_sala) REFERENCES salas(id) ON DELETE CASCADE
);

-- funciones (showtimes)
CREATE TABLE IF NOT EXISTS funciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cine INT NOT NULL,
    id_sala INT NOT NULL,
    id_pelicula INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    formato ENUM('2D','3D','IMAX') DEFAULT '2D',
    idioma ENUM('Sub','Dob') DEFAULT 'Dob',
    precio DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (id_cine) REFERENCES cines(id),
    FOREIGN KEY (id_sala) REFERENCES salas(id),
    FOREIGN KEY (id_pelicula) REFERENCES peliculas(id)
);

-- reserva cabecera
CREATE TABLE IF NOT EXISTS reservas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(8) NOT NULL UNIQUE,
    id_funcion INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(120),
    doc_tipo ENUM('DNI','CE','PASS') DEFAULT 'DNI',
    doc_num VARCHAR(30),
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente','pagado','cancelado','expirado') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_funcion) REFERENCES funciones(id)
);

-- detalle de asientos reservados
CREATE TABLE IF NOT EXISTS reserva_asientos (
    id_reserva BIGINT NOT NULL,
    id_seat INT NOT NULL,
    precio DECIMAL(8,2) NOT NULL,
    PRIMARY KEY (id_reserva, id_seat),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_seat) REFERENCES seats(id)
);

-- pagos (manual/automático)
CREATE TABLE IF NOT EXISTS pagos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_reserva BIGINT NOT NULL,
    metodo ENUM('tarjeta','yape','plin','efectivo') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    moneda CHAR(3) DEFAULT 'PEN',
    estado ENUM('pendiente','recibido','confirmado','fallido') DEFAULT 'pendiente',
    referencia VARCHAR(64),     -- nro de operación (Yape/Plin) si se ingresa
    payload JSON NULL,          -- espacio para adjuntar datos del PSP
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    FOREIGN KEY (id_reserva) REFERENCES reservas(id) ON DELETE CASCADE
);
