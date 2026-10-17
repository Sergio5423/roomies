import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../../src/components/navbar/navbar";
import Footer from "../../../src/components/footer/footer";
import { AuthStore } from "../../../src/application/services/auth.store";
import { Sparkles, Building, User } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await AuthStore.login(email, password);
      navigate("/habitaciones");
    } catch (err: any) {
      console.error("Error en login:", err);
      setError(err.message || "Credenciales inválidas o problema de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role: "ARRENDATARIO" | "ESTUDIANTE") => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (role === "ARRENDATARIO") {
        await AuthStore.loginDemoArrendatario();
      } else {
        await AuthStore.loginDemoEstudiante();
      }
      navigate("/habitaciones");
    } catch (err: any) {
      setError(err.message || "Error al iniciar demo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
          {/* Encabezado */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Acceso a la plataforma
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Bienvenido de nuevo
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Inicia sesión como <strong>Arrendatario</strong> para publicar o como <strong>Estudiante</strong> para buscar.
            </p>
          </div>

          {/* Accesos rápidos Demo */}
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">
              Acceso rápido para evaluación
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("ARRENDATARIO")}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                <Building className="h-3.5 w-3.5" />
                Arrendatario
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("ESTUDIANTE")}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                <User className="h-3.5 w-3.5" />
                Estudiante
              </button>
            </div>
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white transition ${
                  isSubmitting
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99]"
                }`}
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </div>
          </form>

          {/* Link al registro */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-600">
              ¿No tienes una cuenta aún?{" "}
              <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-500">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}