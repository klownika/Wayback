import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// 🛠️ Importamos el método de la API de registro junto con su interfaz de datos
import { loginApi, registerClienteApi, type RegisterData } from '@/lib/api'; 

export type Role = 'client' | 'admin';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: Role; error?: string }>;
  // 🛠️ Agregada la firma del método de registro al tipo del contexto
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = 'wayback_auth_user';
const TOKEN_STORAGE_KEY = 'wayback_auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  useEffect(() => {
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, [token]);

  const isAdmin = user?.role === 'admin';

  // ── MÉTODO DE INICIO DE SESIÓN (LOGIN) ──
  const login = async (email: string, password: string): Promise<{ success: boolean; role?: Role; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass  = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      return { success: false, error: 'Ingresa tu email y contraseña.' };
    }

    const result = await loginApi(trimmedEmail, trimmedPass);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const apiUser = result.user; 
    const role: Role = apiUser?.rol === 'admin' ? 'admin' : 'client';

    const loggedUser: AuthUser = {
      id: Number(apiUser?.id ?? 0),
      name: String(apiUser?.usuario ?? trimmedEmail.split('@')[0]), 
      email: trimmedEmail,
      role,
    };

    setToken(result.token ?? 'session-active');
    setUser(loggedUser);

    return { success: true, role };
  };

  // ── 🛠️ NUEVO MÉTODO DE REGISTRO CON AUTO-LOGIN ASÍNCRONO ──
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    // 1. Enviamos la petición POST serializada al backend en Render
    const result = await registerClienteApi(data);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    // 2. ⚡ AUTO-LOGIN: Si el backend guardó el registro con éxito,
    // disparamos automáticamente el login con sus credenciales para saltar directo a la sesión activa.
    const loginResult = await login(data.Email, data.Contrasena);

    if (!loginResult.success) {
      return { success: false, error: 'Cuenta creada con éxito, pero falló el inicio de sesión automático.' };
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    // 🛠️ Incluimos el nuevo método 'register' dentro del proveedor de contexto global
    <AuthContext.Provider value={{ user, token, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}