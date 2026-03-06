import type { APIRoute } from 'astro';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  query_type: string;
  message: string;
}

interface CloudflareEnv {
  GOOGLE_SCRIPT_URL: string;
  [key: string]: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Validar origen
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = [
      'calculadoraimportacion.com.ar',
      'www.calculadoraimportacion.com.ar',
      'localhost:4321',
    ];

    const originHost = origin.replace('https://', '').replace('http://', '');
    if (!allowedOrigins.some(o => originHost.includes(o))) {
      return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parsear datos del formulario
    const formData = await request.formData();
    
    // Honeypot check
    if (formData.get('website')) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data: FormData = {
      first_name: formData.get('first_name') as string || '',
      last_name: formData.get('last_name') as string || '',
      email: formData.get('email') as string || '',
      phone: formData.get('phone') as string || '',
      query_type: formData.get('query_type') as string || '',
      message: formData.get('message') as string || '',
    };

    // Validar campos requeridos
    if (!data.first_name || !data.last_name || !data.email || !data.query_type || !data.message) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtener URL del Google Script desde variables de entorno de Cloudflare
    const env = locals.runtime?.env as CloudflareEnv | undefined;
    const scriptUrl = env?.GOOGLE_SCRIPT_URL || import.meta.env.GOOGLE_SCRIPT_URL;
    
    if (!scriptUrl) {
      console.error('GOOGLE_SCRIPT_URL no configurado');
      return new Response(JSON.stringify({ error: 'Error de configuración' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Enviar a Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        timestamp: new Date().toISOString(),
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || '',
        query_type: data.query_type,
        message: data.message,
      }).toString(),
    });

    if (!response.ok) {
      console.error('Error from Google Script:', await response.text());
      return new Response(JSON.stringify({ error: 'Error al procesar' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
      }
    });

  } catch (error) {
    console.error('Error processing form:', error);
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin') || '*';
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
};
