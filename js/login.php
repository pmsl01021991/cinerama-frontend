<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    session_start();

    $captcha = $_POST['g-recaptcha-response'] ?? '';
    $user = $_POST['usuario'] ?? '';
    $pass = $_POST['password'] ?? '';

    if (empty($captcha)) {
        echo "ERROR_CAPTCHA";
        exit;
    }

    // Validar reCAPTCHA (usa file_get_contents o cURL)
    $secretKey = "6Le6y5crAAAAAD7cOmzFwMy4LpdbdmVTpgcPAB0o";
    $url = "https://www.google.com/recaptcha/api/siteverify?" . http_build_query([
        'secret' => $secretKey,
        'response' => $captcha,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ]);
    $response = file_get_contents($url);
    $responseKeys = json_decode($response, true);

    if (!isset($responseKeys["success"]) || !$responseKeys["success"]) {
        echo "ERROR_CAPTCHA";
        exit;
    }

    // Validar credenciales (admin hardcodeado)
    $adminUser = "admin@cinerama.com";
    $adminPass = "pmsl123";

    if ($user === $adminUser && $pass === $adminPass) {
        $_SESSION['admin_logged'] = true; // 👈 Sesión PHP
        echo "LOGIN_EXITOSO"; // 👈 Nueva respuesta
    } else {
        echo "LOGIN_INVALIDO";
    }
}
?>