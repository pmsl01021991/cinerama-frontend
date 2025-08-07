<?php
include 'conexion.php';

// Validar que se enviaron los datos necesarios
if (
    isset($_POST['nombre']) &&
    isset($_POST['correo']) &&
    isset($_POST['metodo_pago'])
) {
    $nombre = trim($_POST['nombre']);
    $correo = trim($_POST['correo']);
    $metodo = trim($_POST['metodo_pago']);

    // Datos adicionales si se seleccionó billetera
    $tipo_doc = isset($_POST['tipo_doc']) ? trim($_POST['tipo_doc']) : null;
    $numero_doc = isset($_POST['numero_doc']) ? trim($_POST['numero_doc']) : null;
    $telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : null;
    $billetera = isset($_POST['billetera_usada']) ? trim($_POST['billetera_usada']) : null;

    // Asientos / función (si los tienes)
    $id_funcion = isset($_POST['id_funcion']) ? intval($_POST['id_funcion']) : null;
    $id_asiento = isset($_POST['id_asiento']) ? intval($_POST['id_asiento']) : null;

    // Insertar en la tabla cliente
    $stmt = $conn->prepare("INSERT INTO cliente 
        (nombre, correo, metodo_pago, tipo_doc, numero_doc, telefono, billetera, id_funcion, id_asiento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param(
        "sssssssii",
        $nombre, $correo, $metodo,
        $tipo_doc, $numero_doc, $telefono, $billetera,
        $id_funcion, $id_asiento
    );

    if ($stmt->execute()) {
        // Opcional: Marcar asiento como no disponible
        if ($id_asiento !== null) {
            $actualizar = $conn->prepare("UPDATE asiento SET disponible = 0 WHERE id = ?");
            $actualizar->bind_param("i", $id_asiento);
            $actualizar->execute();
        }

        echo "<h2>✅ ¡Pago registrado exitosamente!</h2>";
        echo "<p>Gracias, $nombre. Tu reserva ha sido procesada.</p>";
        echo "<a href='index.html'>Volver al inicio</a>";
    } else {
        echo "<h2>❌ Error al guardar los datos.</h2>";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "<h2>⚠️ Faltan datos obligatorios del formulario.</h2>";
}
?>
