const API_KEYS = process.env.API_KEYS || '';
const validKeys = API_KEYS.split(',');

export function checkApiKey(request, response) {
  const authHeader = request.headers['authorization'];

  if (!authHeader) {
    response.status(401).json({
      message: "Unauthorized: Missing Authorization header. You have to provide your API key in HTTP header.",
      support: "Get your API key here: https://harys.is-a.dev/api"
    });
    return false;
  }

  const token = authHeader.trim();

  if (!validKeys.includes(token)) {
    response.status(401).json({
      message: "Unauthorized: Invalid API key. You have to provide your API key in HTTP header.",
      support: "Get your API key here: https://harys.is-a.dev/api"
    });
    return false;
  }

  return true; // Authorized
}
