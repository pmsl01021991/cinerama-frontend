<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $captcha = $_POST['g-recaptcha-response'] ?? '';
    $user = strtolower(trim($_POST['usuario'] ?? ''));
    $pass = trim($_POST['password'] ?? '');

    if (empty($captcha)) {
        echo json_encode(["status" => "error", "msg" => "Captcha no enviado"]);
        exit;
    }

    $secretKey = "6Le6y5crAAAAAD7cOmzFwMy4LpdbdmVTpgcPAB0o"; 
    $ip = $_SERVER['REMOTE_ADDR'];

    $response = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=" . urlencode($secretKey) .
        "&response=" . urlencode($captcha) .
        "&remoteip=" . urlencode($ip)
    );

    $responseKeys = json_decode($response, true);

    if (!isset($responseKeys["success"]) || !$responseKeys["success"]) {
        echo json_encode(["status" => "error", "msg" => "Captcha inválido"]);
        exit;
    }

    // Validación de usuario admin
    $adminUser = "admin@cinerama.com";
    $adminPass = "pmsl123";

    if ($user === strtolower($adminUser) && $pass === $adminPass) {
        echo json_encode(["status" => "ok"]);
    } else {
        echo json_encode(["status" => "fail"]);
    }
}
?>
