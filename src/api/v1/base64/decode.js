import { corsMiddleware } from '../../data/cors.js';
import { checkApiKey } from '../../data/auth.js';

export default async function handler(req, res) {
  if (corsMiddleware(req, res)) return;

  if (!checkApiKey(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).send("Method Not Allowed: This endpoint only accepts 'POST' requests.");
    return;
  }

  const { string } = req.body;
  if (!string) {
    res.status(400).send("Missing 'string' in request body");
    return;
  }

  if (string.length > 1000000) {
    res.status(400).send('Input string too large');
    return;
  }

  const base64Regex = /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/;
  if (!base64Regex.test(string)) {
    res.status(400).send('Invalid base64 string');
    return;
  }

  try {
    const decodedContent = Buffer.from(string, 'base64').toString('utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.json({
      base64: {
        string: string,
        decoded: decodedContent
      },
      info: {
        credits: "Made by harys722, available for everyone.",
        support: "https://harys.is-a.dev/api"
      }
    });
  } catch (error) {
    console.error('Base64 decoding error:', error.message);
    res.status(400).send('Invalid base64 string format');
  }
}
