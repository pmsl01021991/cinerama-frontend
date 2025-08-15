USE cinerama;

INSERT INTO cines (nombre, direccion) VALUES
('CINERAMA PACIFICO', 'AV JOSE PARDO 121 MIRAFLORES - LIMA');

INSERT INTO salas (id_cine, nombre, filas, columnas)
VALUES (1, 'Sala 1', 10, 12);

-- genera asientos 10x12 para Sala 1
SET @filas = (SELECT filas FROM salas WHERE id=1);
SET @cols  = (SELECT columnas FROM salas WHERE id=1);
SET @sala  = 1;
DROP TEMPORARY TABLE IF EXISTS nums;
CREATE TEMPORARY TABLE nums (n INT);
INSERT INTO nums(n) VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11),(12),(13),(14),(15);
INSERT INTO seats(id_sala,fila,columna)
SELECT @sala, f.n, c.n
FROM nums f CROSS JOIN nums c
WHERE f.n BETWEEN 1 AND @filas AND c.n BETWEEN 1 AND @cols;

INSERT INTO peliculas (titulo, descripcion, duracion_min, clasificacion, imagen, trailer_url, estado) VALUES
('Karate Kid: Leyendas', 'Nueva entrega...', 120, 'PG-13', 'imagenes/karate.jpg', 'https://www.youtube.com/embed/VIDEOID', 'cartelera'),
('Lilo & Stitch',       'Live action...', 110, 'PG',    'imagenes/lilo.jpg',   'https://www.youtube.com/embed/VIDEOID2', 'estreno');

INSERT INTO funciones (id_cine, id_sala, id_pelicula, fecha, hora, formato, idioma, precio) VALUES
(1, 1, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '19:00:00', '2D', 'Dob', 18.00),
(1, 1, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '17:30:00', '2D', 'Sub', 18.00);
