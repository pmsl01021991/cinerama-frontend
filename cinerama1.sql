use cinerama

CREATE TABLE cines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    ciudad VARCHAR(80),
    direccion VARCHAR(180),
    activo TINYINT(1) DEFAULT 1,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO cines (nombre, ciudad, direccion) VALUES
('CINERAMA PACIFICO', 'LIMA', 'AV JOSE PARDO 121 MIRAFLORES - LIMA - LIMA'),
('CINERAMA MINKA', 'CALLAO', 'AV ARGENTINA 3093 CC MINKA 2DO NIVEL CALLAO'),
('CINERAMA CHIMBOTE', 'CHIMBOTE', 'AV. V. RAUL H. DE LA TORRE MEGA PLAZA CHIMBOTE'),
('CINERAMA QUINDE', 'ICA', 'AV LOS MAESTROS S/N CC EL QUINDE'),
('CINERAMA TARAPOTO', 'TARAPOTO', 'AV ALFONSO UGARTE 1360 TARAPOTO'),
('CINERAMA CAJAMARCA', 'CAJAMARCA', 'JR SOR MANUELA GIL 151 CC EL QUINDE CAJAMARCA'),
('CINERAMA SOL', 'ICA', 'AV SAN MARTIN 727 CC PLAZA DEL SOL ICA'),
('CINERAMA HUACHO', 'HUACHO', 'COLON 601 CC PLAZA DEL SOL 2DO NIVEL'),
('CINERAMA MOYOBAMBA', 'MOYOBAMBA', 'JR MANUEL DEL AGUILA 542 MOYOBAMBA'),
('CINERAMA CUZCO', 'CUSCO', 'CALLE CRUZ VERDE 347 CC IMPERIAL PLAZA CUSCO'),
('CINERAMA PIURA', 'PIURA', 'AV GRAU 1460 CC. PLAZA DEL SOL');

CREATE TABLE peliculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,    -- lilo, karate, encerrado, hurry
    titulo VARCHAR(150) NOT NULL,
    director VARCHAR(120),
    duracion_min INT,
    clasificacion VARCHAR(50),
    genero VARCHAR(60),
    estado ENUM('EN_CARTELERA','PROXIMO','RETIRADO') DEFAULT 'EN_CARTELERA'
);

ALTER TABLE peliculas
ADD estreno DATE NULL,
ADD reparto TEXT NULL;

INSERT INTO peliculas (codigo, titulo, director, duracion_min, clasificacion, genero, estreno, reparto)
VALUES
('chavin', 'CHAVIN DE HUANTAR EL RESCATE DEL SIGLO', 'DIEGO DE LEÓN', 95, 'MAYORES DE 14', 'ANIMADO', '2025-10-30', 
 'ALFONSO DIBÓS, ANDRE SILVA, CARLOS THORNTON, CHRISTIAN ESQUIVEL, CONNIE CHAPARRO, MIGUEL IZA, RODRIGO SÁNCHEZ, SERGIO GALLIANI'),

('hurry', 'Hurry', 'DIRECTOR X', 100, 'TODO ESPECTADOR', 'AVENTURA/FAMILIAR', '2025-08-01',
 'Actores y actrices reconocidos'),

('zootopia2', 'ZOOTOPIA 2', 'JARED BUSH, BYRON HOWARD', 108, 'TODO ESPECTADOR', 'ANIMACIÓN', '2025-11-27',
 '-'),

('nada3', 'NADA ES LO QUE PARECE 3', 'RUBEN FLEISCHER', 112, 'MAYORES DE 14', 'ACCIÓN', '2025-11-13',
 'MORGAN FREEMAN, ROSAMUND PIKE, WOODY HARRELSON');


CREATE TABLE funciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cine_id INT NOT NULL,
    pelicula_id INT NOT NULL,
    tipo_cine ENUM('2D','3D') NOT NULL,
    sala VARCHAR(10) NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    precio DECIMAL(8,2) NOT NULL DEFAULT 12.00,
    FOREIGN KEY (cine_id) REFERENCES cines(id),
    FOREIGN KEY (pelicula_id) REFERENCES peliculas(id)
);


-- Supongamos:
-- CINERAMA PACIFICO tiene id = 1
-- Lilo y Stitch tiene id = 1

INSERT INTO funciones (cine_id, pelicula_id, tipo_cine, sala, fecha, hora, precio)
VALUES
(1, 1, '2D', '01', CURDATE(), '15:20:00', 12.00),
(1, 1, '2D', '01', CURDATE(), '17:00:00', 12.00),
(1, 1, '3D', '02', CURDATE(), '19:10:00', 15.00);


CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Paso 1: cine
    cine VARCHAR(120) NOT NULL,

    -- Paso 2: película (lo conectaremos cuando actualices info.js)
    pelicula_codigo VARCHAR(30) NULL,
    pelicula_titulo VARCHAR(150) NULL,

    -- Paso 3: horario (podemos vincular a funciones.id después)
    funcion_id INT NULL,
    tipo_cine VARCHAR(5) NULL,          -- '2D' o '3D'
    sala VARCHAR(10) NULL,
    horario VARCHAR(10) NULL,           -- '03:20 pm', etc.

    -- Paso 4: asientos
    asientos VARCHAR(255) NULL,         -- ej: 'A1,A2,A3'
    cantidad_entradas INT NULL,
    monto_entradas DECIMAL(8,2) NULL,

    -- Paso 5: pago (esto es lo que YA usa tu pago.js)
    nombre_cliente VARCHAR(120) NULL,
    correo_cliente VARCHAR(120) NULL,
    metodo_pago VARCHAR(30) NULL,       -- 'tarjeta' / 'billetera'
    billetera VARCHAR(20) NULL,         -- 'Yape' / 'Plin' / NULL
    estado ENUM('PENDIENTE','PAGADO','CANCELADO') DEFAULT 'PENDIENTE',

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);



ALTER TABLE reservas
ADD CONSTRAINT fk_reservas_funciones
FOREIGN KEY (funcion_id)
REFERENCES funciones(id);



ALTER TABLE reservas
ADD COLUMN tipo_sala ENUM('2D', '3D') AFTER pelicula;


select * from reservas r ;