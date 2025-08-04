<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    session_start();

    $captcha = $_POST['g-recaptcha-response'] ?? '';
    $user = $_POST['usuario'] ?? '';
    $pass = $_POST['password'] ?? '';

    // Debug: Verifica datos recibidos
    error_log("Usuario: $user | Pass: $pass | Captcha: " . (!empty($captcha) ? "OK" : "FALTANTE"));

    if (empty($captcha)) {
        echo "ERROR_CAPTCHA";
        exit;
    }

    // Validar reCAPTCHA (versión mejorada)
    $secretKey = "6Le6y5crAAAAAD7cOmzFwMy4LpdbdmVTpgcPAB0o";
    $url = "https://www.google.com/recaptcha/api/siteverify?" . http_build_query([
        'secret' => $secretKey,
        'response' => $captcha
    ]);

    $response = @file_get_contents($url); // @ suprime errores
    if ($response === false) {
        echo "ERROR_CONEXION";
        exit;
    }

    $responseKeys = json_decode($response, true);
    if (!isset($responseKeys["success"]) || !$responseKeys["success"]) {
        echo "ERROR_CAPTCHA";
        exit;
    }

    // Validar credenciales (DEBUG: Asegúrate que coincidan)
    $adminUser = "admin@cinerama.com";
    $adminPass = "pmsl123";
    error_log("Credenciales esperadas: $adminUser / $adminPass");

    if ($user === $adminUser && $pass === $adminPass) {
        $_SESSION['admin_logged'] = true;
        $_SESSION['usuario'] = $user; // Opcional: guarda el usuario
        echo "LOGIN_EXITOSO";
    } else {
        echo "LOGIN_INVALIDO";
    }
}
?>