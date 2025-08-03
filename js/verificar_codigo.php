<?php
session_start();

$codigo = $_POST['codigo_2fa'] ?? '';

if (!isset($_SESSION['codigo_2fa'])) {
    echo "SESION_EXPIRADA";
    exit;
}

if (time() > ($_SESSION['expira_2fa'] ?? 0)) {
    echo "SESION_EXPIRADA";
    session_destroy();
    exit;
}

if ($codigo === $_SESSION['codigo_2fa']) {
    unset($_SESSION['codigo_2fa']);
    echo "OK_2FA";
} else {
    echo "CODIGO_INVALIDO";
}
?>
