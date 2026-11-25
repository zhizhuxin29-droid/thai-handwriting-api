export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const bodyPayload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});

    const upstream = await fetch(
      'https://inputtools.google.com/request?itc=th-t-i0-handwrit&app=demopage',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyPayload
      }
    );

    const responseText = await upstream.text();
    res
      .status(upstream.status)
      .setHeader('Content-Type', 'application/json; charset=utf-8')
      .send(responseText);
  } catch (err) {
    res.status(502).json({
      error: 'Upstream request failed',
      detail: err && err.message ? err.message : String(err)
    });
  }
}
