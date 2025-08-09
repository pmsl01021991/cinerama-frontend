<?php
header('Content-Type: application/json');
include 'conexion.php';

$sql = "SELECT id, nombre, direccion, imagen FROM cine";
$resultado = $conn->query($sql);

$cines = [];

if ($resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $cines[] = $fila;
    }
}

echo json_encode($cines);
$conn->close();
?>
