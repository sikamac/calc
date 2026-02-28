<?php
// form-handler.php - Calculadora Importación Argentina - Form Handler
// Autor: GIST POINT S.A.S.

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/config');
$dotenv->load();

ini_set('display_errors', 1);
error_reporting(E_ALL);

// --- CONFIGURATION ---
$log_file = 'contact-submissions.log';
$template_path = __DIR__ . '/email_templates/';

function render_template($template_file, $data) {
    global $template_path;
    $content = file_get_contents($template_path . $template_file);
    foreach ($data as $key => $value) {
        $content = str_replace('{{' . $key . '}}', $value, $content);
    }
    return $content;
}

function send_email($from_name, $to, $subject, $body, $reply_to = null, $attachment = null) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['SMTP_HOST'];
        $mail->Port       = $_ENV['SMTP_PORT'];
        $mail->SMTPSecure = $_ENV['SMTP_ENCRYPTION'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SENDER_SMTP_USER'];
        $mail->Password   = $_ENV['SENDER_SMTP_PASS'];
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($_ENV['SENDER_SMTP_USER'], $from_name);
        $mail->addAddress($to);
        if ($reply_to) {
            $mail->addReplyTo($reply_to['email'], $reply_to['name']);
        }

        if ($attachment) {
            $mail->addAttachment($attachment['tmp_name'], $attachment['name']);
        }

        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body    = $body;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("PHPMailer Error: {$mail->ErrorInfo}");
        return false;
    }
}

if ($_SERVER["REQUEST_METHOD"] != "POST") { exit; }
if (!empty($_POST['website'])) { exit; }

session_start();
if ((time() - ($_SESSION['last_submission'] ?? 0)) < 30) {
    header("Location: /contacto?error=too_fast");
    exit;
}

// --- PROCESS FORM DATA ---
$form_type = $_POST['form_type'] ?? 'import_consultation';
$data = [
    'timestamp' => date('Y-m-d H:i:s T'),
    'ip_address' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT'],
    'email' => trim($_POST['email'] ?? ''),
    'phone' => trim($_POST['phone'] ?? '')
];

$admin_sent = false;

if ($form_type === 'import_consultation') {
    $from_name = $_ENV['IMPORT_FROM_NAME'];
    $redirect_page = '/contacto';
    $data['first_name'] = trim($_POST['first_name'] ?? '');
    $data['last_name'] = trim($_POST['last_name'] ?? '');
    $data['query_type'] = trim($_POST['query_type'] ?? '');
    $data['message'] = trim($_POST['message'] ?? '');

    if (empty($data['first_name']) || empty($data['last_name']) || empty($data['email'])) {
        header("Location: $redirect_page?error=missing_fields");
        exit;
    }

    $admin_subject = "Nueva Consulta de Importación - " . $data['first_name'] . " " . $data['last_name'];
    $admin_body = render_template('import_consultation_admin.txt', $data);
    $admin_sent = send_email(
        $from_name,
        $_ENV['IMPORT_TO_ADDRESS'],
        $admin_subject,
        $admin_body,
        ['email' => $data['email'], 'name' => $data['first_name'] . " " . $data['last_name']]
    );

    $reply_subject = "Hemos recibido su consulta - GIST POINT S.A.S.";
    $reply_body = render_template('import_consultation_autoreply.txt', $data);
    send_email($from_name, $data['email'], $reply_subject, $reply_body);
}

if ($admin_sent) {
    $_SESSION['last_submission'] = time();
    file_put_contents($log_file, date('Y-m-d H:i:s') . " SUCCESS: " . $data['email'] . "\n", FILE_APPEND);
    header("Location: $redirect_page?success=sent");
} else {
    file_put_contents($log_file, date('Y-m-d H:i:s') . " FAILED: " . $data['email'] . "\n", FILE_APPEND);
    header("Location: $redirect_page?error=failed");
}

exit;
