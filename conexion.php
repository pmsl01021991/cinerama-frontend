<?php
// Datos de conexión a tu base de datos
$host = "localhost";
$usuario = "root";           // Cambia si usas otro usuario
$contrasena = "1234";            // Cambia si usas contraseña
$basedatos = "cinerama";

// Crear conexión
$conn = new mysqli($host, $usuario, $contrasena, $basedatos);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Opcional: puedes imprimir esto para verificar
// echo "Conexión exitosa";
?>

