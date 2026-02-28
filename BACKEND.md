# Backend para Calculadora de Importaciones Argentina

## 📋 **Documentación Completa del Backend**

El backend se ha desarrollado siguiendo el ejemplo de `dta-website`, usando **PHP** con **PHPMailer** para el envío de emails y **Composer** para la gestión de dependencias. Esta documentación incluye **todos los detalles técnicos** del sistema.

### Estructura de Archivos

```
├── config/                      # Configuración
│   ├── .env                     # Variables de entorno (privado)
│   └── .env.example            # Ejemplo de variables (publicado)
│
├── email_templates/            # Plantillas de emails
│   ├── import_consultation_admin.txt       # Email a admin
│   └── import_consultation_autoreply.txt   # Auto-respuesta al usuario
│
├── form-handler.php            # Manejador principal del formulario
├── composer.json               # Dependencies PHP
├── composer.lock               # Versiones exactas de dependencias
└── composer.phar               # Composer local (para instalación)
```

### Dependencias PHP

- **PHPMailer (v6.12.0):** Librería para envío de emails
- **phpdotenv (v5.6.3):** Carga de variables de entorno desde `.env`
- **polyfills:** Compatibilidad con PHP 8.0+

### Endpoint del Formulario

El formulario de contacto en `/contacto` envía datos a:
- **Ruta:** `/form-handler.php`
- **Método:** POST
- **Tipo de solicitud:** `import_consultation`

### Campos del Formulario

1. **first_name**: Nombre (obligatorio)
2. **last_name**: Apellido (obligatorio)
3. **email**: Email (obligatorio, validado por HTML5)
4. **phone**: Teléfono (opcional)
5. **query_type**: Tipo de consulta (obligatorio, opciones predefinidas)
6. **message**: Mensaje (obligatorio, textarea)

## 📝 **Variables de Entorno Completas**

Archivo `config/.env` - **Todas las variables disponibles:**

```env
# ==============================
# SMTP Configuration (Obligatorio)
# ==============================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_ENCRYPTION=tls
SENDER_SMTP_USER=tu-email@gmail.com
SENDER_SMTP_PASS=tu-contraseña-app

# ==============================
# Email Configuration
# ==============================
IMPORT_FROM_NAME=GIST POINT S.A.S.
IMPORT_TO_ADDRESS=consultas@gistpoint.com

# ==============================
# Security Settings
# ==============================
RATE_LIMIT_SECONDS=30
SESSION_TIMEOUT=1800

# ==============================
# Logging
# ==============================
LOG_FILE=contact-submissions.log
LOG_LEVEL=info

# ==============================
# Features
# ==============================
ENABLE_AUTOREPLY=true
ENABLE_ADMIN_EMAIL=true
ENABLE_LOGGING=true

# ==============================
# Debug
# ==============================
DEBUG=false
ERROR_REPORTING=1
```

### Flujo del Formulario

1. **Envío del Formulario:** El usuario llena el formulario en `/contacto`
2. **Validación:** El PHP valida:
   - Método POST
   - Campo honeypot (`website` vacío)
   - Tiempo mínimo entre envíos (30 segundos)
3. **Procesamiento:**
   - Renderiza templates de email
   - Envía email al administrador
   - Envía auto-respuesta al usuario
   - Guarda log de envío
4. **Redirección:**
   - `?success=sent`: Envío exitoso
   - `?error=failed`: Fallo en envío
   - `?error=missing_fields`: Campos obligatorios faltantes
   - `?error=too_fast`: Envío demasiado rápido

### Seguridad

- **Honeypot field:** Campo oculto para detectar bots
- **Rate limiting:** 30 segundos entre envíos
- **Input sanitization:** Trim() en todos los campos
- **CSRF:** No implementado (mejorar en próximas versiones)

### Build Process

El script `npm run build` incluye:
1. Construcción de la app Astro
2. Copia del form-handler.php al dist
3. Instalación de dependencias PHP con composer
4. Copia de vendor, email_templates y config al dist

## 🧪 **Pruebas y Desarrollo**

### Pruebas Locales

**Pasos completos para probar el backend localmente:**

```bash
# 1. Construir el proyecto
npm run build

# 2. Navegar al directorio dist
cd dist

# 3. Configurar variables de entorno
cp config/.env.example config/.env
# Editar config/.env con tus credenciales SMTP

# 4. Iniciar servidor PHP
php -S localhost:8000
```

### Probar el Formulario

1. Abre tu navegador en `http://localhost:8000/contacto`
2. Llena el formulario con datos válidos
3. Envía y verifica el resultado

**Respuestas esperadas:**
- ✅ `?success=sent`: Envío exitoso
- ❌ `?error=failed`: Error de SMTP
- ❌ `?error=missing_fields`: Campos obligatorios faltantes
- ❌ `?error=too_fast`: Envío demasiado rápido (menos de 30 seg)

### Prueba de Email Templates

Para verificar las plantillas sin enviar emails reales:

```php
<?php
// test-templates.php
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
```

Guardar como `test-templates.php` en `dist/` y ejecutar:
```bash
php test-templates.php
```

## 🚀 **Mejoras Futuras y Escalabilidad**

### Seguridad Avanzada
- **CSRF Protection:** Generar y validar tokens CSRF
- **ReCAPTCHA v3:** Detectar bots sin interacción del usuario
- **Content Security Policy (CSP):** Prevenir XSS
- **Rate Limiting:** Limitar envíos por IP y usuario

### Funcionalidades Adicionales
- **Almacenamiento en BD:** MySQL/PostgreSQL para almacenar consultas
- **Panel de Administración:** Dashboard para gestionar consultas
- **Email Templates HTML:** Plantillas responsive con estilos
- **Campaña Email:** Notificación a usuarios de actualizaciones
- **Seguimiento:** Enlaces de seguimiento en emails
- **Webhooks:** Integración con Slack, Trello, HubSpot
- **Exportar Datos:** CSV/Excel de consultas

### Rendimiento
- **Caching:** Memcached/Redis para datos frecuentes
- **Queue System:** RabbitMQ/Beanstalkd para envíos masivos
- **Load Balancing:** Nginx + PHP-FPM
- **CDN:** Cloudflare/AWS CloudFront para assets

### Monitoreo
- **Logging:** ELK Stack o Datadog
- **Alerting:** Slack/Email alerts
- **Analytics:** Metricas de conversión de formulario
- **Testing:** Test automatizados con PHPUnit

### API REST
```php
// Endpoints futuros
GET /api/consultas
GET /api/consultas/{id}
POST /api/consultas
PUT /api/consultas/{id}
DELETE /api/consultas/{id}
```

### Integración con servicios de terceros
- **CRM:** Salesforce, HubSpot
- **ERP:** SAP Business One, Odoo
- **Marketing:** Mailchimp, Klaviyo
- **Comercio:** Shopify, Magento

## Configuración de SMTP

### Gmail

1. Habilitar acceso a apps menos seguras (o usar App Passwords)
2. Configurar en `config/.env`:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_ENCRYPTION=tls`
   - `SENDER_SMTP_USER=tu-email@gmail.com`
   - `SENDER_SMTP_PASS=contraseña-app`

### Outlook/Hotmail

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_ENCRYPTION=tls
SENDER_SMTP_USER=tu-email@outlook.com
SENDER_SMTP_PASS=tu-contraseña
```

### SMTP Personalizado

Si usas un proveedor de hosting:
```env
SMTP_HOST=mail.tudominio.com
SMTP_PORT=587
SMTP_ENCRYPTION=tls
SENDER_SMTP_USER=no-reply@tudominio.com
SENDER_SMTP_PASS=contraseña
```

## 🔧 **Troubleshooting y Debugging**

### Errores Comunes y Soluciones

#### 1. **Error SMTP: Conexión Fallida**
- **Causa:** Credenciales SMTP inválidas
- **Solución:** 
  - Verificar que `config/.env` tenga credenciales correctas
  - Probar con App Password si usas Gmail
  - Verificar que el puerto SMTP esté abierto

#### 2. **Email no enviado - Sin Error**
- **Causa:** El email va a la carpeta de spam
- **Solución:**
  - Configurar SPF/DKIM para tu dominio
  - Usar un servidor SMTP de confianza
  - No usar IP dinámica

#### 3. **Port Blocked (Puerto Bloqueado)**
- **Causa:** ISP bloquea el puerto 587
- **Solución:**
  - Probar con puerto 465 (SSL)
  - Usar puerto 25 (sin encriptación - no recomendado)

#### 4. **SSL/TLS Errors**
- **Causa:** Certificado SSL no válido
- **Solución:**
  - Cambiar `SMTP_ENCRYPTION` a `''` (sin encriptación)
  - Verificar que el certificado del servidor SMTP sea válido

#### 5. **Missing Dependencies**
- **Causa:** Vendor folder no existe
- **Solución:**
  ```bash
  # Reinstalar dependencias
  rm -rf vendor/ composer.lock
  php composer.phar install --no-dev
  ```

#### 6. **Environment Variables Not Loaded**
- **Causa:** Archivo .env no encontrado
- **Solución:**
  ```bash
  cd dist
  cp config/.env.example config/.env
  # Editar con tus credenciales
  ```

#### 7. **Session Errors**
- **Causa:** Carpetas de sesión PHP no configuradas
- **Solución:**
  - Verificar que PHP tenga permisos para escribir en `/tmp`
  - Configurar `session.save_path` en php.ini

### Herramientas de Debugging

#### Verificar Conexión SMTP
```php
<?php
// test-smtp.php
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
```

#### Verificar Logs
1. **Contact Submissions Log:** `contact-submissions.log`
   ```bash
   cat contact-submissions.log
   ```

2. **PHP Error Log:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **Web Server Logs:**
   - Apache: `/var/log/apache2/error.log`
   - Nginx: `/var/log/nginx/error.log`

### Logs

Los errores se registran en:
- Archivo `contact-submissions.log` (en el directorio del form-handler.php)
- PHP error log (configurable via php.ini)
