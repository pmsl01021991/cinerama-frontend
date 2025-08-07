
<?php
header('Content-Type: application/json');
include 'conexion.php';

if (!isset($_GET['id_funcion'])) {
    echo json_encode(['error' => 'Función no especificada']);
    exit;
}

$id_funcion = intval($_GET['id_funcion']);

$sql = "SELECT id, numero_asiento, disponible FROM asiento WHERE id_funcion = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_funcion);
$stmt->execute();
$resultado = $stmt->get_result();

$asientos = [];

while ($fila = $resultado->fetch_assoc()) {
    $asientos[] = $fila;
}

echo json_encode($asientos);
$conn->close();
?>
