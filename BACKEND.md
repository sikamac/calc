# Backend para Calculadora de Importaciones Argentina

## Arquitectura Backend Implementada

El backend se ha desarrollado siguiendo el ejemplo de `dta-website`, usando **PHP** con **PHPMailer** para el envío de emails y **Composer** para la gestión de dependencias.

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

### Variables de Entorno Requeridas

Archivo `config/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_ENCRYPTION=tls
SENDER_SMTP_USER=tu-email@gmail.com
SENDER_SMTP_PASS=tu-contraseña-app

IMPORT_FROM_NAME=GIST POINT S.A.S.
IMPORT_TO_ADDRESS=consultas@gistpoint.com
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

### Pruebas Locales

Para probar localmente:
```bash
# Ejecutar servidor PHP en el directorio dist
cd dist && php -S localhost:8000
```

## Mejoras Futuras

- Implementar protección CSRF
- Validación de emails y teléfonos más robusta
- Recaptcha para protección contra bots
- Almacenamiento en base de datos (MySQL/PostgreSQL)
- Panel de administración para ver consultas
- Webhooks para integración con sistemas ERP/CRM
- Envío de emails HTML con plantillas más atractivas

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

## Troubleshooting

### Errores Comunes

1. **Email no enviado:** Verificar credenciales SMTP y config de host
2. **Port blocked:** Verificar que el puerto 587 esté abierto
3. **SSL errors:** Cambiar `SMTP_ENCRYPTION` a `ssl` o usar puerto 465
4. **Missing dependencies:** Ejecutar `composer install`
5. **Environment variables:** Verificar que config/.env exista y tenga valores válidos

### Logs

Los errores se registran en:
- Archivo `contact-submissions.log` (en el directorio del form-handler.php)
- PHP error log (configurable via php.ini)
