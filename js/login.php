<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $captcha = $_POST['g-recaptcha-response'];
    $user = $_POST['usuario'];
    $pass = $_POST['password'];

    if (!$captcha) {
        echo "Captcha no enviado";
        exit;
    }

    $secretKey = "6Le6y5crAAAAAD7cOmzFwMy4LpdbdmVTpgcPAB0o";
    $ip = $_SERVER['REMOTE_ADDR'];
    $response = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$captcha."&remoteip=".$ip
    );
    $responseKeys = json_decode($response, true);

    if (!$responseKeys["success"]) {
        echo "Captcha inválido";
        exit;
    }

    // Validar usuario
    $adminUser = "admin@cinerama.com";
    $adminPass = "pmsl123";

    if ($user === $adminUser && $pass === $adminPass) {
        echo "OK";
    } else {
        echo "LOGIN_INVALIDO";
    }
}
?>
