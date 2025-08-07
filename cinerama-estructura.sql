
-- Crear base de datos
DROP DATABASE IF EXISTS Cinerama;
CREATE DATABASE Cinerama;
USE cinerama;

-- Tabla de Cines
CREATE TABLE cine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255)
);

-- Tabla de Películas
CREATE TABLE pelicula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion INT,
    clasificacion VARCHAR(10),
    imagen VARCHAR(255)
);

-- Tabla de Funciones / Horarios
CREATE TABLE funcion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cine INT,
    id_pelicula INT,
    fecha DATE,
    hora TIME,
    FOREIGN KEY (id_cine) REFERENCES cine(id),
    FOREIGN KEY (id_pelicula) REFERENCES pelicula(id)
);

-- Tabla de Asientos
CREATE TABLE asiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_funcion INT,
    numero_asiento VARCHAR(10),
    disponible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_funcion) REFERENCES funcion(id)
);


DROP TABLE IF EXISTS cliente;

DROP TABLE IF EXISTS reserva;


DROP TABLE IF EXISTS pago;

DROP TABLE IF EXISTS reserva;

DROP TABLE IF EXISTS cliente;

CREATE TABLE cliente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100),
  metodo_pago VARCHAR(50),
  tipo_doc VARCHAR(20),
  numero_doc VARCHAR(20),
  telefono VARCHAR(20),
  billetera VARCHAR(20),
  id_funcion INT,
  id_asiento INT,
  FOREIGN KEY (id_funcion) REFERENCES funcion(id),
  FOREIGN KEY (id_asiento) REFERENCES asiento(id)
);

CREATE TABLE reserva (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT,
  fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);

CREATE TABLE pago (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_reserva INT,
  monto DECIMAL(10,2),
  estado VARCHAR(50),
  fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_reserva) REFERENCES reserva(id)
);


