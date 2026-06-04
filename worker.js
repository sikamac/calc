export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    if (url.pathname === '/api/leads' && request.method === 'GET') {
      return handleLeads(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleLeads(request, env) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token || token !== env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { results } = await env.DB.prepare(
    'SELECT id, name, email, phone, company, subject, message, lang, created_at FROM impocalc_contacts ORDER BY created_at DESC'
  ).all();

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleContact(request, env) {
  const data = await request.json();
  const { name, email, phone, company, subject, message, lang } = data;
  const turnstileToken = data['cf-turnstile-response'];

  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: turnstileToken }),
  });
  const verification = await verifyRes.json();
  if (!verification.success) {
    return new Response(JSON.stringify({ error: 'captcha_failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return new Response(JSON.stringify({ error: 'missing_fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'invalid_email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  await env.DB.prepare(
    "INSERT INTO impocalc_contacts (name, email, phone, company, subject, message, lang, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"
  ).bind(
    name.trim(),
    email.trim(),
    phone?.trim() || null,
    company?.trim() || null,
    subject.trim(),
    message.trim(),
    lang || 'es'
  ).run();

  try {
    await env.EMAIL.send({
      to: 'gistpoint.international@gmail.com',
      from: { email: 'info@gist-point.com', name: 'GIST POINT' },
      subject: `Nuevo contacto: ${subject.trim()}`,
      html: `<p><b>Nombre:</b> ${name.trim()}<br><b>Email:</b> ${email.trim()}<br><b>Empresa:</b> ${company?.trim() || '—'}<br><b>Teléfono:</b> ${phone?.trim() || '—'}<br><b>Asunto:</b> ${subject.trim()}<br><b>Mensaje:</b><br>${message.trim()}</p>`,
      text: `Nombre: ${name.trim()}\nEmail: ${email.trim()}\nEmpresa: ${company?.trim() || '—'}\nTeléfono: ${phone?.trim() || '—'}\nAsunto: ${subject.trim()}\nMensaje:\n${message.trim()}`,
    });
  } catch (e) {
    console.error('Email notification failed:', e);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
