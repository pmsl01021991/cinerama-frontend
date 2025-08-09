<?php
header('Content-Type: application/json');
include 'conexion.php';

if (!isset($_GET['id_cine']) || !isset($_GET['id_pelicula'])) {
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$id_cine = intval($_GET['id_cine']);
$id_pelicula = intval($_GET['id_pelicula']);

$sql = "
    SELECT id, fecha, hora 
    FROM funcion 
    WHERE id_cine = ? AND id_pelicula = ?
    ORDER BY fecha, hora
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id_cine, $id_pelicula);
$stmt->execute();
$resultado = $stmt->get_result();

$horarios = [];

while ($fila = $resultado->fetch_assoc()) {
    $horarios[] = $fila;
}

echo json_encode($horarios);
$conn->close();
?>
