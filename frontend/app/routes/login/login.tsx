import { Form, redirect, useActionData, useNavigation } from "react-router";
import { AuthService } from "../../../src/application/services/auth.service";

// 1. ACTION: Se ejecuta en el servidor cuando el usuario envía el formulario
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validación básica
  if (!email || !password) {
    return { error: "Por favor completa todos los campos." };
  }

  try {
    // Aquí llamas a tu servicio limpio
    // const respuesta = await AuthService.login(email, password);
    
    // NOTA: Como tu backend aún no tiene Login real, simularemos éxito por ahora
    console.log("Intentando login con:", email);
    
    // Si es exitoso, redirigimos al usuario a la página de habitaciones
    return redirect("/habitaciones");
  } catch (error) {
    console.error("Error en login:", error);
    return { error: "Credenciales inválidas o problema de conexión." };
  }
}

// 2. COMPONENTE VISUAL: La interfaz de usuario
export default function LoginPage() {
  const actionData = useActionData<typeof action>(); // Recupera errores del action
  const navigation = useNavigation(); // Nos dice si está cargando
  const isSubmitting = navigation.state === "submitting";

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Encabezado */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Bienvenido de nuevo</h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión para gestionar tus alojamientos o buscar roomies.
          </p>
        </div>

        {/* Mensaje de Error (si el Action lo devuelve) */}
        {actionData?.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700">{actionData.error}</p>
          </div>
        )}

        {/* FORMULARIO (Usa el <Form> de React Router) */}
        <Form method="post" className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </div>
        </Form>
      </div>
    </main>
  );
}