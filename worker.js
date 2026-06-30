// ---------------------------------------------------------------------------
// HTML helper – fix #1: escape all user-supplied values in the email body
// ---------------------------------------------------------------------------
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/index.html') {
      url.pathname = '/';
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.endsWith('.html')) {
      url.pathname = url.pathname.slice(0, -5);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    if (url.pathname === '/api/leads' && request.method === 'GET') {
      return handleLeads(request, env);
    }

    const response = await env.ASSETS.fetch(request);
    return withStaticAssetHeaders(url, response);
  },
};

function withStaticAssetHeaders(url, response) {
  const headers = new Headers(response.headers);
  const pathname = url.pathname;
  const contentType = headers.get('Content-Type') || '';

  if (contentType.includes('text/html')) {
    headers.set('Content-Type', 'text/html; charset=UTF-8');
    headers.set(
      'Origin-Trial',
      'Ao87xuRJDyYKtW4lymmP7PUlVaXKEnMJcbXYG/oEpTnPTVIcRBkE1DPg1yqIarKeArwICwsF7s/+255Ak3lSKQ0AAABdeyJvcmlnaW4iOiJodHRwczovL2NhbGN1bGFkb3JhaW1wb3J0YWNpb24uY29tLmFyOjQ0MyIsImZlYXR1cmUiOiJXZWJNQ1AiLCJleHBpcnkiOjE3OTQ4NzM2MDB9'
    );
    headers.append(
      'Link',
      '</llms.txt>; rel="help alternate"; type="text/markdown"; title="Guia del sitio para agentes de IA"'
    );
  }

  if (pathname.startsWith('/assets/') || pathname.startsWith('/fonts/')) {
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

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
  // fix #2: guard against empty body or non-JSON Content-Type
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { name, email, phone, company, subject, message, lang } = data;
  const turnstileToken = data['cf-turnstile-response'];

  // fix #5: trim all fields once so every subsequent use is consistent
  const nameTrimmed    = name?.trim()    || '';
  const emailTrimmed   = email?.trim()   || '';
  const subjectTrimmed = subject?.trim() || '';
  const messageTrimmed = message?.trim() || '';
  const phoneTrimmed   = phone?.trim()   || null;
  const companyTrimmed = company?.trim() || null;

  // fix #7: allowlist lang to prevent arbitrary strings reaching the DB
  const safeLang = ['es', 'en'].includes(lang) ? lang : 'es';

  // fix #6: run cheap field checks BEFORE the external Turnstile call
  if (!nameTrimmed || !emailTrimmed || !subjectTrimmed || !messageTrimmed) {
    return new Response(JSON.stringify({ error: 'missing_fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (nameTrimmed.length > 200 || emailTrimmed.length > 254 ||
      (subjectTrimmed && subjectTrimmed.length > 500) || messageTrimmed.length > 5000 ||
      (companyTrimmed && companyTrimmed.length > 200) || (phoneTrimmed && phoneTrimmed.length > 50)) {
    return new Response(JSON.stringify({ error: 'input_too_long' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // fix #5 (continued): regex runs on the already-trimmed value
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
    return new Response(JSON.stringify({ error: 'invalid_email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // fix #3: guard against Turnstile siteverify being temporarily unreachable
  let verification;
  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: turnstileToken }),
    });
    verification = await verifyRes.json();
  } catch {
    return new Response(JSON.stringify({ error: 'captcha_failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!verification.success) {
    return new Response(JSON.stringify({ error: 'captcha_failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // fix #4: guard against DB failures returning an HTML 500
  try {
    await env.DB.prepare(
      "INSERT INTO impocalc_contacts (name, email, phone, company, subject, message, lang, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"
    ).bind(
      nameTrimmed,
      emailTrimmed,
      phoneTrimmed,
      companyTrimmed,
      subjectTrimmed,
      messageTrimmed,
      safeLang           // fix #7: use allowlisted value
    ).run();
  } catch {
    return new Response(JSON.stringify({ error: 'db_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await env.EMAIL.send({
      to: 'gistpoint.international@gmail.com',
      from: { email: 'info@gist-point.com', name: 'GIST POINT' },
      subject: `Nuevo contacto: ${subjectTrimmed.replace(/[\r\n]/g, ' ')}`,
      // fix #1: all user values are HTML-escaped before interpolation
      html: `<p><b>Nombre:</b> ${escapeHtml(nameTrimmed)}<br><b>Email:</b> ${escapeHtml(emailTrimmed)}<br><b>Empresa:</b> ${escapeHtml(companyTrimmed ?? '—')}<br><b>Teléfono:</b> ${escapeHtml(phoneTrimmed ?? '—')}<br><b>Asunto:</b> ${escapeHtml(subjectTrimmed)}<br><b>Mensaje:</b><br>${escapeHtml(messageTrimmed)}</p>`,
      text: `Nombre: ${nameTrimmed}\nEmail: ${emailTrimmed}\nEmpresa: ${companyTrimmed ?? '—'}\nTeléfono: ${phoneTrimmed ?? '—'}\nAsunto: ${subjectTrimmed}\nMensaje:\n${messageTrimmed}`,
    });
  } catch (e) {
    console.error('Email notification failed:', e);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
