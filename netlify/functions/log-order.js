const ALLOWED_ORIGINS = ['https://margreeta.com', 'https://www.margreeta.com'];

function corsHeaders(event) {
  const origin = (event.headers && (event.headers.origin || event.headers.Origin)) || '';
  const isLocalDev = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) || isLocalDev ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function formatOrderText(order) {
  const itemLines = (order.items || []).map((i) => {
    const line = `  - ${i.qty}x ${i.name} — ${i.price} EGP each (${i.qty * i.price} EGP)`;
    return i.extras && i.extras.length ? `${line}\n      + ${i.extras.join(', ')}` : line;
  }).join('\n') || '  (none)';

  const fulfillmentLines = order.fulfillment === 'pickup'
    ? [`Pickup Location: ${order.pickupLocation || ''}`, `Pickup Time: ${order.pickupTime || ''}`]
    : [`Delivery Address: ${order.address || ''}`, `Compound: ${order.compound || ''}`];

  return [
    `Order ID: ${order.orderId || 'N/A'}`,
    `Date/Time: ${order.dateTime || new Date().toISOString()}`,
    `Customer Name: ${order.customerName || ''}`,
    `Phone Number: ${order.phone || ''}`,
    '',
    'Items Ordered:',
    itemLines,
    '',
    `Total (EGP): ${order.total != null ? order.total : ''}`,
    ...fulfillmentLines,
    `Payment Method: ${order.paymentMethod || ''}`,
    `Notes: ${order.notes || '(none)'}`,
  ].join('\n');
}

exports.handler = async (event) => {
  const headers = corsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method not allowed' };
  }

  let order;
  try {
    order = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: 'Invalid JSON' };
  }

  if (!process.env.RESEND_API_KEY || !process.env.ORDER_NOTIFY_EMAIL) {
    console.error('log-order: missing RESEND_API_KEY or ORDER_NOTIFY_EMAIL env var');
    return { statusCode: 500, headers, body: 'Email is not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.ORDER_EMAIL_FROM || 'Margreeta Orders <orders@margreeta.com>',
        to: process.env.ORDER_NOTIFY_EMAIL,
        subject: `New order ${order.orderId || ''}`.trim(),
        text: formatOrderText(order),
      }),
    });

    if (!res.ok) {
      console.error('log-order: Resend API error', res.status, await res.text());
      return { statusCode: 502, headers, body: 'Email send failed' };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('log-order: unexpected error', err);
    return { statusCode: 500, headers, body: 'Internal error' };
  }
};
