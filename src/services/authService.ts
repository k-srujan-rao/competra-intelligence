export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

const AUTH_TOKEN_KEY = 'competra_auth_token_v1';
const AUTH_USER_KEY = 'competra_auth_user_v1';

class AuthService {
  private user: AuthUser | null = null;
  private token: string | null = null;
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      if (storedToken && storedUser) {
        this.token = storedToken;
        this.user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.warn('Failed restoring auth session', e);
    }
    this.initialized = true;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public isAuthenticated(): boolean {
    return Boolean(this.token && this.user);
  }

  public getUser(): AuthUser | null {
    return this.user;
  }

  public getToken(): string | null {
    return this.token;
  }

  public async login(email: string, password: string): Promise<AuthUser> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    this.token = data.token;
    this.user = data.user;
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    this.notify();
    return data.user;
  }

  public async register(name: string, email: string, password: string, organization?: string): Promise<AuthUser> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, organization }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    this.token = data.token;
    this.user = data.user;
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    this.notify();
    return data.user;
  }

  public async demoLogin(): Promise<AuthUser> {
    return this.login('strategist@competra.ai', 'password123');
  }

  public async logout(): Promise<void> {
    if (this.token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${this.token}` },
        });
      } catch (e) {
        // silent fail on network disconnect
      }
    }
    this.token = null;
    this.user = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this.notify();
  }
}

export const authService = new AuthService();
