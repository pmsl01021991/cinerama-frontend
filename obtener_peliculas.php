<?php
header('Content-Type: application/json');
include 'conexion.php';

if (!isset($_GET['id_cine'])) {
    echo json_encode(['error' => 'Cine no especificado']);
    exit;
}

$id_cine = intval($_GET['id_cine']);

$sql = "
    SELECT p.id, p.titulo, p.descripcion, p.imagen, p.trailer
    FROM pelicula p
    INNER JOIN funcion f ON p.id = f.id_pelicula
    WHERE f.id_cine = ?
    GROUP BY p.id
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_cine);
$stmt->execute();
$resultado = $stmt->get_result();

$peliculas = [];

while ($fila = $resultado->fetch_assoc()) {
    $peliculas[] = $fila;
}

echo json_encode($peliculas);
$conn->close();
?>
