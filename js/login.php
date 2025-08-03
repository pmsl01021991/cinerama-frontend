<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    session_start();

    $captcha = $_POST['g-recaptcha-response'] ?? '';
    $user = $_POST['usuario'] ?? '';
    $pass = $_POST['password'] ?? '';

    error_log("Usuario recibido: " . $user);  // 👈 Registra el usuario
    error_log("Password recibido: " . $pass); // 👈 Registra la contraseña

    if (empty($captcha)) {
        echo "ERROR_CAPTCHA";
        exit;
    }

    // Validar reCAPTCHA
    $secretKey = "6Le6y5crAAAAAD7cOmzFwMy4LpdbdmVTpgcPAB0o";
    $ip = $_SERVER['REMOTE_ADDR'];
    $url = "https://www.google.com/recaptcha/api/siteverify?" . http_build_query([
    'secret' => $secretKey,
    'response' => $captcha,
    'remoteip' => $ip
]);

$response = file_get_contents($url);
    $responseKeys = json_decode($response, true);

    if (!isset($responseKeys["success"]) || !$responseKeys["success"]) {
        echo "ERROR_CAPTCHA";
        exit;
    }

    // Validación de usuario admin
    $adminUser = "admin@cinerama.com";
    $adminPass = "pmsl123";

    if ($user === $adminUser && $pass === $adminPass) {

        error_log("Credenciales VÁLIDAS"); 
        // Generar código 2FA
        $codigo = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 6);

        // Guardar en sesión
        $_SESSION['codigo_2fa'] = $codigo;
        $_SESSION['expira_2fa'] = time() + 300; // 5 min

        // Enviar el código por EmailJS desde frontend (opcional)
        // Si quieres enviar desde PHP nativo:
        $destinatario = "micanalxiexie@gmail.com";
        $asunto = "Código de verificación 2FA";
        $mensaje = "Tu código de verificación es: $codigo";

        $headers = "From: noreply@tusitio.com\r\n" .
                   "Reply-To: noreply@tusitio.com\r\n" .
                   "X-Mailer: PHP/" . phpversion();

        mail($destinatario, $asunto, $mensaje, $headers);

        echo "codigo_enviado";
        exit;
    } else {
        echo "LOGIN_INVALIDO";
        exit;
    }
}
?>
