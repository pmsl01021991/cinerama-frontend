

-- Asegurarse de usar la base de datos
CREATE DATABASE IF NOT EXISTS cinerama;
USE cinerama;

CREATE TABLE IF NOT EXISTS cines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE salas
ADD cine_id INT NOT NULL,
ADD FOREIGN KEY (cine_id) REFERENCES cines(id) ON DELETE CASCADE;


-- =======================================
-- Tabla de usuarios
-- =======================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    es_admin BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================
-- Tabla de películas
-- =======================================
CREATE TABLE IF NOT EXISTS peliculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    duracion_min INT NOT NULL,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    fecha_estreno DATE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================
-- Tabla de salas
-- =======================================
CREATE TABLE IF NOT EXISTS salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(10) NOT NULL, -- Ej: 2D o 3D
    filas INT NOT NULL,
    columnas INT NOT NULL,
    pasillo VARCHAR(50), -- Guardamos como texto el array de pasillo
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================
-- Tabla de funciones
-- =======================================
CREATE TABLE IF NOT EXISTS funciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pelicula_id INT NOT NULL,
    sala_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id) ON DELETE CASCADE,
    FOREIGN KEY (sala_id) REFERENCES salas(id) ON DELETE CASCADE
);

-- =======================================
-- Tabla de reservas
-- =======================================
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    funcion_id INT NOT NULL,
    cantidad INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (funcion_id) REFERENCES funciones(id) ON DELETE CASCADE
);

-- =======================================
-- Tabla de asientos reservados
-- =======================================
CREATE TABLE IF NOT EXISTS asientos_reservados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reserva_id INT NOT NULL,
    asiento_codigo VARCHAR(10) NOT NULL, -- Ejemplo: A5
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE
);

-- =======================================
-- Datos iniciales opcionales
-- =======================================
INSERT INTO salas (nombre, tipo, filas, columnas, pasillo) VALUES
('Sala 1', '2D', 10, 10, '[7,8,2,3]'),
('Sala 2', '3D', 10, 11, '[2,3,7]');

select * from reservas

