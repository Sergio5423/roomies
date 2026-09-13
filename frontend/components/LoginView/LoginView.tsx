import { ScreenHeader } from "@components/ScreenHeader/ScreenHeader";
import TextField from "@components/TextField/TextField";
import PasswordField from "@components/PasswordField/PasswordField";

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="m4 7 8 6 8-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface LoginViewProps {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  onSubmit: (event: React.FormEvent) => void;
  onNavigateRegister?: () => void;
  onForgotPassword?: () => void;
  onBack?: () => void;
}

export function LoginView({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  isLoading,
  error,
  onSubmit,
  onNavigateRegister,
  onForgotPassword,
  onBack,
}: LoginViewProps) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-7 shadow-lg shadow-green-900/5 border border-green-100">

          <ScreenHeader
            title="¡Hola de nuevo!"
            subtitle="Inicia sesión para continuar buscando tu lugar ideal."
            onBack={onBack}
          />

          <form
            onSubmit={onSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            <TextField
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@universidad.edu.co"
              icon={<MailIcon />}
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              autoComplete="email"
              required
            />

            <PasswordField
              label="Contraseña"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              autoComplete="current-password"
              required
            />

            <div className="flex justify-end -mt-2">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm font-medium text-green-700 transition-all duration-200 hover:text-green-800 hover:underline"
              >
                ¿Olvidé mi contraseña?
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <p
                  role="alert"
                  className="text-sm font-medium text-red-500"
                >
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="
                mt-2
                w-full
                rounded-xl
                bg-green-700
                px-5
                py-3.5
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-green-800
                hover:shadow-md
                hover:-translate-y-0.5
                active:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isLoading
                ? "Iniciando sesión..."
                : "Iniciar sesión"}
            </button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400">
                  ¿Nuevo en ROOMIES?
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Crea tu cuenta y encuentra tu lugar ideal
              </p>

              <button
                type="button"
                onClick={onNavigateRegister}
                className="
                  mt-2
                  inline-flex
                  items-center
                  gap-1
                  rounded-lg
                  px-4
                  py-2
                  font-semibold
                  text-green-700
                  transition-all
                  duration-200
                  hover:bg-green-50
                  hover:text-green-800
                  hover:gap-2
                  active:scale-95
                "
              >
                Regístrate aquí

                <span className="text-lg transition-transform duration-200">
                  →
                </span>
              </button>
            </div>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Encuentra vivienda. Encuentra compañeros. Encuentra tu lugar.
        </p>
      </div>
    </div>
  );
}