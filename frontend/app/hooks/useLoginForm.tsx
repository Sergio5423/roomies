import { useState, type FormEvent } from "react";

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResult {
  token: string;
}

// Simulación temporal: reemplaza esto por fetchAuthService.login cuando
// tengas infrastructure/auth/authService.ts listo.
async function fakeLogin({ email, password }: LoginCredentials): Promise<AuthResult> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (!email || !password) {
    throw new Error("Completa correo y contraseña.");
  }
  return { token: "fake-token" };
}

interface UseLoginFormOptions {
  onSuccess?: (result: AuthResult) => void;
}

export function useLoginForm({ onSuccess }: UseLoginFormOptions = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await fakeLogin({ email, password });
      onSuccess?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, isLoading, error, handleSubmit };
}