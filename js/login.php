<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $captcha = $_POST['g-recaptcha-response'] ?? '';
    $user = $_POST['usuario'] ?? '';
    $pass = $_POST['password'] ?? '';

    if (empty($captcha)) {
        echo "Captcha no enviado";
        exit;
    }

    $secretKey = "6Le6y5crAAAAAD7cOmzFwMy4LpdbdmVTpgcPAB0o"; // Tu clave secreta
    $ip = $_SERVER['REMOTE_ADDR'];

    $response = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=" . urlencode($secretKey) .
        "&response=" . urlencode($captcha) .
        "&remoteip=" . urlencode($ip)
    );

    $responseKeys = json_decode($response, true);

    if (!isset($responseKeys["success"]) || !$responseKeys["success"]) {
        echo "Captcha inválido";
        exit;
    }

    // Validación de usuario
    $adminUser = "admin@cinerama.com";
    $adminPass = "pmsl123";

    if ($user === $adminUser && $pass === $adminPass) {
        echo "OK";
    } else {
        echo "LOGIN_INVALIDO";
    }
}
?>