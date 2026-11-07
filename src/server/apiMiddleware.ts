import type { IncomingMessage, ServerResponse } from 'http';
import { generateCompetraResponse } from './geminiServer';
import { registerUser, loginUser, getUserByToken, logoutUser } from './auth';

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, data: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function extractToken(req: IncomingMessage): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse, next?: () => void): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/')) {
    return false;
  }

  try {
    // Health check
    if (url === '/api/health' && req.method === 'GET') {
      sendJson(res, 200, {
        status: 'ok',
        service: 'COMPETRA AI Intelligence Engine',
        timestamp: new Date().toISOString(),
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      });
      return true;
    }

    // Auth: Register
    if (url === '/api/auth/register' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.email || !body.password || !body.name) {
        sendJson(res, 400, { error: 'Name, email, and password are required.' });
        return true;
      }
      try {
        const result = registerUser(body.name, body.email, body.password, body.organization);
        sendJson(res, 201, result);
      } catch (err: any) {
        sendJson(res, 400, { error: err.message });
      }
      return true;
    }

    // Auth: Login
    if (url === '/api/auth/login' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.email || !body.password) {
        sendJson(res, 400, { error: 'Email and password are required.' });
        return true;
      }
      try {
        const result = loginUser(body.email, body.password);
        sendJson(res, 200, result);
      } catch (err: any) {
        sendJson(res, 401, { error: err.message });
      }
      return true;
    }

    // Auth: Current user (me)
    if (url === '/api/auth/me' && req.method === 'GET') {
      const token = extractToken(req);
      if (!token) {
        sendJson(res, 401, { error: 'Authentication token required.' });
        return true;
      }
      const user = getUserByToken(token);
      if (!user) {
        sendJson(res, 401, { error: 'Invalid or expired session.' });
        return true;
      }
      sendJson(res, 200, { user });
      return true;
    }

    // Auth: Logout
    if (url === '/api/auth/logout' && req.method === 'POST') {
      const token = extractToken(req);
      if (token) {
        logoutUser(token);
      }
      sendJson(res, 200, { message: 'Logged out successfully.' });
      return true;
    }

    // AI Chat with Gemini
    if (url === '/api/chat' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = await generateCompetraResponse(body);
      sendJson(res, 200, result);
      return true;
    }

    // Default 404 for unknown api routes
    sendJson(res, 404, { error: 'Route not found' });
    return true;
  } catch (err: any) {
    console.error('API middleware error:', err);
    sendJson(res, 500, { error: err.message || 'Internal Server Error' });
    return true;
  }
}
