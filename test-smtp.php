// test-smtp.php - Test de conexión SMTP
<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    $mail = new PHPMailer(true);
    
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->Port       = 587;
    $mail->SMTPSecure = 'tls';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'tu-email@gmail.com';
    $mail->Password   = 'tu-contraseña';

    $mail->setFrom('tu-email@gmail.com', 'Test');
    $mail->addAddress('tu-email@gmail.com');
    
    $mail->Subject = 'Test SMTP Connection';
    $mail->Body    = 'Conexión SMTP exitosa!';

    $mail->send();
    echo "✅ Conexión SMTP exitosa!";
} catch (Exception $e) {
    echo "❌ Error: {$mail->ErrorInfo}";
}
