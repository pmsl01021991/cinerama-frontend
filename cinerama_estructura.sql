
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

ALTER TABLE cine ADD imagen VARCHAR(255);

UPDATE cine SET imagen = 'cine_cajamarca.jpg' WHERE nombre = 'Cine Cajamarca';
UPDATE cine SET imagen = 'cine_minka.jpg'     WHERE nombre = 'Cine Minka';
UPDATE cine SET imagen = 'cine_chimbote.jpg' WHERE nombre = 'Cine Chimbote';
UPDATE cine SET imagen = 'cine_cuzco.jpg'     WHERE nombre = 'Cine Cuzco';
UPDATE cine SET imagen = 'cine_huacho.jpg' WHERE nombre = 'Cine Huacho';
UPDATE cine SET imagen = 'cine_moyobamba.jpg'     WHERE nombre = 'Cine Moyobamba';
UPDATE cine SET imagen = 'cine_pacifico.jpg' WHERE nombre = 'Cine Pacifico';
UPDATE cine SET imagen = 'cine_piura.jpg'     WHERE nombre = 'Cine Piura';
UPDATE cine SET imagen = 'cine_quinde.jpg'     WHERE nombre = 'Cine Quinde';
UPDATE cine SET imagen = 'cine_sol.jpg' WHERE nombre = 'Cine Sol';
UPDATE cine SET imagen = 'cine_tarapoto.jpg'     WHERE nombre = 'Cine Tarapoto';

select * from cine

-- Insertar cines
INSERT INTO cine (nombre, direccion) VALUES ('Cine Cajamarca', 'Jr. Amazonas 123, Cajamarca');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Minka', 'Av. Argentina 1234, Callao');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Chimbote', 'Av. Pacifico 456, Chimbote');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Cuzco', 'Calle Sol 789, Cuzco');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Huacho', 'Av. Grau 456, Huacho');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Moyobamba', 'Jr. Lamas 234, Moyobamba');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Pacifico', 'Av. Mar 567, Lima');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Piura', 'Av. Sullana 123, Piura');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Quinde', 'Calle Principal 999, Cajamarca');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Sol', 'Av. Bolívar 111, Lima');
INSERT INTO cine (nombre, direccion) VALUES ('Cine Tarapoto', 'Jr. Amazonas 456, Tarapoto');

SELECT * FROM cine WHERE nombre = 'Cine Moyobamba';

DELETE FROM cine WHERE id = 6;

UPDATE cine SET imagen = 'cine_cajamarca.jpg' WHERE nombre = 'Cine Cajamarca';
UPDATE cine SET imagen = 'cine_minka.jpg' WHERE nombre = 'Cine Minka';
UPDATE cine SET imagen = 'cine_chimbote.jpg' WHERE nombre = 'Cine Chimbote';
UPDATE cine SET imagen = 'cine_cuzco.jpg' WHERE nombre = 'Cine Cuzco';
UPDATE cine SET imagen = 'cine_huacho.jpg' WHERE nombre = 'Cine Huacho';
UPDATE cine SET imagen = 'cine_moyobamba.jpg' WHERE nombre = 'Cine Moyobamba';
UPDATE cine SET imagen = 'cine_pacifico.jpg' WHERE nombre = 'Cine Pacifico';
UPDATE cine SET imagen = 'cine_piura.jpg' WHERE nombre = 'Cine Piura';
UPDATE cine SET imagen = 'cine_quinde.jpg' WHERE nombre = 'Cine Quinde';
UPDATE cine SET imagen = 'cine_sol.jpg' WHERE nombre = 'Cine Sol';
UPDATE cine SET imagen = 'cine_tarapoto.jpg' WHERE nombre = 'Cine Tarapoto';


SELECT * FROM pelicula;

SELECT f.*, p.titulo 
FROM funcion f
JOIN pelicula p ON f.id_pelicula = p.id
WHERE f.id_cine = 1;


INSERT INTO pelicula (titulo, descripcion, duracion, clasificacion, imagen) VALUES
('Lilo y Stitch', 'Remake en imagen real de "Lilo & Stitch". Narra la historia de una niña hawaiana solitaria...', 108, 'TP', 'banner1.jpg'),
('Karate Kid: Leyendas', 'Una nueva generación de Karate Kid que mezcla leyendas y jóvenes aprendices...', 125, 'TP', 'karatekid.jpg'),
('Encerrado', 'Un thriller psicológico donde un grupo queda atrapado en un extraño edificio.', 110, '14+', 'encerrado.jpg'),
('Hurry', 'Historia de una carrera contra el tiempo para salvar a una familia.', 100, 'TP', 'hurry.jpg');

INSERT INTO funcion (id_cine, id_pelicula, fecha, hora) VALUES
(1, 1, '2025-08-08', '18:00:00'), -- Lilo y Stitch
(1, 2, '2025-08-08', '20:30:00'), -- Karate Kid
(1, 3, '2025-08-09', '17:45:00'), -- Encerrado
(1, 4, '2025-08-09', '21:00:00'); -- Hurry



SELECT f.*, p.titulo 
FROM funcion f
JOIN pelicula p ON f.id_pelicula = p.id
WHERE f.id_cine = 1;


