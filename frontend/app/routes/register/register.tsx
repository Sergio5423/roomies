import { Form, redirect, useActionData, useNavigation, Link } from "react-router";
// import { AuthService } from "../../../src/application/services/auth.service"; // Lo usaremos luego

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  
  const nombre = formData.get("nombre") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rol = formData.get("rol") as 'Propietario' | 'Inquilino';

  // Validación básica en el servidor/action
  if (!nombre || !email || !password || !rol) {
    return { error: "Todos los campos son obligatorios." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  try {
    // Aquí conectaremos con el AuthService cuando el backend esté listo
    console.log("Registrando usuario:", { nombre, email, rol });
    
    // Si el registro es exitoso, lo enviamos al login para que inicie sesión
    return redirect("/login");
  } catch (error) {
    console.error("Error en registro:", error);
    return { error: "No se pudo crear la cuenta. El correo podría estar en uso." };
  }
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Encabezado */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Crea tu cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Únete a Roomies y encuentra tu lugar ideal.
          </p>
        </div>

        {/* Mensaje de Error */}
        {actionData?.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700">{actionData.error}</p>
          </div>
        )}

        {/* Formulario */}
        <Form method="post" className="mt-8 space-y-6">
          <div className="space-y-4">
            
            {/* Nombre Completo */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            {/* Correo Electrónico */}
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

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            {/* Selección de Rol (Mapeado a tu DDD del backend) */}
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                ¿Qué buscas hacer en Roomies?
              </label>
              <select
                id="rol"
                name="rol"
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-white sm:text-sm"
              >
                <option value="">Selecciona una opción...</option>
                <option value="Inquilino">Busco alquilar una habitación (Inquilino)</option>
                <option value="Propietario">Quiero publicar mi espacio (Propietario)</option>
              </select>
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
              {isSubmitting ? "Creando cuenta..." : "Registrarse"}
            </button>
          </div>
        </Form>

        {/* Link al Login */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}