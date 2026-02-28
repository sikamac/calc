// test-templates.php - Test para verificar plantillas de email
<?php
require 'vendor/autoload.php';

use Dotenv\Dotenv;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__ . '/config');
$dotenv->load();

// Datos de prueba
$data = [
    'first_name' => 'Juan',
    'last_name' => 'Pérez',
    'email' => 'juan@ejemplo.com',
    'phone' => '+54 11 1234-5678',
    'query_type' => 'calculos',
    'message' => 'Quiero calcular importaciones de electronica',
    'timestamp' => date('Y-m-d H:i:s'),
    'ip_address' => '192.168.1.100',
    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
];

function render_template($template_file, $data) {
    $template_path = __DIR__ . '/email_templates/';
    $content = file_get_contents($template_path . $template_file);
    foreach ($data as $key => $value) {
        $content = str_replace('{{' . $key . '}}', $value, $content);
    }
    return $content;
}

// Test admin template
echo "=== Email Admin ===\n";
echo render_template('import_consultation_admin.txt', $data);
echo "\n\n=== Email Usuario ===\n";
echo render_template('import_consultation_autoreply.txt', $data);
