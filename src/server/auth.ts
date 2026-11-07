import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  createdAt: string;
}

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

// In-memory persistent user store with demo user pre-configured
const users: Map<string, StoredUser> = new Map();
const sessions: Map<string, { userId: string; expiresAt: number }> = new Map();

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Seed demo strategist user
const demoSalt = crypto.randomBytes(16).toString('hex');
users.set('strategist@competra.ai', {
  id: 'usr-demo-01',
  name: 'Chief Strategy Officer',
  email: 'strategist@competra.ai',
  role: 'Enterprise Strategist',
  organization: 'Apex Intelligence Corp',
  createdAt: '2026-01-01T00:00:00Z',
  salt: demoSalt,
  passwordHash: hashPassword('password123', demoSalt),
});

export function registerUser(name: string, email: string, password: string, organization = 'Enterprise Strategic Unit'): { user: User; token: string } {
  const normalizedEmail = email.toLowerCase().trim();
  if (users.has(normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const id = `usr-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString();

  const user: StoredUser = {
    id,
    name: name.trim(),
    email: normalizedEmail,
    role: 'Senior Intelligence Analyst',
    organization: organization.trim(),
    createdAt: now,
    salt,
    passwordHash,
  };

  users.set(normalizedEmail, user);

  // Generate session token
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    userId: id,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const { salt: _, passwordHash: __, ...publicUser } = user;
  return { user: publicUser, token };
}

export function loginUser(email: string, password: string): { user: User; token: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const user = users.has(normalizedEmail) ? users.get(normalizedEmail) : null;

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    throw new Error('Invalid email or password.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, {
    userId: user.id,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  const { salt: _, passwordHash: __, ...publicUser } = user;
  return { user: publicUser, token };
}

export function getUserByToken(token: string): User | null {
  const session = sessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  for (const stored of users.values()) {
    if (stored.id === session.userId) {
      const { salt: _, passwordHash: __, ...publicUser } = stored;
      return publicUser;
    }
  }

  return null;
}

export function logoutUser(token: string): boolean {
  return sessions.delete(token);
}
