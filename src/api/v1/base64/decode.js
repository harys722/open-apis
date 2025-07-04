import { corsMiddleware, withCors } from '../../data/cors.js';
const { checkApiKey } = require('../../data/auth');

export default async function handler(req, res) {
  if (corsMiddleware(req, res)) return;
  
  if (!checkApiKey(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send("Method Not Allowed: This endpoint only accepts 'POST' requests.");
    return;
  }

  const { string } = req.body;

  if (!string) {
    res.status(400).send("Missing 'string' in request body");
    return;
  }

  try {
    const decodedBuffer = Buffer.from(string, 'base64');
    const reEncoded = decodedBuffer.toString('base64');


    const decodedContent = decodedBuffer.toString('utf-8');

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
    res.status(400).send("Invalid base64 string");
    return;
  }
